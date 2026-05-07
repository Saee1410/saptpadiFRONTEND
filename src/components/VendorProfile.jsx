import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './VendorProfile.css';

const VendorProfile = () => {
    const [myBookings, setMyBookings] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    
    const [formData, setFormData] = useState({
        businessName: user.businessName || '',
        contact: user.contact || '',
    });

    useEffect(() => {
        const fetchVendorProfile = async () => {
            try {
                const vendorId = user._id || user.id;
                if (!vendorId) return;

                // बॅकएंडवरून वेंडरचे सर्व बुकिंग्स मागवा
                const res = await axios.get(`https://saptpadi-backend.onrender.com/api/bookings/vendor/${vendorId}`);
                
                if (res.data.success) {
                    setMyBookings(res.data.bookings || []);
                }
            } catch (err) {
                console.error("Error fetching bookings:", err);
            }
        };
        fetchVendorProfile();
    }, [user]);

    // बुकिंग स्वीकारण्याचे लॉजिक

    const handleAcceptBooking = async (bookingId) => {
    try{
        const res = await axios.put(`https://saptpadi-backend.onrender.com/api/bookings/update-status/${bookingId}`, {
            status: 'Accepted' 
        });

        if (res.data.success) {
            alert("Booking Accepted! ✅");
            
           
            setMyBookings(prevBookings => 
                prevBookings.map(booking => 
                    booking._id === bookingId ? { ...booking, status: 'Accepted' } : booking
                )
            );
        }
    } catch (err) {
        console.error("Update error:", err);
        alert("Status update failed!");
    }
};

    

    const handleUpdateProfile = async () => {
        try {
            const vendorId = user._id || user.id;
            const res = await axios.put(`https://saptpadi-backend.onrender.com/api/users/update-vendor/${vendorId}`, formData);
            
            if (res.data.success) {
                const updatedUser = { ...user, ...formData };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                alert("Profile Updated!");
            }
        } catch (err) {
            console.error(err);
            alert("Update failed!");
        }
    };

    return (
        <div className='profile-container'>
            <header className='profile-header'>
                <div className='profile-pic'>{user.name?.charAt(0)}</div>
                <div className='profile-info'>
                    {isEditing ? (
                        <div className="edit-inputs">
                            <input type="text" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} placeholder="Business Name" />
                            <input type="text" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="Contact Number" />
                            <button onClick={handleUpdateProfile} className="save-btn">Save</button>
                            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                        </div>
                    ) : (
                        <>
                            <h1>{user.businessName || "Saptpadi Partner"}</h1>
                            <p>Owner: <strong>{user.name}</strong></p>
                            <p>Email: {user.email}</p>
                            <p>Contact: {user.contact || "Add Contact Number"}</p>
                            <button className='edit-btn' onClick={() => setIsEditing(true)}>Edit Profile</button>
                        </>
                    )}
                </div>
            </header>

            <div className='profile-stats'>
                <div className='stat-box'>
                    <h3>{myBookings.length}</h3>
                    <p>Total Bookings</p>
                </div>
                <div className='stat-box'>
                    <h3>{myBookings.filter(b => b.status === 'Accepted').length}</h3>
                    <p>Accepted Bookings</p>
                </div>
            </div>

            <section className='booking-history'>
                <h2>Booking History & Requests</h2>
                <div className='booking-list'>
                    {myBookings.length > 0 ? myBookings.map((b) => (
                        <div key={b._id} className={`booking-item border-${b.status?.toLowerCase()}`}>
                            <div className='client-detail'>
                                <h4>Client: {b.userId?.name || "Guest"}</h4>
                                <p>City: {b.eventCity}</p>
                                <p>Dates: {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}</p>
                            </div>
                            <div className='date-detail'>
                                <span className={`status-tag ${b.status?.toLowerCase()}`}>{b.status}</span>
                                
                                
                                {b.status?.toLowerCase() === 'pending' && (
                                    <button 
                                        className="mini-accept-btn"
                                        onClick={() => handleAcceptBooking(b._id)}
                                    >
                                        Accept Request
                                    </button>
                                )}
                            </div>
                        </div>
                    )) : <p>Booking not found.</p>}
                </div>
            </section>
        </div>
    );
};

export default VendorProfile;