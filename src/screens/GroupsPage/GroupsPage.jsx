import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../context/useUser'
import './GroupsPage.css'
import { Link } from 'react-router-dom'

const apiUrl = import.meta.env.VITE_API_URL

function GroupsPage() {
    const { authUser } = useUser()
    const [groups, setGroups] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [newGroup, setNewGroup] = useState({ groupName: '', groupDesc: '' })
    const [error, setError] = useState('')

    const authHeaders = { headers: { Authorization: `Bearer ${authUser?.token}` } }

    useEffect(() => {
        axios.get(`${apiUrl}/api/group`, authHeaders)
            .then((response) => {
                setGroups(response.data.rows ?? response.data)
            })
            .catch((error) => {
                console.error('Failed to load groups:', error)
            })
    }, [])

    const handleCreate = async (event) => {
        event.preventDefault()
        setError('')

        try {
            const response = await axios.post(
                `${apiUrl}/api/group`,
                { group: newGroup },
                authHeaders
            )
            setGroups((currentGroups) => [
                { ...response.data, member_count: 1 },
                ...currentGroups,
            ])
            setNewGroup({ groupName: '', groupDesc: '' })
            setIsCreating(false)
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Failed to create group')
        }
    }

    return ( 
        <main className="group-list">
            <div className="group-list-header">
                <h1>Groups</h1>
                {authUser?.token && (
                    <button type="button" onClick={() => setIsCreating((current) => !current)}>
                        {isCreating ? 'Cancel' : 'Create group'}
                    </button>
                )}
            </div>
            {isCreating && (
                <form className="create-group-form" onSubmit={handleCreate}>
                    <label>
                        Group name
                        <input
                            required
                            value={newGroup.groupName}
                            onChange={(event) => setNewGroup({ ...newGroup, groupName: event.target.value })}
                        />
                    </label>
                    <label>
                        Description
                        <textarea
                            required
                            value={newGroup.groupDesc}
                            onChange={(event) => setNewGroup({ ...newGroup, groupDesc: event.target.value })}
                        />
                    </label>
                    <button type="submit">Create group</button>
                </form>
            )}
            {error && <p role="alert">{error}</p>}
            {groups.map((group) => (
                <div className="listing-container" key={group.id}>
                    <div>
                        <Link to={`/groups/${group.id}`}>
                            <h3>{group.group_name}</h3>
                        </Link>
                        <p>{group.member_count} {group.member_count > 1 ? 'members' : 'member'}</p>
                    </div>
                    <div className="listing-actions">
                        <button type="button" onClick={() => handleDelete(group.id)}>
                            Join group button / member status here
                        </button>
                    </div>
                </div>
            ))}
        </main>
    )
}

export default GroupsPage