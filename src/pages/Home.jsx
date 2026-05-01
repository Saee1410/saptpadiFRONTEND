import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios';
import './Home.css'



const Home = () => {
  const navigate = useNavigate();
  
  const images = [
    { src: '/assets/wed.jpg', angle: -10, x: -150, label: "Lagna" },
    { src: '/assets/haldi.jpg', angle: -5, x: -50, label: "Haldi" },
    { src: '/assets/sangit.jpg', angle: 5, x: 50, label: "Sangeet" },
    { src: '/assets/mehndi.jpg', angle: 10, x: 150, label: "Mehndi" }
  ];

  const manualStyles = [
    { _id: '65f123abc456def789012345', vendorId: '65f123abc456def789012399', package: '10,00,000', name: "Maharashtrian", image:'/assets/mharathiwed.jpg', tagline: "Antarpat & Mangalashtaka" },
    { _id: '65f123abc456def789012346', vendorId: '65f123abc456def789012398', package: '12,00,000', name: "Peshwai", image: '/assets/peshwaiwed.jpg', tagline: "Royal Wada Experience" },
    { _id: '65f123abc456def789012347', vendorId: '65f123abc456def789012397', package: '11,00,000', name: "Gujarati", image: '/assets/gujwed.jpg', tagline: "Garba & Shahi Mejwani" },
    { _id: '65f123abc456def789012348', vendorId: '65f123abc456def789012396', package: '10,00,000', name: "South-Indian", image: '/assets/mhmed.jpg', tagline: "Temple Decor & Traditional Vibes" },
    { _id: '65f123abc456def789012349', vendorId: '65f123abc456def789012395', package: '12,00,000', name: "Bengali", image: '/assets/benwed.jpg', tagline: "Shorshe Ilish & Royal Decor" },
    { _id: '65f123abc456def789012350', vendorId: '65f123abc456def789012394', package: '10,00,000', name: "North-Indian", image: '/assets/northwed.jpg', tagline: "Shahi Decor & Lavish Cuisine" },
    { _id: '65f123abc456def789012351', vendorId: '65f123abc456def789012393', package: '12,00,000', name: "Rajasthani", image: '/assets/rajwed.jpg', tagline: "Desert Vibes & Royal Decor" },
    { _id: '65f123abc456def789012352', vendorId: '65f123abc456def789012392', package: '11,00,000', name: "Punjabi", image: '/assets/punwed.jpg', tagline: "Bhangra & Royal Decor" },
    { _id: '65f123abc456def789012353', vendorId: '65f123abc456def789012391', package: '10,00,000', name: "Modern", image: '/assets/weswed.jpg', tagline: "Trendy Decor & Modern Vibes" }
  ];

  const [styles] = useState(manualStyles); 
 

  const handleBooking = async (e, style) => {
    e.stopPropagation(); 
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!userData) {
      alert("Please login first!");
      navigate('/login');
      return;
    }

    const userId = userData._id || userData.id;
    const eventCity = prompt("Wedding City:", "Nashik");
    const startDate = prompt("Start Date:", "2026-12-25");
    const endDate = prompt("End Date:", "2026-12-27");

    if (eventCity && startDate && endDate) {
      try {
        const bookingData = {
          serviceId: style._id, 
          userId: userId,
          vendorId: style.vendorId, 
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          eventCity: eventCity,
          message: `Booking for ${style.name} Theme`
        };

        const response = await axios.post(`https://saptpadi-frontend.vercel.app/api/bookings/request`, bookingData);
        if (response.data.success) {
          alert("Booking Request Sent!");
          navigate('/profile');
        }
      } catch (error) {
        alert(error.response?.data?.message || "Booking failed.");
      }
    }
  };

  return (
    <div className='container'>
      <h2 className="title">Vedic <span className="gold">Rituals</span></h2>
      
      <div className='main-content-row'>   
        <div className='img-container'>
          {images.map((item, index) => (
            <motion.div
              key={index}
              className="card-wrapper"
              initial={{ opacity: 0, y: 50, rotate: item.angle, x: item.angle * 5 }}
              animate={{ opacity: 1, y: 0, x: item.angle * 8 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ x: item.x, rotate: 0, scale: 1.1, zIndex: 100 }}
            >
              <img src={item.src} className='img-stack' alt={item.label} style={{ transform: `rotate(${item.angle}deg)` }} />
              <div className="label">{item.label}</div>
            </motion.div>
          ))}
        </div>
        <div className='main-container'>
           <div className='info-side'>
          <p className='info-text'>Plan your Dream Wedding with Saptpadi...</p>

          <motion.button
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => navigate('/destination')}
           className='destination-btn'
           >
             Explore Destinations
           </motion.button>
        </div>
        </div>
        
       
       
      </div>

      <div className='trending-section'>
        <h2 className='section-title'>Trending <span className='gold'>Styles</span></h2>
        <p className='section-desc'>Pick a style and get full package: Food, Decor & more!</p>

        <div className='trending-grid'>
          {styles
            .filter(style => style._id.startsWith('65f123')) 
            .slice(0, 9)
            .map((style) => (
              <motion.div 
                key={style._id} 
                className='theme-card'
                onClick={() => navigate(`/packages/${style.name.toLowerCase()}`)}
              >
                <div className="theme-img-wrapper">
                  <img src={style.image} alt={style.name} className='theme-img' />
                  <div className='theme-overlay'>
                    <h1>₹{style.package}</h1>
                    <h3>{style.name}</h3>
                    <button className='book-now-btn' onClick={(e) => handleBooking(e, style)}>
                      Book Now
                    </button>
                  </div>  
                </div>
              </motion.div>
            ))
          }
        </div>   
      </div>
    </div> 
  )
}

export default Home;


