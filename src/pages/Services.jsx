import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllServices = async () => {
            try {
                const res = await axios.get('https://saptpadi-frontend.vercel.app/api/service/all');
                setServices(res.data);
            } catch (err) {
                console.error("Error fetching services:", err);
            }
        };
        fetchAllServices();
    }, []);


    return (
        <div className='services-list-container p-10'>
            <h1 className='text-3xl font-bold text-center mb-10'>Our Services</h1>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {services.map((service) => (
                    <div key={service._id} className='service-ard shadow-lg p-4 rounded-xl border'>
                        <img 
    src={service.photo && service.photo.startsWith('http')
        ? service.photo
        : `https://saptpadi-frontend.vercel.app/${service.photo?.replace(/\\/g, '/')}`
    }
    alt={service.businessName}
    className='w-full h-48 object-cover rounded-md mb-4'
    onError={(e) => {
        const fallback = "https://via.placeholder.com/600x400?text=Image+Not+Found";
        
        // १. आधी इव्हेंट बंद करा
        e.target.onerror = null; 

        // २. जर आधीच फॉलबॅक इमेज असेल तर पुन्हा सेट करू नका (Double Safety)
        if (e.target.src !== fallback) {
            e.target.src = fallback;
        }
    }}
/>
                        <h3 className='text-xl font-bold mt-2'>{service.Businessname || service.businessName}</h3>
                        <p className='text-gold'>{service.category}</p>
                        <p className='text-gray-600 mt-2'>{service.price}</p>

                        <button 
                            onClick={() => navigate(`/service/${service._id}`)}
                            className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600'
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;