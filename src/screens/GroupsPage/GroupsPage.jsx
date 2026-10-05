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
        if (!authUser.id) return;

        fetchGroups();
    }, [authUser.id]);

    const fetchGroups = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/group`,
                authHeaders
            );

            // We need to get membership status of the authenticated user for each group so we know to display join group button or member status
            const groupsWithMembership = await Promise.all(
                response.data.rows.map(async (group) => {
                    try {
                        const response = await axios.get(
                            `${apiUrl}/api/group/${group.id}/members/${authUser.id}`,
                            authHeaders
                        );

                        return {
                            ...group,
                            membership: response.data.status,
                        };
                    } catch (error) {
                        if (error.response?.status === 404) {
                            return {
                                ...group,
                                membership: "none",
                            };
                        }

                        throw error;
                    }
                })
            );

            setGroups(groupsWithMembership);
        } catch (error) {
            console.error("Failed to load groups:", error);
        }
    };

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
                {
                    ...response.data,
                    member_count: 1,
                    membership: 'member',
                },
                ...currentGroups,
            ])
            setNewGroup({ groupName: '', groupDesc: '' })
            setIsCreating(false)
        } catch (requestError) {
            setError(requestError.response?.data?.message ?? 'Failed to create group')
        }
    }

    const handleJoin = async (groupId) => {
        try {
            const response = await axios.post(
                `${apiUrl}/api/group/${groupId}/join`,
                {},
                authHeaders
            );

            await fetchGroups();
        } catch (requestError) {
            console.error(requestError)
            alert(requestError.response?.data?.message ?? 'Failed to send join request')
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
                        {group.membership === "member" ? (
                            <Link to={`/groups/${group.id}`}>
                                <h3>{group.group_name}</h3>
                            </Link>
                        ) : (
                            <h3>{group.group_name}</h3>
                        )}
                        <p>{group.member_count} {group.member_count > 1 ? 'members' : 'member'}</p>
                    </div>
                    <div className="listing-actions">
                        {group.membership === "none" ? (
                            <button type="button" onClick={() => handleJoin(group.id)}>
                                Request to join
                            </button>
                        ) : (
                            <p>
                                {group.membership.charAt(0).toUpperCase() + group.membership.slice(1)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </main>
    )
}

export default GroupsPage