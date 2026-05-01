import React from 'react';
import { Link, useNavigate, useState } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const userRole = user?.role?.toLowerCase(); // Case-sensitivity टाळण्यासाठी lowerCase केले

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Logged out successfully!");
        navigate('/login');
    };

    const closeMobileMenu = () => setIsActive(false);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src="/assets/logo1.png" alt="Saptpadi Logo" className="logo-img h-15 w-auto m-0 p-0" />
                <Link to="/" className="logo m-0 p-0">Saptpadi</Link>
            </div>

            <div className="menu-icon" onClick={() => setIsActive(!isActive)}>
                <div className={isActive ? "bar bar1-active" : "bar"}></div>
                <div className={isActive ? "bar bar2-active" : "bar"}></div>
                <div className={isActive ? "bar bar3-active" : "bar"}></div>
            </div>
            
            <ul className={isActive ? "nav-menu active" : "nav-menu"}>
                <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
                <li><Link to="/destination" onClick={closeMobileMenu}>Destinations</Link></li>
                <li><Link to="/services" onClick={closeMobileMenu}>Services</Link></li>
                <li><Link to="/plan-budget" onClick={closeMobileMenu}>AI Budget Planer</Link></li>

               {token ? (
                    <>
                        {/* प्रोफाइल लिंक्स - रोलनुसार बदलतील */}
                        {userRole === 'vendor' ? (
                            <>
                                <li><Link to="/vendorprofile" onClick={closeMobileMenu}>Vendor Profile</Link></li>
                                <li><Link to="/vendor-dashboard" className="dash-link" onClick={closeMobileMenu}>Vendor Dashboard</Link></li>
                            </>
                        ) : (
                            <>
                                {/* फक्त My Profile ठेवली आहे, बाकी काढले आहे */}
                                <li><Link to="/profile" onClick={closeMobileMenu}>My Profile</Link></li>
                            </>
                        )}
                        
                        <li>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" onClick={closeMobileMenu}>Login</Link></li>
                        <li><Link to="/register" className="register-btn" onClick={closeMobileMenu}>Join Us</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;