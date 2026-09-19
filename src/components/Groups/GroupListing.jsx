
function GroupListing({ group, onJoin, auth }) {
    return (
        <div className="listing-container">
            <h2>{group.group_name}</h2>
            <div className="listing-actions">
                <span>{group.member_count} members</span>
                {auth && (
                    <button type="button" onClick={() => onJoin(group.id)}>
                        Join group
                    </button>
                )}
            </div>
        </div>
    )
}

export default GroupListing