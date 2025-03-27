import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
  const navigate = useNavigate()

  const redirect = () => {
    const isLoggedIn = localStorage.getItem('isLogin')
    if (isLoggedIn === "true") {
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  useEffect(() => {
    axios.get(`${BACKEND_URL}/auth/current_user`, { withCredentials: true })
      .then(res => console.log(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <section className="pt-24 pb-16 px-4 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Share Skills, Grow Together
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Connect with fellow students, exchange skills, and learn
              collaboratively on the first peer-to-peer skill exchange platform
              for students.
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col md:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <button onClick={redirect} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
              Start Swapping Skills
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
