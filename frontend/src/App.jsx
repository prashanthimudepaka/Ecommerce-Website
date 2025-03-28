import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NavBar from "./components/NavBar";


const App = () => {
  return (
    <div className='min-h-screen bg-gray-900 text-black relative overflow-hidden '>
      {/* Background gradient */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-white ' />
        </div>
      </div>

      <div className='relative z-50 pt-20'>
          <NavBar />
      
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;