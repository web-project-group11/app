import { Link } from 'react-router-dom'
//import NowPlayingSection from '../components/HomePage/NowPlaying'
import GroupList from '../components/Groups/GroupList'

function GroupsPage() {
    return ( 
        <main>
            <div>
                <GroupList/>
            </div>
        </main>
    )
}

export default GroupsPage