// src/pages/Landing.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Users, Cloud, Mail } from 'lucide-react';
import heroImage from '../assets/images/Screenshot 2025-08-08 230720.png'; 

const Landing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="container mx-auto pt-32 pb-24 px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Collaborate in Real-Time, Instantly.
              </h1>
              <p className="text-lg text-gray-400 max-w-lg mx-auto lg:mx-0">
                Unleash your team's creativity with a shared digital whiteboard. Draw, sketch, and brainstorm together, no matter where you are.
              </p>
              <div className="flex justify-center lg:justify-start items-center gap-4 pt-4">
                <Link 
                  to="/register" 
                  className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-transform hover:scale-105"
                >
                  Get Started for Free
                </Link>
                <Link to="#features" className="font-semibold text-gray-300 hover:text-white">
                  Learn more
                </Link>
              </div>
            </div>
            
            {/* Right Column: Image */}
            <div className="relative">
              {/* Optional: Add a glow effect behind the image */}
              <div className="absolute -inset-8 bg-blue-900/30 rounded-full blur-3xl opacity-50" />
              <img
                src={heroImage}
                alt="Collaborative whiteboard illustration"
                className="relative w-full rounded-2xl shadow-2xl shadow-blue-900/20"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto py-24 px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 text-center">
              <Users className="mx-auto mb-4 h-8 w-8 text-blue-500" />
              <h3 className="mb-2 text-xl font-semibold">Live Collaboration</h3>
              <p className="text-sm text-gray-400">See changes as they happen with multi-cursor presence and instant updates.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 text-center">
              <Cloud className="mx-auto mb-4 h-8 w-8 text-blue-500" />
              <h3 className="mb-2 text-xl font-semibold">Save Your Work</h3>
              <p className="text-sm text-gray-400">Your boards are securely stored in the cloud and available anywhere.</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800 text-center">
              <Mail className="mx-auto mb-4 h-8 w-8 text-blue-500" />
              <h3 className="mb-2 text-xl font-semibold">Invite Your Team</h3>
              <p className="text-sm text-gray-400">Share a link and collaborate with teammates, classmates, or clients.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
