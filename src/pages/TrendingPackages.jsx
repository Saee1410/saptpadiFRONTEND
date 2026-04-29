import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import './TrendingPackages.css';

const TrendingPackages = () => {
  const { styleId } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fallback Image (दोन्ही गोष्टी चालल्या नाहीत तर हे दिसेल)
  //const placeholderImg = "https://placehold.co/600x400?text=Image+Not+Found";

      // Pinterest Link (Default jar image nasel tar)
    const pinterestLink = "https://i.pinimg.com/736x/25/e4/8e/25e48e89e255f3b84ad4915ebcd3922f.jpg";
    // Fallback Link (Jar Pinterest pan down asel tar)
    const fallbackLink = "https://placehold.co/800x400?text=Image+Not+Found";

  useEffect(() => {
    const fetchTrendingServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/service/style/${styleId}`);
        setServices(response.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingServices();
  }, [styleId]);

  // ✅ Image logic: Pinterest link आणि Backend file दोन्हीसाठी
  // ✅ Image logic: Pinterest link आणि Backend file दोन्हीसाठी (With Cache Buster)
  const getImageUrl = (item) => {
    if (!item || !item.photo) return pinterestLink;

    let finalUrl = "";

    // १. जर डेटाबेसमध्ये 'http' ने सुरू होणारी लिंक असेल (Pinterest/Cloudinary)
    if (item.photo.startsWith('http')) {
      finalUrl = item.photo;
    } else {
      // २. जर लोकल फाईल असेल, तर बॅकएंडचा URL जोडा
      const cleanPath = item.photo.replace(/\\/g, '/');
      finalUrl = `http://localhost:5000/${cleanPath}`;
    }

    // 🔥 सर्वात महत्त्वाचं: URL च्या शेवटी Timestamp जोडा ज्यामुळे नवीन इमेज लगेच दिसेल
    // '?' आधीच असेल तर '&' वापरा, नसेल तर '?' वापरा
    const separator = finalUrl.includes('?') ? '&' : '?';
    return `${finalUrl}${separator}t=${new Date().getTime()}`;
  };

  const handleWhatsApp = (mobile, businessName) => {
    const cleanMobile = mobile.startsWith('91') ? mobile : `91${mobile}`;
    const message = `Hello ${businessName}, I saw your ${styleId} package on Saptpadi. Can we discuss?`;
    window.open(`https://wa.me/${cleanMobile}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className='trending-package-page'>
      <button className='back-btn' onClick={() => navigate(-1)}>← Back</button>
      
      <h1 className='style-title'>
        Explore <span className='gold'>{styleId?.toUpperCase()}</span> Collection
      </h1>

      {loading ? (
        <p className='status-msg'>Loading Royal Styles...</p>
      ) : (
        <div className='services-list'>
          {services.length > 0 ? (
            services.map((item) => (
              <div key={item._id} className='service-card-horizontal'>
                <div className='service-img-box'>
                  <img 
                    src={getImageUrl(item)} 
                    alt={item.businessName} 
                    referrerPolicy="no-referrer" // 👈 Pinterest इमेज दिसण्यासाठी हे अत्यंत आवश्यक आहे
                    onError={(e) => {
                      if(e.target.src !== fallbackLink) {
                        e.target.src = fallbackLink;
                      }
                    }}
                  />
                </div>
                
                <div className='service-details'>
                  <h3>{item.businessName}</h3>
                  <p className='price'>Starting from: ₹{item.price}</p>
                  <p className='location-tag'>📍 {item.location}</p>
                  <p className='description'>{item.description}</p>
                  
                  <button 
                    className='contact-btn' 
                    onClick={() => handleWhatsApp(item.contactInfo, item.businessName)}
                  >
                    <FaWhatsapp size={20} /> Contact Vendor
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className='no-data'>
              <p>No vendors found for this style yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrendingPackages;