import { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '../../context/useUser'
import './UserSettings.css'

const apiUrl = import.meta.env.VITE_API_URL

function UserSettings() {
    const { authUser, setAuthUser, logOut } = useUser()
    const [profileData, setProfileData] = useState([])

    useEffect(() => {
        fetchProfileData()
    }, [])

    const handleDelete = (e) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your profile and all associated data?"
        );

        if (!confirmed) return

        if (!authUser?.token) {
            alert('You are not logged in.')
            return
        }
        axios.delete(`${apiUrl}/api/user/delete`, {
            headers: {
                Authorization: `Bearer ${authUser.token}`,
            }
        })
            .then(logOut)
            .then(alert("Your account and all associated data have been deleted."))
            .catch(() => {
                alert("An error occurred while deleting your account.")
            })
    }

    const fetchProfileData = () => {
        if (!authUser?.token) {
            alert('You are not logged in.')
            return
        }
        axios.get(`${apiUrl}/api/user/data`, {
            headers: {
                Authorization: `Bearer ${authUser.token}`,
            }
        }).then((response) => {
            setProfileData(response.data);
            
        }).catch(() => {
            alert("An error occurred while fetching your profile data.")
        })
    }

    const handleDataChange = (e) => {
        e.preventDefault()
        const name = profileData.username
        const email = profileData.email

        axios.put(`${apiUrl}/api/user/data/update`, { username: name, email: email }, {
            headers: {
                Authorization: `Bearer ${authUser.token}`,
            }
        }).then((response) => {
            // Updating the authUser state and sessionStorage with the new username
            setAuthUser({ ...authUser, username: name })
            sessionStorage.setItem('authuser', JSON.stringify({ ...authUser, username: name }))

            // Refresh the profile data after update
            fetchProfileData(); 
            alert(response.data.message)
        }).catch((error) => {
            alert(error.response.data.message)
        })
    }

    return (
        <main>
            <div className="profile-form">
                <label htmlFor="username">Username:</label>
                <input
                type="text"
                id="username"
                value={profileData.username}
                placeholder="Enter new username"
                onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                />

                <label htmlFor="email">Email:</label>
                <input
                type="email"
                id="email"
                value={profileData.email}
                placeholder="Enter new email"
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                />
                <button className="edit-profile-button" type="button" onClick={handleDataChange}>Edit profile</button>
                <button className="delete-account-button" type="button" onClick={handleDelete}>Delete account</button>
            </div>
        </main>
    )
}

export default UserSettings