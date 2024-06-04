import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SignUp from './components/SignUp/Signup';
import SignIn from './components/SignIn/SignIn';
import HomePage from './components/HomePage/HomePage';
import Profile from './components/Profile/Profile';
import ViewUsers from './components/ViewUsers';
import Navbar from './components/Navbar/Navbar';
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer';
import NotFound from './components/NotFound/NotFound'; 
import ComingSoon from './components/ComingSoon/ComingSoon'; 
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import Summary from './components/Summary/Summary';
import ProductDetail from './components/ProductDetail/ProductDetail';
import './App.css'; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="page-container">
        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<LayoutWithNavbar><HomePage /></LayoutWithNavbar>} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/view-users" element={<LayoutWithNavbar><ViewUsers /></LayoutWithNavbar>} />
            <Route path="/profile" element={<LayoutWithNavbar><Profile /></LayoutWithNavbar>} />
            <Route path="/shop" element={<LayoutWithNavbar><ComingSoon /></LayoutWithNavbar>} />
            <Route path="/diet-plan" element={<LayoutWithNavbar><ComingSoon /></LayoutWithNavbar>} />
            <Route path="/meal-planning" element={<LayoutWithNavbar><ComingSoon /></LayoutWithNavbar>} />
            <Route path="/location" element={<LayoutWithNavbar><ComingSoon /></LayoutWithNavbar>} />
            <Route path="/about-us" element={<LayoutWithNavbar><ComingSoon /></LayoutWithNavbar>} />
            <Route path="/cart" element={<LayoutWithNavbar><Cart /></LayoutWithNavbar>} />
            <Route path="/checkout" element={<LayoutWithNavbar><Checkout /></LayoutWithNavbar>} />
            <Route path="/summary" element={<LayoutWithNavbar><Summary /></LayoutWithNavbar>} />
            <Route path="/product/:productId" element={<LayoutWithNavbar><ProductDetail /></LayoutWithNavbar>} />
            <Route path="*" element={<NotFound />} />  {/* Handles any undefined routes */}
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

function LayoutWithNavbar({ children }) {
  const location = useLocation();
  const noNavbarRoutes = ['/signin', '/signup']; 
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Header />
      {children}

    </>
  );
}

export default App;
