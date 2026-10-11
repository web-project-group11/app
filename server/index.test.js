import { expect } from 'chai';
import { pool } from './helper/db.js';

// Run tests from the project root while Docker is running:
// npm run test:docker

const apiUrl = 'http://backend-test:3001';

describe('User usecase ->', () => {
    const uniqueValue = Date.now();
    const newUser = {
        username: `test-user-${uniqueValue}`,
        email: `test-user-${uniqueValue}@example.com`,
        password: 'Password123'
    };
    let token;

    it('Registers a new user', async () => {
        const response = await fetch(`${apiUrl}/api/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: newUser })
        });
        const data = await response.json();

        expect(response.status, `Signup failed: ${JSON.stringify(data)}.`).to.equal(201);
        expect(data).to.include.keys(['id', 'username', 'email']);
    });

    it('Rejects a new user with an already-used username or email', async () => {
        const response = await fetch(`${apiUrl}/api/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: newUser })
        });
        const data = await response.json();

        expect(response.status, `Signup failed: ${JSON.stringify(data)}.`).to.equal(409);
        expect(data).to.include.keys(['message', 'status']);
    });

    it('Logs in and returns an authentication token', async () => {
        const response = await fetch(`${apiUrl}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: {
                    username: newUser.username,
                    password: newUser.password
                }
            })
        });
        const data = await response.json();

        expect(response.status, `Login failed: ${JSON.stringify(data)}.`).to.equal(200);
        expect(data).to.include.keys(['id', 'username', 'token']);
        token = data.token;
    });

    it('Accesses the protected profile endpoint with the token', async () => {
        const response = await fetch(`${apiUrl}/api/user/data`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        expect(response.status, `Protected request failed: ${JSON.stringify(data)}.`).to.equal(200);
        expect(data).to.include({ username: newUser.username, email: newUser.email });
    });

    it('Deletes the user with the authentication token and clears the token (logs out)', async () => {
        const response = await fetch(`${apiUrl}/api/user`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        expect(response.status, `Delete failed: ${JSON.stringify(data)}.`).to.equal(200);
        token = null;
    });

    it('Rejects access to the protected endpoint without a token', async () => {
        const response = await fetch(`${apiUrl}/api/user/data`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data).to.include({
            message: 'Invalid or expired token.',
            status: 401
        });
    });

    it('Rejects login with the wrong password', async () => {
        const response = await fetch(`${apiUrl}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: {
                    username: newUser.username,
                    password: newUser.password + 1
                }
            })
        });
        const data = await response.json();

        expect(response.status).to.equal(401);
        expect(data).to.include({
            message: 'Invalid username or password.',
            status: 401
        });
    });

    after(async () => {
        await pool.query('DELETE FROM account WHERE username = $1', [newUser.username]);
        await pool.end();
    });
});

describe('Review testing ->', () => {
    const testMedia = {
        type: 'movie',
        id: 1368337
    };

    it('Returns reviews by movie ID', async () => {
        const response = await fetch(`${apiUrl}/api/movie/reviews/${testMedia.type}/${testMedia.id}`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include({
            movie_id: testMedia.id,
            type: testMedia.type
        });
    });

    it('Returns an empty array for media without reviews', async () => {
        const response = await fetch(`${apiUrl}/api/movie/reviews/${testMedia.type}/99999999`);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.empty;
    });
});