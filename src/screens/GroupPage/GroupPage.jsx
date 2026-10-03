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

    return (
        <main className='group-page'>
            <div className='group-info'>
                <h1>{group.group_name}</h1>
                <p>{group.member_count} {group.member_count > 1 ? 'members' : 'member'}</p>
                <h3>About this group</h3>
                <p>{group.description}</p>
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
                        <MemberList groupId={groupId} />
                    </>
                }
            </div>
        </main>
    )
}

export default GroupPage