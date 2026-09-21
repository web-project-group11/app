import { Outlet } from 'react-router-dom'
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';

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
