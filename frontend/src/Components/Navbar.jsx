import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../Store/userSlice';

const Navbar = () => {
  // Get login status from Redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className="w-full sticky top-0 z-10">
      {/* Navbar Container */}
      <div className="w-full bg-white shadow-md px-6 flex justify-between items-center h-20">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">SkillSwap</Link>
        </div>
        
        {/* Middle - Navigation Menu */}
        <div className="flex space-x-8">
          <Link to="/discover" className="text-gray-700 hover:text-indigo-600 font-medium">Discover</Link>
          <Link to="/how-it-works" className="text-gray-700 hover:text-indigo-600 font-medium">How It Works</Link>
          <Link to="/skillMatching" className="text-gray-700 hover:text-indigo-600 font-medium">Skill Match</Link>
        </div>
        
        {/* Right Side - Conditional Auth Buttons */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <Link to="/account" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Account</Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800">Log In</Link>
              <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;