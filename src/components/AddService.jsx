import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddService.css';


const AddService = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        style: '',
        price: '',
        contactInfo: '',
        location: '',
        description: '',
        photo: null,
        externalUrl: '',
        videoUrl: ''
     });


    const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "externalUrl") {
        setFormData({
            ...formData,
            externalUrl: value,
            photo: value.trim() !== "" ? null : formData.photo // URL टाकली की फाईल काढून टाका
        });
    } else {
        setFormData({ ...formData, [name]: value });
    }
};

    const handleFileChange = (e) => {
    setFormData({
        ...formData, 
        photo: e.target.files[0],
        externalUrl: "" // फाईल सिलेक्ट केली की URL रिकामी करा
    });
};

     const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try{
            const token = localStorage.getItem('token');

            const loggedInUser = JSON.parse(localStorage.getItem('user'));
            const loggedInUserId = loggedInUser?._id || loggedInUser?.id;

            const data = new FormData();
            data.append('businessName', formData.businessName);
            data.append('category', formData.category);
            data.append('style', formData.style);
            data.append('price', formData.price);
            data.append('contactInfo', formData.contactInfo);
            data.append('location', formData.location);
            data.append('description', formData.description);
            data.append('vendorId', loggedInUserId);
            data.append('externalUrl', formData.externalUrl);
            data.append('videoUrl', formData.videoUrl ? formData.videoUrl.trim() : "");
          
            if (formData.externalUrl && formData.externalUrl.trim() !== "") {
    
    data.append('photo', formData.externalUrl);
} else if (formData.photo) {
    // २. जर URL नसेल तरच अपलोड केलेली फाईल पाठवा
    data.append('photo', formData.photo);
}
            const response = await axios.post('https://saptpadi-backend.onrender.com/api/service/add', data,{
                headers: {
                 Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.status === 201){

                setFormData({
        businessName: '', category: '', style: '', price: '',
        contactInfo: '', location: '', description: '',
        photo: null, externalUrl: '', videoUrl: ''
    });
                alert("Service added successfully!");
                const newServiceId = response.data.service._id;
                navigate(`/service/${newServiceId}`);
            }
        }catch (err){
            console.error("Error adding service:", err);
            alert(err.response?.data?.msg || "Failed to add service");
        } finally {
            setLoading(false);
        }
     };
       
  return (
    <div className='add-service-container'>
        <div className='form-card'>
            <button className='back-btn' onClick={() => navigate('/vendor-dashboard')}>
                Back to Dashboard
            </button>

            <form className='royal-form' onSubmit={handleSubmit}>
                <h2 className='form-title'>Add New Service</h2>
                <div className='forn-group'>
                    <label>Business Name</label>
                    <input 
                    type="text"
                    name="businessName"
                    placeholder='Enter businessname'
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    />
                </div>

                <div className='form-group'>
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select category</option>
                        <option value="Photography">Photography</option>
                        <option value="Event Planning">Event Planning</option>
                        <option value="Catering">Catering</option>
                        <option value="Makeup">Makeup</option>
                        <option value="Outfit">Outfit</option>
                        <option value="Jewelry">Jewellry</option>
                        <option value="Decoration">Decoration</option>
                        <option value="Music & Entertainment">Music & Entertainment</option>
                        <option value="Venue">Venue</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className='from-group'>
                    <label>Weading Style</label>
                    <select name="style" value={formData.style} onChange={handleChange} required>
                        <option value="">Select wedding style</option>
                        <option value="maharashtrian">Maharashtrian</option>
                        <option value="peshwai">Peshwai</option>
                        <option value="rajasthani">Rajasthani</option>
                        <option value="gujarati">Gujarati</option>
                        <option value="south Indian">South Indian</option>
                        <option value="punjabi">Punjabi</option>
                        <option value="bengali">Bengali</option>
                        <option value="north Indian">North Indian</option>
                        <option value="fusion/Modern">Fusion/Modern</option>
                    </select>
                </div>
                <div className='form-row'>
                    <div className='form-group'>
                        <label>Price/charges</label>
                        <input
                        type="number"
                        name="price"
                        placeholder='Enter price or charges'
                        value={formData.price}
                        onChange={handleChange}
                        required
                        />
                    </div>  
                    <div className='form-group'>
                        <label>Contact Info</label>
                        <input
                        type="text"
                        name="contactInfo"
                        placeholder='Enter contact info'
                        value={formData.contactInfo}
                        onChange={handleChange}
                        required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Location</label>
                        <input
                        type="text"
                        name="location"
                        placeholder='Enter location'
                        value={formData.location}
                        onChange={handleChange}
                        required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Upload Image File</label>
                        <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Or Image URL</label>
                        <input
                        type="text"
                        name="externalUrl"
                        placeholder='Enter image URL (optional)'
                        value={formData.externalUrl}
                        onChange={handleChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label>Pree Wedding Shoot</label>
                        <input
                        type="text"
                        name="videoUrl"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={handleChange}
                        />
                    </div>
                </div>

                    <div className='form-group'>
                        <label>Description</label>
                        <textarea
                        name="description"
                        placeholder='Enter a brief description of your service'
                        value={formData.description}
                        onChange={handleChange}
                        required
                        ></textarea>
                    </div>
                    
                    <button type="submit" className='royal-btn' disabled={loading} >
                       
                        {loading ? "Adding..." : "Add Service"}
                    </button>
            </form>
        </div>
    </div>
  );
};

export default AddService