import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';

function App() {
    return (
        <div className="app-shell">
            <Header />
            <div className="app-content">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default App;