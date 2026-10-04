import { useEffect, useState } from "react";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

import "./MemberList.css"

function MemberList({group}) {
    const { authUser } = useUser();

    // Members currently being shown
    const [shownMembers, setShownMembers] = useState([]);
    // All members retrieved so far
    const [members, setMembers] = useState([]);
    const membersPerPage = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    const headers = { Authorization: `Bearer ${authUser?.token}` }
    const dateFormatter = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        if (!group.id) return;
        // if group changes, reset fetched members
        fetchMembers(1);

        return () => {
            setMembers([]);
            setShownMembers([]);
            setCurrentPage(1);
            setPageCount(0);
        }
    }, [group.id]);

    const fetchMembers = async (page) => {
        try {
            const params = {
                page: page,
                limit: membersPerPage,
            };

            const response = await axios.get(
                `${apiUrl}/api/group/${group.id}/members`,
                { headers, params },
            );

            setMembers((prevMembers) => [...prevMembers, ...response.data.members]);
            setPageCount(Math.ceil(response.data.member_count / membersPerPage));
        
            setShownMembers(response.data.members);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNext = async () => {
        const nextPage = currentPage + 1;

        // If we already retrieved this page, don't fetch it again
        const startIndex = (nextPage - 1) * membersPerPage;
        const endIndex = startIndex + membersPerPage;
        console.log(members.length)
        console.log(endIndex)

        if (members.length >= endIndex) {
            setShownMembers(members.slice(startIndex, endIndex));
            setCurrentPage(nextPage);
            return;
        }

        // Otherwise fetch it
        await fetchMembers(nextPage);
        setCurrentPage(nextPage);
    };

    const handlePrevious = () => {
        if (currentPage === 1) return;

        const previousPage = currentPage - 1;

        // Need to calculate which reviews to slice from list of all reviews fetched so far so we can show the correct page
        const startIndex = (previousPage - 1) * membersPerPage;
        const endIndex = startIndex + membersPerPage;

        setShownMembers(members.slice(startIndex, endIndex));
        setCurrentPage(previousPage);
    };

    const handleMemberRemove = async (e) => {
        console.log(e.target.value)

        try {
            const response = await axios.delete(
                `${apiUrl}/api/group/${group.id}/members/${e.target.value}`,
                { headers },
            );

            fetchMembers(currentPage);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="member-list">
            {shownMembers.map((member) => (
                <div className="member" key={member.user_id}>
                    <div>
                        <h3>{member.username}</h3>
                        <p>{member.user_id === group.owner_id ? "Group owner" : "Member"}</p>
                        
                        <p>Joined {dateFormatter.format(new Date(member.created_at))}</p>
                    </div>
                    {(group.owner_id === authUser.id && member.user_id !== group.owner_id) && (
                        <button value={member.user_id} className="member-remove-button" onClick={handleMemberRemove}>Remove member</button>
                    )}
                </div>
            ))}

            {pageCount > 1 && (
                <div className="pagination">
                    <button onClick={handlePrevious} disabled={currentPage === 1}>
                        Previous
                    </button>

                    <span>
                        Page {currentPage} / {pageCount}
                    </span>

                    <button onClick={handleNext} disabled={currentPage >= pageCount}>
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}

export default MemberList