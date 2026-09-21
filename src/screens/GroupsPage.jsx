import { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../context/useUser'
import './GroupsPage.css'

const apiUrl = import.meta.env.VITE_API_URL

function GroupsPage() {
    const { authUser } = useUser()
    const [groups, setGroups] = useState([])
    const [isCreating, setIsCreating] = useState(false)
    const [newGroup, setNewGroup] = useState({ groupName: '', groupDesc: '' })
    const [error, setError] = useState('')

    useEffect(() => {
        axios.get(`${apiUrl}/api/group`)
            .then((response) => {
                setGroups(response.data.rows ?? response.data)
            })
            .catch((error) => {
                console.error('Failed to load groups:', error)
            })
    }, [])

    const authHeaders = { headers: { Authorization: `Bearer ${authUser?.token}` } }

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
                { ...response.data, member_count: 0 },
                ...currentGroups,
            ])
            setNewGroup({ groupName: '', groupDesc: '' })
            setIsCreating(false)
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Failed to create group')
        }
    }

    const handleDelete = async (groupId) => {
        if (!window.confirm('Delete this group?')) return

        setError('')
        try {
            await axios.delete(`${apiUrl}/api/group/${groupId}`, authHeaders)
            setGroups((currentGroups) => currentGroups.filter((group) => group.id !== groupId))
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Failed to delete group')
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
                    <h2>{group.group_name}</h2>
                    <div className="listing-actions">
                        <span>{group.member_count} members</span>
                        {authUser?.token && String(group.owner_id) === String(authUser.id) && (
                            <button type="button" onClick={() => handleDelete(group.id)}>
                                Delete group
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </main>
    )
}

export default GroupsPage