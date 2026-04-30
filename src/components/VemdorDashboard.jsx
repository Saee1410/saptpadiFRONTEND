
import React, { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './VendorDashboard.css';



const VendorDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);


    const user = JSON.parse(localStorage.getItem('user'));

 useEffect(() => {
        const fetchBookings = async () => {
            if(!user || user.role !== 'vendor') {
                setLoading(false);
                return;
            }

            try {
                const vendorId = user._id || user.id;

                const response = await axios.get(
                    `https://saptpadi-frontend.vercel.app/api/bookings/vendor/${vendorId}`
                );

                console.log("Dashboard bookings:", response.data);

                if (response.data.success) {
                    setBookings(response.data.bookings);
                }

            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    
    //security check
    if(!user || user.role !== 'vendor'){
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', cursor: 'pointer' }}>Go to Login
                </button>
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    return (
        <div className='dashboard-container'>
            <header className='dashboard-nav'>
                <div className='logo-section'>
                    <h1>Saptpadi Vendor Dashboard</h1>
                </div>
                <div className='user-section'>
                    <span>Welcome, <strong>{user.name}</strong>(Vendor)</span>
                    <button className='logout-btn' onClick={handleLogout}>Logout</button>
                </div>
            </header>

            <main className='dashboard-content'>
                <div className='welcome-banner'>
                    <h1>Hello {user.name}! how's your business going?</h1>
                </div>

                <div className='stats-grid'>
                    <div className='stat-card'>
                        <div className='card-icon'>Add</div>
                        <h3>Total services</h3>
                        <p>Photography, Makeup, Catering, etc.</p>
                        <button 
                        className="action-btn" 
                        onClick={() => navigate('/vendor/add-service')}>
                            Add Services
                        </button>
                    </div>

                    <div className='stat-card'>
                        <div className='card-icon'>Orders</div>
                        <h3>Recent Bookings</h3>
                        <p>View and manage your recent bookings.</p>
                        <p>You have <strong>{bookings.length}</strong> active bookings.</p>
                        <button className="action-btn" onClick={() => navigate('/my-bookings')} style={{backgroundColor: '#1e90ff'}}>View All</button>
                    </div>


                    <div className='stat-card'>
                        <div className='card-icon'>Reviews</div>
                        <h3>Insights</h3>
                        <p>See what customers are saying about your services.</p>
                        <button
                         className="action-btn" 
                         onClick={() => navigate('/vendor/analytics')}
                         style={{backgroundColor: '#ff6347'}}>Analytics</button>
                    </div>

                   
                </div>
               
            </main>
        </div>
    )
}

export default VendorDashboard;