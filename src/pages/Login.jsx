import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Auth.css'


export const Login = () => {
    const [formData, setFormData] = useState({email: '', password: ''});
    const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const res = await axios.post('/auth/login', formData);

                if(res.data.token){
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify(res.data.user));

                    const userRole = res.data.user.role;
                    if(userRole === 'vendor'){
                        alert("Welcome Vendor!");
                        navigate('/vendor-dashboard');
                    }else{
                        alert("Welcome Customer!");
                        navigate('/destination');
                    }
                }
                }catch (err) {
                    alert(err.response.data.msg || "Login failed");
                    console.log("Error:", err);
                }
            
        };
    
  return (
    <div className='auth-container'>
        <form className='auth-form' onSubmit={handleSubmit}>
            <h1>Welcome Back!</h1>
            <h1>Login to your Saptpadi account</h1>

            <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            />

            <input
            type="password"
            placeholder='password'
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            />

            <button type="submit" className='auth-btn'>Login</button>
            <p onClick={() => navigate('/signup')} className='togg;e-auth'>
                Don't have an account? <a href="/signup">Signup here</a>    
            </p>
        </form>

    </div>
  )
}

export default Login;
