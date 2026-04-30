import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServiceDetails.css';

const ServiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");
    const user = JSON.parse(localStorage.getItem('user'));

    // Pinterest Link (Default jar image nasel tar)
    const pinterestLink = "https://i.pinimg.com/736x/25/e4/8e/25e48e89e255f3b84ad4915ebcd3922f.jpg";
    // Fallback Link (Jar Pinterest pan down asel tar)
    const fallbackLink = "https://placehold.co/800x400?text=Image+Not+Found";

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await axios.get(`https://saptpadi-frontend.vercel.app/api/service/${id}`);
                setService(res.data);
            } catch (err) {
                console.error("Error fetching service details", err);
                setService(null);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    // --- Image Path Logic ---
    const getDisplayImage = () => {
    if (!service || !service.photo) return pinterestLink;

    let finalUrl = "";
    if (service.photo.startsWith('http')) {
        finalUrl = service.photo;
    } else {
        finalUrl = `https://saptpadi-frontend.vercel.app/${service.photo.replace(/\\/g, '/')}`;
    }

    // URL च्या शेवटी करंट टाइम जोडा ज्यामुळे कॅशिंग होत नाही
    return `${finalUrl}?t=${new Date().getTime()}`;
};

const handleBookingRequest = async () => {
    if (!selectedDate) return alert("Please select an event date before booking.");
    try {
        const bookingData = {
            serviceId: service._id,
            vendorId: service.vendorId,
            userId: user?._id || user?.id, // User ID check
            startDate: selectedDate,       // Backend la 'startDate' havay
            endDate: selectedDate,         // Backend la 'endDate' havay
            eventCity: service.location || "Not Specified", // REQUIRED field
            message: `Booking request for ${service.businessName}`
        };
        
        const res = await axios.post('https://saptpadi-frontend.vercel.app/api/bookings/request', bookingData);
        if(res.data.success) {
            alert("Booking request sent successfully!");
        }
    } catch (err) {
        console.error("Error details:", err.response?.data); // Exact error baka
        alert(err.response?.data?.message || "Failed to send booking request.");
    }
};

    // const handleBookingRequest = async () => {
    //     if (!selectedDate) return alert("Please select an event date before booking.");
    //     try {
    //         const bookingData = {
    //             serviceId: service._id,
    //             vendorId: service.vendorId,
    //             userId: user?._id,
    //             eventDate: selectedDate, 
    //         };
    //         await axios.post('https://saptpadi-frontend.vercel.app/api/bookings/request', bookingData);
    //         alert("Booking request sent successfully!");
    //     } catch (err) {
    //         console.error("Error sending booking request", err);
    //         alert("Failed to send booking request.");
    //     }
    // };

    const getEmbedUrl = (url) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return null;
        let videoId = "";
        try {
            if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0];
            else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
            else if (url.includes('embed/')) return url;
        } catch (e)
         {
            console.error("Video URL parsing error:", e);
             return null; }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!service) return <div className="text-center mt-20">Service not found.</div>;

    const isOwner = user && (user.id === service.vendorId || user._id === service.vendorId);

    return (
        <div className='service-details-container'>
            <div className='service-card-large'>
                {/* Main Image Section */}
                <img 
                    src={getDisplayImage()} 
                    alt={service.businessName} 
                    className='service-image-large'
                    referrerPolicy="no-referrer"
                    onError={(e) => { 
                        if (e.target.src !== fallbackLink) {
                            e.target.src = fallbackLink; 
                        }
                    }}
                />

                <div className='details-content'>
                    <h1>{service.businessName}</h1>
                    <span className='category-badge'>{service.category}</span>

                    {/* Video Section */}
                    {service.videoUrl && getEmbedUrl(service.videoUrl) && (
                        <div className="video-section" style={{ margin: '25px 0' }}>
                            <h3>Work Preview</h3>
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                                <iframe
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={getEmbedUrl(service.videoUrl)}
                                    title="Preview"
                                    frameBorder="0"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}

                    <p className='description'>{service.description}</p>
                    <p className='price'>Price: ₹{service.price}</p>
                    <p><strong>Location:</strong> {service.location}</p>

                    <div className='action-buttons'>
                        {isOwner ? (
                            <>
                                <button className='edit-btn' onClick={() => navigate(`/service/${service._id}/edit`)}>Edit</button>
                                <button className='delete-btn' style={{ background: '#ff4d4d' }}>Delete</button>
                            </>
                        ) : (
                            <div className='booking-section'>
                                <input type="date" className='date-picker' onChange={(e) => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
                                <button className='book-btn' onClick={handleBookingRequest}>Book Now</button>
                            </div>
                        )}
                        <button className='book-btn' onClick={() => navigate('/services')}>Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetails;