import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';  
import './Navbar.css'

const Footer = () => {
  return (
    <footer className='footer'>
       <div className='footer-container'>
            <div className='footer-section'>
                <h2 className='footer-logo'>Saptpadi</h2>
                
                  <img src="/assets/logo1.png" alt="Saptpadi Logo" className="logo-img-i h-15 w-auto m-0 p-0" />
                <p className='footer-desc'>
                  We are here to make your dream wedding come true. 
                  Providing wonderful vendors and a Royal experience to make your wedding day unforgettable.
                </p>
            </div>

            <div className='social-links'>
                <h3>Follow Us</h3> 
                <div className="icons-row">
            <a href='#' className="social-icon"><FaFacebook /></a>
            <a href='#' className="social-icon"><FaInstagram /></a>
            <a href='#' className="social-icon"><FaTwitter /></a>
          </div>
            </div>

            <div className='contact-info'>
                <h3>Contact Us</h3>
                <p>📍 Nashik, Maharashtra</p> 
                <p>✉️ support@vedicrituals.com</p>
                <p>📞 +91 8080296179 </p>
            </div>
       </div> 
    </footer>
  )
}

export default Footer