// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

// Helper function to decode the JWT and get the username
const getUsernameFromToken = (token) => {
  if (!token) return null;
  try {
    // Decodes the payload part of the token
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.user.username; 
  } catch (error) {
    console.error("Failed to decode token:", error);
    // If the token is invalid, it's good practice to remove it
    localStorage.removeItem('token');
    return null;
  }
};


const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // This effect runs when the component loads or the token changes
    if (token) {
      setUsername(getUsernameFromToken(token));
    }
  }, [token]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to close the dropdown if you click outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    navigate('/');
  };

  const onDashboard = location.pathname === '/dashboard';

  return (
    <header className={`sticky top-0 z-30 transition-all duration-300 ${isScrolled ? 'border-b border-gray-800 bg-gray-900/50 backdrop-blur' : ''}`}>
      <nav className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to={token ? "/dashboard" : "/"} className="text-xl font-bold text-white">
          CollabCanvas
        </Link>
        <div className="flex items-center gap-4">
          {token ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Icon Button */}
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <User className="w-5 h-5 text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1">
                  <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                    Signed in as <br/>
                    <span className="font-semibold text-white">{username || 'User'}</span>
                  </div>
                  {!onDashboard && (
                     <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">
                      Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
