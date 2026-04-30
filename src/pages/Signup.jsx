import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

//const API_URL = import.meta.env.VITE_API_URL || 'https://saptpadi-backend.onrender.com';

export const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'customer'});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const response = await axios.post('https://saptpadi-backend.onrender.com/api/auth/signup', formData);
           
        if(response.status === 201){
            alert("Account created successfully! Please login");
                navigate('/login');
        }
        }catch (err){
            alert(err.response?.data?.msg || "Signup failed");
            console.log("Error:", err);
        }
        
    }
    

  return (
    <div className='auth-container'>

        
        <form className='auth-form' onSubmit={handleSubmit}>

        <h1>Create Account</h1>
        <h1>Join Saptpadi to plan your dream wedding</h1>

        <select 
        className='auth-input'
        onChange={(e) => setFormData({...formData, role: e.target.value})}
        required
        >
            <option value="customer">I am a Customer(Lagnacha Shubhkaary)</option>
            <option value="vendor">I am a Vendor (Caterers, Photographers, etc.) </option>
        </select>
        <input 
        type="text"  
        placeholder="Enter your name"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required 
        />

        <input
        type="email"
        placeholder='Enter your email'
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        required
        />

        <input 
        type="password"
        placeholder='password'
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        required
        />

        <button  type="submit" className='auth-btn'>Signup</button>
        <p onClick={() => navigate('/login')} className='toggle-auth'>Already have an account? <a href="/login">Login here</a></p>
        </form>
    </div>
  )
}


export default Signup;