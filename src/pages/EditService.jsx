import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save, XCircle, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState(null); // प्रिव्ह्यूसाठी
    const [selectedFile, setSelectedFile] = useState(null); // फाईलसाठी

    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        price: '',
        location: '',
        contactInfo: '',
        description: '',
        videoUrl: '',
        photo: '' // URL स्टोअर करण्यासाठी
    });

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (confirmDelete) {
            try {
                await axios.delete(`https://saptpadi-frontend.vercel.app/api/service/${id}`);
                alert("Service deleted successfully!");
                navigate('/services');
            } catch (err) {
                console.error("Error deleting service", err);
                alert("Failed to delete service.");
            }
        }
    }

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await axios.get(`https://saptpadi-frontend.vercel.app/api/service/${id}`);
                const data = res.data;
                setFormData({
                    businessName: data.businessName,
                    category: data.category,
                    price: data.price,
                    location: data.location,
                    contactInfo: data.contactInfo,
                    description: data.description,
                    videoUrl: data.videoUrl || '',
                    photo: data.photo || '' 
                });

                // सुरुवातीला असलेला फोटो सेट करणे
                if (data.photo) {
                    const imgUrl = data.photo.startsWith('http') 
                        ? data.photo 
                        : `https://saptpadi-frontend.vercel.app/${data.photo.replace(/\\/g, '/')}`;
                    setImagePreview(imgUrl);
                }
            } catch (err) {
                console.error("Error fetching service details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // जर युजरने URL बदलली तर प्रिव्ह्यू अपडेट करा
        if (name === 'photo' && value.startsWith('http')) {
            setImagePreview(value);
            setSelectedFile(null); // फाईल काढून टाका
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); // लोकल फाईलचा प्रिव्ह्यू
            setFormData({ ...formData, photo: '' }); // URL काढून टाका
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // १. टोकन मिळवा
    const token = localStorage.getItem('token'); 
    
    if (!token) {
        alert("तुमचे सेशन संपले आहे, कृपया पुन्हा लॉगिन करा.");
        return navigate('/login');
    }

    const data = new FormData();
    
    Object.keys(formData).forEach(key => {
        if (key !== 'photo') {
            data.append(key, formData[key]);
        }
    });
    
    if (selectedFile) {
        data.append('photo', selectedFile);
    } else if (formData.photo) {
        data.append('photo', formData.photo);
    }

    try {
        await axios.put(`https://saptpadi-frontend.vercel.app/api/service/${id}`, data, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                // 🔴 हे सर्वात महत्त्वाचे आहे:
                'Authorization': `Bearer ${token}` 
            }
        });
        alert("Service updated successfully!");
        navigate(`/service/${id}`);
    } catch (err) {
        console.error("Error updating service", err);
        // जर टोकन चुकीचे असेल तर 401 एरर येईल
        if (err.response?.status === 401) {
            alert("Unauthorized: कृपया पुन्हा लॉगिन करा.");
        } else {
            alert("Failed to update service.");
        }
    }
};


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-800"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-red-800 hover:text-red-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-[#800020] py-6 px-8 text-white">
                        <h2 className="text-2xl font-serif font-bold">Edit Your Service</h2>
                        <p className="text-red-100 text-sm opacity-80">Update your business photo and details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete Service
                            </button>
                             </div>
                        {/* ✅ Photo Edit Section */}
                        <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700">Service Image</label>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="w-full h-full object-contain"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* URL Input */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Paste Image URL</label>
                                    <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-red-800 transition-all">
                                        <LinkIcon className="w-4 h-4 text-gray-400 mr-2" />
                                        <input 
                                            type="text" 
                                            name="photo"
                                            placeholder="https://..."
                                            value={formData.photo} 
                                            onChange={handleChange}
                                            className="w-full outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Or Upload from Gallery</label>
                                    <label className="flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 border border-dashed border-gray-400 transition-all">
                                        <ImageIcon className="w-4 h-4 mr-2" />
                                        <span className="text-sm font-medium">Select File</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Business Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                            <input 
                                type="text" 
                                name="businessName" 
                                value={formData.businessName} 
                                onChange={handleChange} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select 
                                    name="category" 
                                    value={formData.category} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Photography">Photography</option>
                                    <option value="Catering">Catering</option>
                                    <option value="Decoration">Decoration</option>
                                    <option value="Makeup Artist">Makeup Artist</option>
                                    <option value="Venue">Venue</option>
                                     <option value="jewellery">Jewellery</option>
                                    <option value="outfit">Outfit</option>
                                </select>
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                <input 
                                    type="text" 
                                    name="contactInfo" 
                                    value={formData.contactInfo} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                <input 
                                    type="number" 
                                    name="price" 
                                    value={formData.price} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={formData.location} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none"
                                />
                            </div>
                        </div>

                        {/* YouTube URL */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                YouTube Video URL <span className="text-gray-400 font-normal ml-2">(Optional)</span>
                            </label>
                            <input 
                                type="text" 
                                name="videoUrl" 
                                value={formData.videoUrl} 
                                onChange={handleChange} 
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                rows="4" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-800 outline-none resize-none"
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button 
                                type="submit" 
                                className="flex-1 bg-[#800020] text-white py-3 px-6 rounded-lg font-bold flex items-center justify-center hover:bg-[#600018] transition-all shadow-lg active:scale-95"
                            >
                                <Save className="w-5 h-5 mr-2" /> Update Service
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)}
                                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-bold flex items-center justify-center hover:bg-gray-300 transition-all active:scale-95"
                            >
                                <XCircle className="w-5 h-5 mr-2" /> Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditService;