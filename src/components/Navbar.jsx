import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
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

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src="/assets/logo1.png" alt="Saptpadi Logo" className="logo-img h-15 w-auto m-0 p-0" />
                <Link to="/" className="logo m-0 p-0">Saptpadi</Link>
            </div>
            
            <ul className="nav-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/destination">Destinations</Link></li>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/plan-budget">AI Budget Planer</Link></li>

               {token ? (
                    <>
                        {/* प्रोफाइल लिंक्स - रोलनुसार बदलतील */}
                        {userRole === 'vendor' ? (
                            <>
                                <li><Link to="/vendorprofile">Vendor Profile</Link></li>
                                <li><Link to="/vendor-dashboard" className="dash-link">Vendor Dashboard</Link></li>
                            </>
                        ) : (
                            <>
                                {/* फक्त My Profile ठेवली आहे, बाकी काढले आहे */}
                                <li><Link to="/profile">My Profile</Link></li>
                            </>
                        )}
                        
                        <li>
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register" className="register-btn">Join Us</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;






// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './Navbar.css';

// const Navbar = () => {
//     const navigate = useNavigate();
    
    
//     const user = JSON.parse(localStorage.getItem('user'));
//     const token = localStorage.getItem('token');
//     const userRole = user?.role;

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         alert("Logged out successfully!");
//         navigate('/login');
//     };

//     return (
//         <nav className="navbar">
//             <div className="navbar-brand">
//                 <img src="/assets/logo1.png" alt="Saptpadi Logo" className="logo-img h-15 w-auto m-0 p-0" />
//                 <Link to="/" className="logo m-0 p-0">Saptpadi</Link>
//             </div>
            
//             <ul className="nav-menu">
//                 <li><Link to="/">Home</Link></li>
//                 <li><Link to="/destination">Destinations</Link></li>
//                 <li><Link to="/services">Services</Link></li>
//                 <li><Link to="/plan-budget">AI Budget Planer</Link></li>
//                 return (
//                     <ul>
//                         <li><Link to="/profile">Profile</Link></li>

//                         {userRole === 'vendor' && (
//                                             <li><Link to="/vendorprofile">Vendor Profile</Link></li>
//                         )}

//                         {userRole === 'user' && (
//                            <li><Link to="/my-bookings">My Bookings</Link></li>
                            
//                         )}
//                     </ul>
//                 );
                
//                 {token ? (
//                     <>
                        
//                         {user?.role === 'vendor' ? (
//                             <li><Link to="/vendor-dashboard" className="dash-link">Vendor Dashboard</Link></li>
//                         ) : (
//                             <li><Link to="/customer-dashboard">My Account</Link></li>
//                         )}
//                         <li>
//                             <button onClick={handleLogout} className="logout-btn">Logout</button>
//                         </li>
//                     </>
//                 ) : (
//                     <>
//                         <li><Link to="/login">Login</Link></li>
//                         <li><Link to="/register" className="register-btn">Join Us</Link></li>
//                     </>
//                 )}
//             </ul>
//         </nav>
//     );
// };

// export default Navbar;