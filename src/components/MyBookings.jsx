import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddService.css';

const MyBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {

            const userData = localStorage.getItem('user');
            if(!userData) {
            console.log("No user data found in localStorage");
            setLoading(false);
            return; 
            }
            const user = JSON.parse(userData);
            const uId = user?._id || user?.id;

            if (!uId) {
                console.log("User ID not found");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(
                    `http://localhost:5000/api/bookings/vendor/${uId}`
                );

                console.log("API Response:", res.data); // DEBUG

                if (res.data.success) {
                    setBookings(res.data.bookings);
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className='bookings-page'>
            <header className="page-header">
                <button 
                    className='back-link' 
                    onClick={() => navigate('/vendor-dashboard')}
                >
                    Back to Dashboard
                </button>
                <h1>All Bookings</h1>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className='booking-table-wrapper'>
                    <table className='bookings-table'>
                        <thead>
                            <tr>
                                <th>Sr.no</th>
                                <th>Customer Name</th>
                                <th>Service Booked</th>
                                <th>Booking Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
<tbody>
    {bookings.length > 0 ? (
        bookings.map((order, index) => (
            <tr key={order._id}>
                <td>{index + 1}</td>

                {/* ✅ Customer Details (populated from User model) */}
                <td>
                    <div className="customer-info">
                        <strong>{order.userId?.name || "Unknown User"}</strong>
                        <br />
                        <small>{order.userId?.email || ""}</small>
                    </div>
                </td>

                {/* ✅ Service Name (populated from Service model) */}
                <td>{order.serviceId?.businessName || "Service Deleted"}</td>

                {/* ✅ Booking Dates */}
                <td>
                    {new Date(order.startDate).toLocaleDateString()} to {new Date(order.endDate).toLocaleDateString()}
                    <br />
                    <small style={{color: 'gray'}}>({order.eventCity})</small>
                </td>

                {/* ✅ Status with CSS Classes */}
                <td>
                    <span className={`status-badge ${order.status?.toLowerCase()}`}>
                        {order.status || 'Pending'}
                    </span>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                Azun ek hi booking aali nahiye.
            </td>
        </tr>
    )}
</tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBookings;