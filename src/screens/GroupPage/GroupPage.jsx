import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { useUser } from "../../context/useUser.jsx";
import MemberList from "../../components/MemberList/MemberList.jsx";

import "./GroupPage.css";

const apiUrl = import.meta.env.VITE_API_URL;

function GroupPage() {
    // User context for checking if user is part of the group and if they are owner or member
    const { authUser } = useUser();
    const { groupId } = useParams();
    const [group, setGroup] = useState({});
    const [content, setContent] = useState('favorites');

    const [editGroup, setEditGroup] = useState({
        group_name: '',
        description: ''
    });
    const [editing, setEditing] = useState(false);
    
    const navigate = useNavigate();

    const authHeaders = { headers: { Authorization: `Bearer ${authUser?.token}` } }

    // IMPORTANT: add user to group as group member when the user creates a group

    useEffect(() => {
        // dont fetch membership yet if no user id or group id available
        if (!authUser.id || !groupId) return
        
        fetchMembership()

        // problem here is, if group does not exist, membership cant be retrieved
        // we probably want to display a group not found page if a group does not exist
        // but we cant check if group exists without getting all of the groups info
        // maybe just return "Group not found or you are not part of the group."?

        fetchGroup()
    }, [authUser.id, groupId])

    const fetchMembership = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/group/${groupId}/members/${authUser.id}`,
                authHeaders
            );

            // if user is not part of the group, redirect to groups list
            if (response.data.status === 'pending') {
                alert('Your group join request is pending.')
                navigate('/groups')
                return
            }
        } catch (error) {
            console.error(error)
            // if user is not a group member, redirect to groups list
            if (error.response?.status === 404) {
                navigate('/groups');
                alert('Group not found or you are not part of the group.');
            }
        }
    }

    const fetchGroup = async () => {
        try {
            const response = await axios.get(
                `${apiUrl}/api/group/${groupId}`,
                authHeaders
            );

            setGroup(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEditGroup = async () => {
        if (!editing) {
            setEditGroup({
                group_name: group.group_name,
                description: group.description
            });
        } else {

            try {
                const response = await axios.put(
                    `${apiUrl}/api/group/${groupId}`,
                    { group: editGroup },
                    authHeaders
                );

                fetchGroup()
            } catch (error) {
                console.error(error)
                alert(error.response?.data?.message ?? 'Failed to update group')
            }
        }

        setEditing(!editing);
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm('Delete this group?')) return

        try {
            await axios.delete(`${apiUrl}/api/group/${groupId}`, authHeaders)
            navigate('/groups')
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message ?? 'Failed to delete group')
        }
    }

    const handleLeaveGroup = async () => {
        if (!window.confirm('Leave this group?')) return

        try {
            await axios.delete(`${apiUrl}/api/group/${groupId}/leave`, authHeaders)
            navigate('/groups')
        } catch (error) {
            console.error(error)
            alert(error.response?.data?.message ?? 'Failed to leave group')
        }
    }

    return (
        <main className='group-page'>
            <div className='group-info'>
                <div className="group-info-header">
                    {editing ? (
                        <input
                            type="text"
                            value={editGroup.group_name}
                            onChange={(e) =>
                                setEditGroup({
                                    ...editGroup,
                                    group_name: e.target.value
                                })
                            }
                        />
                    ) : (
                        <h1>{group.group_name}</h1>
                    )}

                    
                    {authUser.id === group.owner_id ? (
                        <div className="group-actions">
                            <button onClick={handleEditGroup}>{!editing ? "Edit group" : "Finish editing"}</button>
                            <button className="group-delete-button" onClick={handleDeleteGroup}>Delete group</button>
                        </div>
                    ) : (
                        <div className="group-actions">
                            <button className="group-delete-button" onClick={handleLeaveGroup}>Leave group</button>
                        </div>
                    )}
                </div>
                
                <p>{group.member_count} {group.member_count > 1 ? 'members' : 'member'}</p>
                <h3>About this group</h3>
                {editing ? (
                    <textarea
                        value={editGroup.description}
                        onChange={(e) =>
                            setEditGroup({
                                ...editGroup,
                                description: e.target.value
                            })
                        }
                    />
                ) : (
                    <p>{group.description}</p>
                )}
            </div>
            <div className='group-tabs'>
                {
                    content === 'favorites' ? 
                    <>
                        <button id='selected'>Group Favorites</button>
                        <button onClick={() => (setContent('members'))}>Members</button>
                        <h2>Group favorites</h2>

                    </>
                    :
                    <>
                        <button  onClick={() => (setContent('favorites'))}>Group Favorites</button>
                        <button id='selected'>Members</button>
                        <h2>Group members</h2>
                        <MemberList group={group} />
                    </>
                }
            </div>
        </main>
    )
}

export default GroupPage