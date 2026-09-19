import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../context/useUser'
import './groupsPage.css'

const apiUrl = import.meta.env.VITE_API_URL

function GroupsPage() {
    const { authUser } = useUser()
    const [groups, setGroups] = useState([])

    useEffect(() => {
        axios.get(`${apiUrl}/api/group`)
            .then((response) => {
                setGroups(response.data.rows ?? response.data)
            })
            .catch((error) => {
                console.error('Failed to load groups:', error)
            })
    }, [])

    const handleJoin = (groupId) => {
        console.log(`Join group ${groupId}`)
    }

    return ( 
        <main className="group-list">
            <h1>Groups</h1>
            {groups.map((group) => (
                <div className="listing-container" key={group.id}>
                    <h2>{group.group_name}</h2>
                    <div className="listing-actions">
                        <span>{group.member_count} members</span>
                        {authUser?.token && (
                            <button type="button" onClick={() => handleJoin(group.id)}>
                                Join group
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </main>
    )
}

export default GroupsPage