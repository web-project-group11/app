import { Outlet } from 'react-router-dom'
import Header from './components/General/Header.jsx';
import Footer from './components/General/Footer.jsx';

function App() {
  return (
    <div className="app-shell">
        <Header />
        <Outlet />
        <Footer />
    </div>
  );
}

export default App;
