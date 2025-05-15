import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../Store/userSlice";
import axios from "axios";

const Navbar = () => {
  // Get login status from Redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [showNotifications, setShowNotifications] = useState(false);
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Sample notifications data - in a real app, this would come from Redux or an API
  const [notifications, setNotifications] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getRequests`);
        const allRequests = res.data;

        // Filter only those meant for the current user
        const filtered = allRequests.filter(
          (req) =>
            req.recipientUserId._id === userId && req.status === "pending"
        );

        const formatted = filtered.map((msg) => ({
          id: msg._id,
          user: msg.senderUserId.fullName,
          skill: "Skill exchange request",
          date: new Date(msg.createdAt).toLocaleString(),
          avatar: msg.senderUserId.fullName?.[0]?.toUpperCase() || "U",
        }));

        setNotifications(formatted);

        console;
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const isLogin = localStorage.getItem("isLogin");
    if (isLogin === "true" && userId) {
      fetchRequests();
    }
  }, [userId]);

  const handleAccept = async (id) => {
    try {
      await axios.post(`${BACKEND_URL}/acceptRequest/${id}`);
      // Remove the notification from the list on success
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleReject = (id) => {
    // In a real app, this would call an API or dispatch a Redux action
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const closeNotifications = () => {
    setShowNotifications(false);
  };

  return (
    <div className="w-full sticky top-0 z-10">
      {/* Navbar Container */}
      <div className="w-full bg-white shadow-md px-6 flex justify-between items-center h-20">
        {/* Left Side - Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            SkillSwap
          </Link>
        </div>

        {/* Middle - Navigation Menu */}
        {localStorage.getItem("isLogin") === "true" && (
          <div className="flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/working"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              How It Works
            </Link>
            <Link
              to="/skillMatching"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Skill Match
            </Link>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Chatting
            </Link>
          </div>
        )}

        {/* Right Side - Conditional Auth Buttons */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full hover:bg-gray-100 relative transition duration-150"
                aria-label="Notifications"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center transform scale-110 transition-transform">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl overflow-hidden z-20 border border-gray-100">
                  <div className="py-2">
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-white">
                        Skill Requests
                      </h3>
                      <button
                        onClick={closeNotifications}
                        className="text-white hover:bg-indigo-700 rounded-full p-1 transition-colors"
                        aria-label="Close notifications"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="px-6 py-8 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 mx-auto text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <p className="mt-4 text-gray-500">
                          No new notifications
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 m-2 rounded-lg shadow-sm"
                          >
                            <div className="flex">
                              <div className="flex-shrink-0 mr-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-medium">
                                  {notification.avatar}
                                </div>
                              </div>
                              <div className="flex-grow">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    {notification.user}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {notification.date}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">
                                  Requested:{" "}
                                  <span className="font-medium">
                                    {notification.skill}
                                  </span>
                                </p>
                                <div className="flex space-x-2 justify-end">
                                  <button
                                    onClick={() =>
                                      handleReject(notification.id)
                                    }
                                    className="px-3 py-1 border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:bg-gray-100 transition-colors"
                                  >
                                    Decline
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleAccept(notification.id)
                                    }
                                    className="px-3 py-1 bg-indigo-600 text-white text-xs font-medium rounded-full hover:bg-indigo-700 transition-colors"
                                  >
                                    Accept
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoggedIn ? (
            <Link
              to="/account"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150"
            >
              Account
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800 transition duration-150"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition duration-150"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
