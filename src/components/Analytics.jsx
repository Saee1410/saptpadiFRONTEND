import React from 'react'; // 'Reat' दुरुस्त केले
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
// Recharts चे सर्व कॉम्पोनंट्स इथे इम्पोरट करणे आवश्यक आहे
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import './Analytics.css';

const Analytics = () => {
    const navigate = useNavigate();

    const monthlyData = [
        { month: 'Jan', bookings: 20 },
        { month: 'Feb', bookings: 35 },
        { month: 'Mar', bookings: 50 },
        { month: 'Apr', bookings: 40 },
        { month: 'May', bookings: 60 },
        { month: 'Jun', bookings: 80 },
    ];

    const serviceData = [
        { name: 'Photography', value: 400 },
        { name: 'Makeup', value: 300 },
        { name: 'Catering', value: 300 },
        { name: 'Venue', value: 200 },
    ];
    
    const COLORS = ['#4a322d', '#d4af37', '#8b5a2b', '#e5c100'];

    return (
        <div style={{ padding: '20px', backgroundColor: '#fdf8f4', minHeight: '100vh' }}>
            <button 
                onClick={() => navigate(-1)} 
                style={{ marginBottom: '20px', cursor: 'pointer', padding: '8px 15px', borderRadius: '5px', border: '1px solid #4a322d' }}
            >
                ← Back
            </button>
            
            <h1 style={{ color: '#4a322d', marginBottom: '30px' }}>Business Analytics</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* --- Area Chart Section --- */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <h3>Monthly Bookings Growth</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="bookings" stroke="#4a322d" fill="#d4af37" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* --- Pie Chart Section --- */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <h3>Top Services Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={serviceData} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={80} 
                                    label
                                >
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analytics;