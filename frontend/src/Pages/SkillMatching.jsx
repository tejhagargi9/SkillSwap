import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiBookmark,
  FiMessageSquare,
  FiFilter,
  FiSliders,
  FiSearch,
  FiClock,
} from "react-icons/fi";
import AiRecommendationsModal from "../Components/AiRecommendationsModal";

const SkillMatchingPage = () => {
  // State for filters
  const [filters, setFilters] = useState({
    teachSkill: "",
    learnSkill: "",
    proficiencyLevel: "any",
    availability: "any",
    location: "any",
    sessionType: "any",
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [user, setUser] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [AiRecommendations, setAiRecommendations] = useState([]);
  const [showRecommendationsModal, setShowRecommendationsModal] =
    useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] =
    useState(false);
  const [aiRecommendationsData, setAiRecommendationsData] = useState(null);
  // Track connection status for each user
  const [connectionStatus, setConnectionStatus] = useState({});

  // Get current user ID from localStorage or context
  const userId = localStorage.getItem("userId");

  // Fetch initial users when component mounts
  useEffect(() => {
    const fetchInitialUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getAllUsers`);
        setUsers(response.data);
        console.log("Fetched users:", response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchInitialUsers();
  }, [BACKEND_URL]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getUser`, {
          params: { userId }, // Correct way to pass query parameters
        });
        setUser(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to fetch user details", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  // Popular skills for suggestions
  const popularSkills = [
    "Programming",
    "Graphic Design",
    "Language Learning",
    "Math Tutoring",
    "Music",
    "Photography",
    "Writing",
    "Public Speaking",
  ];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      teachSkill: "",
      learnSkill: "",
      proficiencyLevel: "any",
      availability: "any",
      location: "any",
      sessionType: "any",
    });
    setShowAdvancedFilters(false);

    // Fetch all users again
    setLoading(true);
    fetchInitialUsers();
  };

  // Function to fetch initial users (for the reset)
  const fetchInitialUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/getAllUsers`);
      setUsers(response.data);
      setMatchCount(response.data.length);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generateSmart = async () => {
    if (!user) {
      setError("User data not available. Please try again.");
      return;
    }

    setShowRecommendationsModal(true);
    setIsGeneratingRecommendations(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/generateSmart`, {
        learnSkills: user.learnSkills,
        proficiencyLevel: user.proficiencyLevel,
      });

      console.log("Response from backend:", response.data);
      setAiRecommendationsData(response.data);
    } catch (err) {
      console.error("Error generating recommendations:", err);
      setError("Failed to generate recommendations. Please try again.");
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  // Search for matches based on current filters
  const searchMatches = async () => {
    setSearching(true);
    setError(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/getMatchedUsers`, {
        userId,
        teachSkill: filters.teachSkill || undefined,
        learnSkill: filters.learnSkill || undefined,
        teachProficiency:
          filters.proficiencyLevel !== "any"
            ? filters.proficiencyLevel
            : undefined,
      });

      setUsers(response.data.matches);
      setMatchCount(response.data.count);
      setSearching(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setSearching(false);
    }
  };

  // Handle connect button click
  const handleConnect = async (targetUserId) => {
    // Update UI immediately for better UX
    setConnectionStatus({
      ...connectionStatus,
      [targetUserId]: "pending",
    });

    console.log("Connecting with user:", targetUserId);
    console.log("Current user ID:", userId);

    try {
      // Send connection request to backend with sender and recipient IDs
      await axios.post(`${BACKEND_URL}/sendConnectionRequest`, {
        senderUserId: userId, // from localStorage
        recipientUserId: targetUserId, // the user they're connecting with
      });

      console.log(`Connection request sent to user ${targetUserId}`);
    } catch (err) {
      // If there's an error, revert the UI status
      setConnectionStatus({
        ...connectionStatus,
        [targetUserId]: null,
      });
      console.error("Error sending connection request:", err);
      setError("Failed to send connection request. Please try again.");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <p className="text-gray-700">Loading users...</p>
      </div>
    );
  }

  // Error state
  if (error && !searching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header Section */}
      <section className="pt-20 pb-8 px-4 md:px-12 lg:px-24 bg-blue-600">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.h1
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Find Your Perfect Skill Match
            </motion.h1>
            <motion.p
              className="text-lg text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Discover students with complementary skills and start your
              learning journey together.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label
                  htmlFor="teachSkill"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I can teach
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="teachSkill"
                    name="teachSkill"
                    value={filters.teachSkill}
                    onChange={handleFilterChange}
                    placeholder="Search skills you can teach"
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="learnSkill"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I want to learn
                </label>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    id="learnSkill"
                    name="learnSkill"
                    value={filters.learnSkill}
                    onChange={handleFilterChange}
                    placeholder="Search skills you want to learn"
                    className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="proficiencyLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Proficiency Level
                </label>
                <select
                  id="proficiencyLevel"
                  name="proficiencyLevel"
                  value={filters.proficiencyLevel}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="any">Any Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-4">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-4 md:mb-0"
              >
                <FiFilter className="mr-2" />
                {showAdvancedFilters
                  ? "Hide Advanced Filters"
                  : "Show Advanced Filters"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Reset
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                  onClick={searchMatches}
                  disabled={searching}
                >
                  <FiSearch className="mr-2" />
                  {searching ? "Searching..." : "Search Matches"}
                </button>
              </div>
            </div>

            {/* Advanced filters */}
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200"
              >
                <div>
                  <label
                    htmlFor="availability"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={filters.availability}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="any">Any Time</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="evenings">Evenings</option>
                    <option value="mornings">Mornings</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Location
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="any">Any Location</option>
                    <option value="remote">Remote</option>
                    <option value="onCampus">On Campus</option>
                    <option value="library">Library</option>
                    <option value="coffeeShop">Coffee Shop</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="sessionType"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Session Type
                  </label>
                  <select
                    id="sessionType"
                    name="sessionType"
                    value={filters.sessionType}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="any">Any Type</option>
                    <option value="oneOnOne">One-on-One</option>
                    <option value="group">Group Session</option>
                    <option value="workshop">Workshop</option>
                    <option value="projectBased">Project-based</option>
                  </select>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Popular Skills Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-gray-700 mb-3 font-medium">Popular Skills</h3>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      learnSkill: skill, // or teachSkill, based on intent
                    }))
                  }
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                >
                  {skill}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Potential Matches {matchCount > 0 && `(${matchCount})`}
            </h2>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rating</option>
                <option value="newest">Newest Profiles</option>
                <option value="sessions">Most Sessions</option>
              </select>
            </div>
          </div>

          {/* Search Status */}
          {searching && (
            <div className="text-center py-6">
              <p className="text-blue-600">Searching for matched users...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* No Results Message */}
          {!searching && !error && users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                No matches found for your criteria.
              </p>
              <p className="text-gray-500">
                Try adjusting your filters or adding more skills to your
                profile.
              </p>
            </div>
          )}

          {/* Results Grid */}
          {!searching && users.length > 0 && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {users.map((user) => (
                <motion.div
                  key={user._id}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <img
                        src={user.image} // Replace with user.avatar if available
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {user.fullName}
                        </h3>
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-gray-700 text-sm">
                            {user.ratings || "4.5"} ·{" "}
                            {user.matches?.length || 0} matches
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-blue-500">
                      <FiBookmark />
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Can teach:</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {user.teachSkills &&
                        user.teachSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                          >
                            {typeof skill === "object" ? skill.skill : skill}
                            {typeof skill === "object" &&
                              skill.proficiency &&
                              ` (${skill.proficiency})`}
                          </span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mb-1">
                      Wants to learn:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.learnSkills &&
                        user.learnSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {connectionStatus[user._id] === "pending" ? (
                    <button
                      className="w-full py-2 bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center cursor-default"
                      disabled
                    >
                      <FiClock className="mr-2" /> Request Pending
                    </button>
                  ) : (
                    <button
                      className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      onClick={() => handleConnect(user._id)}
                    >
                      <FiMessageSquare className="mr-2" /> Connect
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {users.length > 9 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center">
                <button className="px-3 py-1 mx-1 border border-gray-300 rounded hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 mx-1 bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-1 mx-1 border border-gray-300 rounded hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 mx-1 border border-gray-300 rounded hover:bg-gray-50">
                  3
                </button>
                <span className="mx-2">...</span>
                <button className="px-3 py-1 mx-1 border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-12 px-4 md:px-12 lg:px-24 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-1/4 flex items-center justify-center">
                <motion.div
                  className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <FiSliders className="text-white text-4xl" />
                </motion.div>
              </div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Get AI-Powered Match Recommendations
                </h3>
                <p className="text-gray-600 mb-4">
                  Not finding what you're looking for? Our AI can analyze your
                  profile and learning goals to suggest the best possible skill
                  matches for you.
                </p>
                <button
                  onClick={generateSmart}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Generate Smart Recommendations
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">SkillSwap</h3>
              <p className="text-sm">
                © {new Date().getFullYear()} SkillSwap. All rights reserved.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
      <AiRecommendationsModal
        isOpen={showRecommendationsModal}
        onClose={() => setShowRecommendationsModal(false)}
        recommendations={aiRecommendationsData}
        loading={isGeneratingRecommendations}
      />
    </div>
  );
};

export default SkillMatchingPage;
