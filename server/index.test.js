import { expect } from "chai"
import { pool } from "./helper/db.js"

const apiUrl = "http://backend-test:3001"
describe("User authentication", () => {
    const uniqueValue = Date.now()
    const newUser = {
        username: `test-user-${uniqueValue}`,
        email: `test-user-${uniqueValue}@example.com`,
        password: "Password123"
    }
    let token

    it("registers a new user", async () => {
        const response = await fetch(`${apiUrl}/api/user/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: newUser })
        })
        const data = await response.json()

        expect(response.status, `Signup failed: ${JSON.stringify(data)}`).to.equal(201)
        expect(data).to.include.keys(["id", "username", "email"])
    })

    it("logs in and returns an authentication token", async () => {
        const response = await fetch(`${apiUrl}/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: {
                    username: newUser.username,
                    password: newUser.password
                }
            })
        })
        const data = await response.json()

        expect(response.status, `Login failed: ${JSON.stringify(data)}`).to.equal(200)
        expect(data).to.include.keys(["id", "username", "token"])
        token = data.token
    })

    it("accesses the protected profile endpoint with the token", async () => {
        const response = await fetch(`${apiUrl}/api/user/data`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()

        expect(response.status, `Protected request failed: ${JSON.stringify(data)}`).to.equal(200)
        expect(data).to.include({ username: newUser.username, email: newUser.email })
    })

    it("deletes the user with the authentication token", async () => {
        const response = await fetch(`${apiUrl}/api/user/delete`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()

        expect(response.status, `Delete failed: ${JSON.stringify(data)}`).to.equal(200)
        token = null
    })

    it("rejects users protected endpoint without token", async () => {
        const response = await fetch(`${apiUrl}/api/user/data`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = await response.json()

        expect(response.status).to.equal(401)
        expect(data).to.include({
            message: "Invalid or expired token",
            status: 401
        })
    })

    it("rejects logging in with wrong password", async () => {
        const response = await fetch(`${apiUrl}/api/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user: {
                    username: newUser.username,
                    password: newUser.password + 1
                }
            })
        })
        const data = await response.json()

        expect(response.status).to.equal(401)
        expect(data).to.include({
            message: "Invalid username or password",
            status: 401
        })
    })

    after(async () => {
        await pool.query("DELETE FROM account WHERE username = $1", [newUser.username])
        await pool.end()
    })
})
