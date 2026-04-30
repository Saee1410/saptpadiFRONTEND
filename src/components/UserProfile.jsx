import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
   
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', contact: ''});
    

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            const id = userData._id || userData.id;
            fetchData(id);
        }
    }, []);

    const fetchData = async (id) => {
        try {
            const [userRes, bookingRes] = await Promise.all([
                axios.get(`https://saptpadi-frontend.vercel.app/api/users/${id}`),
                axios.get(`https://saptpadi-frontend.vercel.app/api/bookings/my-bookings/${id}`)
            ]);
            setUser(userRes.data.user || userRes.data);
            setBookings(bookingRes.data.bookings || []);

            setFormData({
                name: userRes.data.user?.name || userRes.data.name || '',
                contact: userRes.data.user?.contact || userRes.data.contact || '',
            });
            setLoading(false);

            
        } catch (err) {
            console.error("Error fetching data:", err);
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;
        try {
            const res = await axios.put(`https://saptpadi-frontend.vercel.app/api/bookings/cancel/${bookingId}`);
            if (res.data.success) {
                alert("Booking Removed!");

                setBookings(prevBookings =>
                    prevBookings.filter(booking => booking._id !== bookingId)
                );
            }
        } catch (err) {
            console.error("Cancellation error:", err);
            alert("Cancellation failed!");
        }
    }

    const handleUpdateProfile = async () => {
        try {
            const userId = user._id || user.id;
            const res = await axios.put(`https://saptpadi-frontend.vercel.app/api/users/update-user/${userId}`, formData);
            if (res.data.success) {
                const updatedUser = { ...user, ...formData};
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setIsEditing(false);
                alert("profile Upadeted Successfully");
            } 
        } catch (err) {
            console.error(err);
            alert("Updated failed");
        }
    };
    
    

    if (loading) return <div className="text-center py-20 italic text-[[var(--color-royal)] animate-pulse">Saptpadi Profile लोड होत आहे...</div>;

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-10">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#d4af37]/20">
                {/* Header Section */}
                <div className="bg-[var(--color-royal)] h-40 relative"></div>
                
                <div className="px-6 md:px-12 pb-10 relative">
                    <div className="relative -top-16 flex flex-col md:flex-row justify-between items-center md:items-end gap-4">
                        <img 
                            src={user?.profilePic || 'https://via.placeholder.com/150'} 
                            className="w-40 h-40 rounded-full border-8 border-white shadow-xl object-cover" 
                            alt="Profile" 
                        />

                        { !isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className='bg-[#d4af37] hover:bg-[#b8962d] text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg mb-2'
                                >
                                    Edit Profile
                                </button>
                        ) : (
                            <div className='flex gap-2 mb-2'>
                                 <button onClick={handleUpdateProfile} className='bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow-md'>Save</button> 
                                 <button onClick={() => setIsEditing(false)} className='bg-gray-400 text-white px-6 py-2 rounded-xl font-bold shadow-md'>Cansel</button> 
                                 </div> 
                        )}
                        
                    </div>

                    {isEditing ? (
                        <div className='flex flex-col gap-3 max-w-sm'>
                            <input
                               className='border-2 border-[#d4af37]/30 p-2 rounded-lg focus:outline-[#d4af37]'
                               type="text"
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               placeholder='Enter Name'
                               />
                               <input
                               className='border-2 border-[#d4af37]/30 p-2 rounded-lg focus:outline-[#d4af37]'
                               type="text"
                               value={formData.contact}
                               onChange={(e) => setFormData({...formData, contact: e.target.value})}
                               placeholder='Enter contact number'
                               />
                               </div>

                    ) : (    
                        <>
                           <h2 className="text-4xl font-extrabold text-[#1a2e35] mb-1">{user?.name}</h2>
                                <p className="text-gray-500 font-medium">{user?.email}</p>
                                <p className="text-[#d4af37] font-bold mt-1">📞 {user?.contact || 'Add Contact'}</p>
                        </>
                )}

                </div>


                    <div className="mt-12">
                        <h3 className="text-2xl font-bold text-[#1a2e35] mb-6 flex items-center gap-2 italic">
                            <span className="w-10 h-[2px] bg-[#d4af37]"></span> My Wedding Bookings
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bookings.length > 0 ? bookings.map((b) => {
                                const isAccepted = b.status?.toLowerCase() === 'accepted';
                                const isCancelled = b.status?.toLowerCase() === 'cancelled';

                                return (
                                    <div key={b._id} className={`group p-5 border-2 rounded-3xl bg-white transition-all duration-300 ${isAccepted ? 'border-green-500/40 shadow-green-100 shadow-lg' : 'border-[#d4af37]/10 hover:border-[#d4af37]/40'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-[#1a2e35] text-xl">
                                                    {b.serviceId?.businessName || "Wedding Service"}
                                                </h4>
                                                <p className="text-sm text-gray-500 font-medium mt-1">📍 {b.eventCity}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${isAccepted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {isAccepted ? 'Accepted' : isCancelled ? ' Cancelled' : b.status}
                                            </span>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-2xl mb-4">
                                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Event Dates</p>
                                            <p className="text-[#1a2e35] font-semibold">
                                                {new Date(b.startDate).toLocaleDateString('en-IN')} - {new Date(b.endDate).toLocaleDateString('en-IN')}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                            <span className="text-[#d4af37] text-xl font-black">₹{b.serviceId?.price || 'N/A'}</span>
                                            {(!isAccepted && !isCancelled) && (
                                                <button
                                                    onClick={() => handleCancelBooking(b._id)}
                                                    className="text-red-500 hover:text-red-700 text-xs font-bold border border-red-200 px-3 py-1 rounded-lg transition-colors"
                                                    >
                                                    Cancel Booking
                                                    </button>
                                            )}
                                            {isAccepted && (
                                                <span className="text-[10px] text-green-600 font-bold animate-bounce">Your plan is fixed! 🎉</span>
                                            )}
                                                
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full text-center py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <p className="text-gray-400 font-medium text-lg italic">अजून कोणतेही बुकिंग सापडले नाही.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
      
    );
};

export default UserProfile;
