import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../context/useUser'
import GroupListing from "./GroupListing"
import './styling/Groups.css'

const apiUrl = import.meta.env.VITE_API_URL

function GroupList() {
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
        <section className="group-list">
            <h1>Groups</h1>
            {groups.map((group) => (
                <GroupListing
                    key={group.id}
                    group={group}
                    onJoin={handleJoin}
                    auth={Boolean(authUser?.token)}
                />
            ))}
        </section>
    )
}

export default GroupList