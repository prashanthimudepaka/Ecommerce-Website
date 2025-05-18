import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NavBar from "./components/NavBar";
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";


const App = () => {
  const { user, checkAuth} = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  // console.log(user);
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
          {/* <Route path="/signup" element={<SignupPage />} /> */}
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to='/' />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to='/' />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;