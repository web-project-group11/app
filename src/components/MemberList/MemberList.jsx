import { useEffect, useState } from "react";
import { useUser } from "../../context/useUser.jsx";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

import "./MemberList.css"

function MemberList({groupId}) {
    const { authUser } = useUser();

    // Members currently being shown
    const [shownMembers, setShownMembers] = useState([]);
    // All members retrieved so far
    const [members, setMembers] = useState([]);
    const [memberCount, setMemberCount] = useState(0);
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
        if (!groupId) return;
        fetchMembers(1);
    }, [groupId]);

    const fetchMembers = async (page) => {
        try {
            const params = {
                page: page,
                limit: membersPerPage,
            };

            const response = await axios.get(
                `${apiUrl}/api/group/${groupId}/members`,
                { headers, params },
            );

            setMembers((prevMembers) => [...prevMembers, ...response.data.members]);
            setPageCount(Math.ceil(response.data.member_count / membersPerPage));
            //setMemberCount(response.data.member_count);
        
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

    return (
        <div className="member-list">
            {shownMembers.map((member) => (
                <div className="member" key={member.user_id}>
                    <h3>{member.username}</h3>
                    <p>Member since {dateFormatter.format(new Date(member.created_at))}</p>
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