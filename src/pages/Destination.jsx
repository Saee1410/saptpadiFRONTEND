import React, { useState, useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingDestinations } from '../data/weddingData'; // पाथ तपासा
import './Destination.css';

// १. हा तुमचा कार्ड कॉम्पोनंट
const DestinationSection = ({ dest }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev === dest.functions.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [dest.functions.length]);

  const currentFunc = dest.functions[index];

  return (
    <motion.section
      className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className='p-8 md:w-1/2 flex flex-col justify-center'>
        <h2 className='text-3xl font-bold text-gray-800'>
          {dest.placeName}, <span className='text-gray-500 font-normal'>{dest.state}</span>
        </h2>
        <div className="flex gap-2 my-3">
          <span className='bg-orange-50 text-[#d4af37] px-3 py-1 rounded-full text-sm font-semibold border border-gold/20'>{dest.theme}</span>
          <span className='bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-bold'>🔥 Trending</span>
        </div>
        <p className='text-gray-600 leading-relaxed'>{dest.description}</p>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-l-4 border-[#d4af37]">
          <h4 className="font-bold text-[#4a322d]">{currentFunc.type}</h4>
          <p className="text-sm text-gray-500">{currentFunc.desc}</p>
        </div>

        <button 
        onClick={() => navigate(`/destination/${dest.id}`)}
        className="mt-8 bg-[#4a322d] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#d4af37] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 w-fit"
        > Explore Them</button>
      </div>

      <div className='md:w-1/2 h-[400px] relative overflow-hidden bg-black'>
        <AnimatePresence mode='wait'>
          <motion.img
            key={currentFunc.id}
            src={currentFunc.image}
            alt={currentFunc.type}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-lg italic">
          {currentFunc.type}
        </div>
      </div>
    </motion.section>
  );
};

// २. हा मुख्य एक्सपोर्ट कॉम्पोनंट
const Destination = () => {
  return (
    <div className='dest-page p-6 md:p-12'>
        <h1 className="text-4xl font-serif text-center mb-12 text-[#4a322d]">
            Divine <span className="text-[#d4af37]">Destinations</span>
        </h1>
        <div className="max-w-6xl mx-auto">
            {weddingDestinations.map((city) => (
                <DestinationSection key={city.id} dest={city} />
            ))}
        </div>
    </div>
  );
};

export default Destination;