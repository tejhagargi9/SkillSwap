import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiEdit2,
  FiCheckCircle,
  FiStar,
  FiUsers,
  FiAward,
  FiSettings,
  FiPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

const UserProfilePage = () => {
  // Mock user data
  const [user, setUser] = useState({
    id: 1,
    name: "Maya Johnson",
    email: "maya.johnson@example.com",
    avatar: "/api/placeholder/150/150",
    bio: "Graphic designer and aspiring web developer passionate about creating intuitive digital experiences. Always eager to learn and collaborate!",
    location: "San Francisco, CA",
    joinDate: "March 2024",

    // Skills
    teachSkills: [
      { name: "Graphic Design", level: "Advanced", endorsements: 24 },
      { name: "Adobe Illustrator", level: "Advanced", endorsements: 18 },
      { name: "UI/UX Design", level: "Intermediate", endorsements: 12 },
    ],
    learnSkills: [
      { name: "Web Development", level: "Beginner", priority: "High" },
      { name: "JavaScript", level: "Beginner", priority: "High" },
      { name: "React", level: "Beginner", priority: "Medium" },
    ],

    // Session & Ratings
    totalSessions: 47,
    averageRating: 4.8,
    sessionTypes: ["One-on-One", "Group Workshop"],

    // Feedback
    recentFeedback: [
      {
        id: 1,
        name: "Alex Chen",
        rating: 5,
        comment:
          "Maya is an incredible graphic design mentor. She explains complex concepts clearly and provides constructive feedback.",
        date: "2 weeks ago",
      },
      {
        id: 2,
        name: "Jordan Taylor",
        rating: 4.5,
        comment:
          "Great session on UI/UX basics. Very patient and knowledgeable instructor.",
        date: "1 month ago",
      },
    ],

    // Projects
    projects: [
      {
        id: 1,
        title: "Mobile App Redesign",
        description:
          "Comprehensive UI/UX redesign for a local fitness tracking app",
        skills: ["UI Design", "UX Research", "Prototyping"],
        thumbnail: "/api/placeholder/300/200",
      },
      {
        id: 2,
        title: "Branding Project",
        description:
          "Complete brand identity design for a sustainable fashion startup",
        skills: ["Branding", "Logo Design", "Brand Guidelines"],
        thumbnail: "/api/placeholder/300/200",
      },
    ],

    // Privacy Settings
    privacySettings: {
      profileVisibility: "all",
      contactPreference: "matched_skills",
      sessionHistoryVisibility: "connections",
    },
  });

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Privacy settings toggle
  const togglePrivacySetting = (setting) => {
    setUser((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]:
          prev.privacySettings[setting] === "all" ? "connections" : "all",
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Profile Header */}
      <section className="pt-20 pb-8 px-4 md:px-12 lg:px-24 bg-blue-600">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center"
          >
            <div className="relative mb-4 md:mb-0 md:mr-8">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-36 h-36 rounded-full border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                  <FiEdit2 />
                </button>
              )}
            </div>
            <div className="text-center md:text-left text-white">
              <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
              <p className="text-blue-100 mb-2">{user.location}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-blue-100">
                <div className="flex items-center">
                  <FiStar className="mr-1" /> {user.averageRating} Rating
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-1" /> {user.totalSessions} Sessions
                </div>
                <div className="flex items-center">
                  <FiAward className="mr-1" /> Joined {user.joinDate}
                </div>
              </div>
            </div>
            <div className="ml-auto hidden md:block">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 flex items-center"
              >
                {isEditing ? (
                  <>
                    <FiCheckCircle className="mr-2" /> Save Profile
                  </>
                ) : (
                  <>
                    <FiEdit2 className="mr-2" /> Edit Profile
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-12 lg:px-24 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Bio & Skills */}
          <div className="md:col-span-2 space-y-8">
            {/* Bio Section */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">About Me</h2>
                {isEditing && <FiEdit2 className="text-gray-500" />}
              </div>
              {isEditing ? (
                <textarea
                  className="w-full h-32 p-2 border rounded-lg"
                  defaultValue={user.bio}
                />
              ) : (
                <p className="text-gray-600">{user.bio}</p>
              )}
            </motion.div>

            {/* Skills Section */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Skills</h2>
                {isEditing && (
                  <button className="text-blue-600 flex items-center">
                    <FiPlus className="mr-1" /> Add Skill
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Skills I Can Teach
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.teachSkills.map((skill) => (
                    <div key={skill.name} className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-blue-800">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Level: {skill.level} · {skill.endorsements}{" "}
                            Endorsements
                          </p>
                        </div>
                        {isEditing && <FiEdit2 className="text-gray-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  Skills I Want to Learn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.learnSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="bg-green-50 p-3 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-green-800">
                            {skill.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            Level: {skill.level} · Priority: {skill.priority}
                          </p>
                        </div>
                        {isEditing && <FiEdit2 className="text-gray-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Feedback & Projects */}
          <div className="space-y-8">
            {/* Recent Feedback */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Recent Feedback
              </h2>
              {user.recentFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border-b pb-4 mb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{feedback.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {feedback.date}
                    </span>
                  </div>
                  <p className="text-gray-600 italic">"{feedback.comment}"</p>
                  <p className="text-sm text-gray-500 mt-1">
                    - {feedback.name}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Projects */}
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Projects</h2>
                {isEditing && (
                  <button className="text-blue-600 flex items-center">
                    <FiPlus className="mr-1" /> Add Project
                  </button>
                )}
              </div>
              {user.projects.map((project) => (
                <div key={project.id} className="mb-4 last:mb-0">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="w-full rounded-lg mb-2"
                  />
                  <h3 className="font-semibold text-gray-800">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Privacy Settings */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-6 rounded-xl shadow-md mt-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiSettings className="mr-2" /> Privacy Settings
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-700">
                  Profile Visibility
                </h3>
                <p className="text-sm text-gray-500">
                  Who can view your full profile
                </p>
              </div>
              <button
                onClick={() => togglePrivacySetting("profileVisibility")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  user.privacySettings.profileVisibility === "all"
                    ? "bg-green-50 text-green-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {user.privacySettings.profileVisibility === "all" ? (
                  <>
                    <FiEye className="mr-2" /> Public
                  </>
                ) : (
                  <>
                    <FiEyeOff className="mr-2" /> Connections Only
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-700">
                  Contact Preferences
                </h3>
                <p className="text-sm text-gray-500">
                  Who can initiate skill exchange requests
                </p>
              </div>
              <button
                onClick={() => togglePrivacySetting("contactPreference")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  user.privacySettings.contactPreference === "matched_skills"
                    ? // Continued from previous code
                      "bg-green-50 text-green-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {user.privacySettings.contactPreference === "matched_skills" ? (
                  <>
                    <FiUsers className="mr-2" /> Matched Skills
                  </>
                ) : (
                  <>
                    <FiEyeOff className="mr-2" /> Connections Only
                  </>
                )}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-700">Session History</h3>
                <p className="text-sm text-gray-500">
                  Visibility of past skill exchange sessions
                </p>
              </div>
              <button
                onClick={() => togglePrivacySetting("sessionHistoryVisibility")}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  user.privacySettings.sessionHistoryVisibility ===
                  "connections"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {user.privacySettings.sessionHistoryVisibility ===
                "connections" ? (
                  <>
                    <FiEyeOff className="mr-2" /> Connections Only
                  </>
                ) : (
                  <>
                    <FiEye className="mr-2" /> Public
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recommended Matches Based on Skills */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="bg-blue-50 p-6 rounded-xl shadow-md mt-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Recommended Skill Matches
            </h2>
            <button className="text-blue-600 hover:underline">
              View All Matches
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Alex Chen",
                avatar: "/api/placeholder/50/50",
                teachSkills: ["Web Development", "React"],
                learnSkills: ["Graphic Design", "UI/UX"],
                compatibility: 85,
              },
              {
                name: "Jordan Taylor",
                avatar: "/api/placeholder/50/50",
                teachSkills: ["UI/UX Design", "Figma"],
                learnSkills: ["JavaScript", "Front-end Development"],
                compatibility: 75,
              },
              {
                name: "Emma Wilson",
                avatar: "/api/placeholder/50/50",
                teachSkills: ["Illustrator", "Branding"],
                learnSkills: ["Marketing", "Social Media Strategy"],
                compatibility: 65,
              },
            ].map((match) => (
              <div
                key={match.name}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="font-semibold">{match.name}</h3>
                    <p className="text-sm text-gray-500">
                      {match.compatibility}% Compatibility
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1">Can Teach:</p>
                  <div className="flex flex-wrap gap-2">
                    {match.teachSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Wants to Learn:</p>
                  <div className="flex flex-wrap gap-2">
                    {match.learnSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex mt-4 gap-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                    Connect
                  </button>
                  <button className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm hover:bg-blue-50">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

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
    </div>
  );
};

export default UserProfilePage;
