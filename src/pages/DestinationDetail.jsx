import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { weddingDestinations } from '../data/weddingData';
import { DocumentProjectionNode, motion } from 'framer-motion';
import axios from 'axios';
import './DestinationDetail.css';



const DestinationDetail = () => {
    const { id } = useParams();
    const [dbVendors, setDbVendors] = useState([]);
    const [bookingDates, setBookingDates] = useState({ start: "", end: "" });   

    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const loggedInVendorId = loggedInUser?.id || loggedInUser?._id || null;

    // १. डेस्टिनेशन शोधणे (useMemo मध्ये टाकले आहे जेणेकरून हे सारखे रन होणार नाही)
    const destination = useMemo(() => {
        return weddingDestinations.find((dest) => dest.id.toLowerCase() === id.toLowerCase());
    }, [id]);

    const handleBooking = async (vendor, dates) => {
        try {
            const token = localStorage.getItem('token');
            const bookingData = {
                serviceId: vendor._id,
                userId: loggedInUser.id,
                vendorId: vendor.vendorId,
                startDate: dates.start,
                endDate: dates.end,
                eventCity: "Mumbai",
                message: "Looking forward to working with you!"
            };

            const res = await axios.post(`https://saptpadi-backend.onrender.com/api/bookings/request`, bookingData, {
                headers: { Authorization: `Bearer ${token}`}
            });

            if (res.data.success) {
                alert("Request Sent! Wait for Vendor Approval.");
            }
        }  catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };


    const handleDelete = async (serviceId) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`https://saptpadi-backend.onrender.com/api/service/${serviceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDbVendors(prev => prev.filter(v => v._id !== serviceId));
                alert("Service deleted successfully!");
            } catch (err) {
                console.error("Error deleting service:", err);
            }
        }
    };

    
    useEffect(() => {
        let isMounted = true;
        const fetchNewVendors = async () => {
            try {
                const res = await axios.get(`https://saptpadi-backend.onrender.com/api/service?location=${id}`);
                if (isMounted) {
                    setDbVendors(res.data);
                }
            } catch (err) {
                console.error("Error fetching vendors:", err);
            }
        };
        if (id) fetchNewVendors();
        return () => { isMounted = false; };
    }, [id]);

    // ४. युट्युब लिंकला एम्बेड लिंकमध्ये बदलणे
    const getEmbedUrl = (url) => {
        if (!url || typeof url !== 'string' || url.trim() === "") return null;
        let videoId = "";
        try {
            if (url.includes('v=')) {
                videoId = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
            } else if (url.includes('embed/')) {
                return url;
            }
        } catch (e) {
            console.log("error msg:", e);
            return null;
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    // ५. सर्व व्हेंडर्स एकत्र करणे (Memoized - Loop रोखण्यासाठी)
    const finalVendors = useMemo(() => {
        const staticVendors = destination?.vendors || [];
        return [...staticVendors, ...dbVendors];
    }, [destination, dbVendors]);

    // ६. कॅटेगरीनुसार फिल्टर (Memoized)
    const decoration = useMemo(() => 
        finalVendors.filter(v => v.category?.toLowerCase().includes('decor')), 
    [finalVendors]);

    const outfits = useMemo(() => 
        finalVendors.filter(v => v.category?.toLowerCase().includes('outfit')), 
    [finalVendors]);

    const photographers = useMemo(() => 
        finalVendors.filter(v => v.category?.toLowerCase().includes('photograph')), 
    [finalVendors]);

    const others = useMemo(() => 
        finalVendors.filter(v => {
            const cat = v.category?.toLowerCase() || "";
            return !cat.includes('decor') && !cat.includes('outfit') && !cat.includes('photograph');
        }), 
    [finalVendors]);

    if (!destination) {
        return <div className='text-center mt-20'><h2>Destination Not Found!</h2></div>;
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    // ७. कार्ड रेंडरिंग फंक्शन
    const renderVendorCard = (vendor, index) => (
        <motion.div 
            key={vendor._id || `vendor-${index}`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -10 }}
            className='bg-white rounded-xl shadow-lg overflow-hidden border border-gold/10 flex flex-col'
        >
            <div className="relative h-64 overflow-hidden bg-gray-100">
                <img 
                    src={vendor.image ? vendor.image : (vendor.photo && vendor.photo.startsWith('http') ? vendor.photo : `${API_URL}/${vendor.photo?.replace(/\\/g, '/')}`)}
                    alt={vendor.name || vendor.businessName} 
                    className='w-full h-full object-cover transition-transform duration-500 hover:scale-110'
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/400x300?text=Image+Not+Found"; 
                    }}
                />
            </div>
            
            <div className='p-5 flex-grow flex flex-col'>
                <span className='text-xs font-bold text-[#d4af37] uppercase tracking-wider'>{vendor.category}</span>
                <h3 className="text-xl font-bold text-gray-800 mt-1">{vendor.name || vendor.businessName}</h3>
                <p className='text-gray-600 font-medium mt-2'>Starts from: ₹{vendor.price}</p>

                {vendor.videoUrl && getEmbedUrl(vendor.videoUrl) && (
                    <div className="mt-4 overflow-hidden rounded-lg aspect-video bg-black">
                        <iframe
                            className="w-full h-full"
                            src={getEmbedUrl(vendor.videoUrl)}
                            title="Vendor Video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                <div className='mt-4 space-y-2'>
                    <input
                        type="date"
                        className="w-full text-xs border p-2 rounded focus:outline-none focus:border-[#d4af37]"
                        onChange={(e) => setBookingDates({ ...bookingDates, start: e.target.value })}
                    />
                    <input 
                        type="date"
                        className="w-full text-xs border p-2 rounded focus:outline-none focus:border-[#d4af37]"
                        onChange={(e) => setBookingDates({ ...bookingDates, end: e.target.value })}
                    />      
                </div>

                {/* बटन्स - दोन्ही एकाच रांगेत आणि समप्रमाणात */}
                <div className='mt-4 flex gap-3'>
                    <button 
                        onClick={() => {
                            if(!bookingDates.start || !bookingDates.end) {
                                alert("Please select dates first");
                                return;
                            }
                            handleBooking(vendor, bookingDates);
                        }}
                        className='flex-1 bg-[#4a322d] text-white py-2 rounded-lg text-sm font-bold hover:bg-[#d4af37] transition-all'
                    >
                        Book Now
                    </button>

                    {loggedInVendorId && vendor.vendorId && String(vendor.vendorId) === String(loggedInVendorId) && (
                        <button 
                            onClick={() => handleDelete(vendor._id)} 
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm font-bold transition-all"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );



    return (
        <div className='bg-[#fdf8f4] min-h-screen p-6 md:p-12'>
            <header className='text-center mb-16'>
                <motion.h1 className='text-4xl font-serif text-[#4a322d] mb-2 font-bold'>
                    {destination.placeName} Wedding Services
                </motion.h1>
                <p className='text-[#d4af37] font-semibold italic'>"The Divine {destination.theme} Experience"</p>
            </header>

            <div className='max-w-7xl mx-auto space-y-20'>
                {/* Sections */}
                {[
                    { title: " Top Decorators", data: decoration },
                    { title: " Wedding Outfits", data: outfits },
                    { title: " Photography", data: photographers },
                    { title: " More Services", data: others }
                ].map((section, idx) => section.data.length > 0 && (
                    <section key={idx}>
                        <h2 className='text-2xl font-serif text-[#4a322d] mb-8 border-l-4 border-[#d4af37] pl-4 font-bold'>{section.title}</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {section.data.map((vendor, index) => renderVendorCard(vendor, index))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
};

export default DestinationDetail;