import { Outlet } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../context/useUser'

const apiUrl = import.meta.env.VITE_API_URL;

function ProfilePage() {
    const { authUser, logOut } = useUser()

    const handleDelete = (e) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your profile and all associated data?"
        );

        if (!confirmed) return;

        if (!authUser?.token) {
            alert('You are not logged in.');
            return;
        }
        axios.delete(`${apiUrl}/api/user/delete`, {
            headers: {
                Authorization: `Bearer ${authUser.token}`,
            }
        })
            .then(logOut)
            .then(alert("Your account and all associated data have been deleted."))
            .catch((error) => {
                console.error("Error deleting user:", error);
                alert("An error occurred while deleting your account.");
            });
    }

    return (
        <main>
            <div>
                <p>Profile Page</p>
                <button type="button" onClick={handleDelete}>Delete account</button>
            </div>
        </main>
    )
}

export default ProfilePage