import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home.jsx'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Destination from './pages/Destination.jsx'
import VendorDashboard from './components/VemdorDashboard.jsx'
import AddService from './components/AddService.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'  
import MyBookings from './components/MyBookings.jsx';
import ServiceDetails from './pages/ServiceDetails.jsx'
import DestinationDetail from './pages/DestinationDetail.jsx';
import Analytics from './components/Analytics.jsx';
import Services from './pages/Services.jsx' 
import TrendingPackages from './pages/TrendingPackages.jsx'; 
import AIStyleGenerator from './components/AIStyleGenerator.jsx' 
import EditService from './pages/EditService.jsx'
import BudgetPlanner from './components/BudgetPlanner.jsx'
import UserProfile from './components/UserProfile.jsx' 
import VendorProfile from './components/VendorProfile.jsx'   



function App() {
 

  return (
    <BrowserRouter>
     <Navbar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/destination' element={<Destination />} />
        <Route path='/vendor-dashboard' element={<VendorDashboard />} />
        <Route path='/vendor/add-service' element={<AddService />} />
        <Route path='/my-bookings' element={<MyBookings />} />
        <Route path='/service/:id' element={<ServiceDetails />} />
        <Route path='/destination/:id' element={<DestinationDetail />} />
        <Route path='/vendor/analytics' element={<Analytics />} /> 
        <Route path='/services' element={<Services />} />
        <Route path='/packages/:styleId' element={<TrendingPackages />} />  
        <Route path='/ai-style-generator' element={<AIStyleGenerator />} />
        <Route path='/service/:id/edit' element={<EditService />} />
        <Route path='/plan-budget' element={<BudgetPlanner />} />
        <Route path='/profile' element={<UserProfile />} />
        <Route path='/vendorprofile' element={<VendorProfile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
