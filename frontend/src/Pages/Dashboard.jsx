import React, { useState } from 'react';
import { 
  FiUser, 
  FiMapPin, 
  FiMail, 
  FiUsers, 
  FiTrendingUp, 
  FiEdit2 
} from 'react-icons/fi';

const UserDashboard = () => {
  // User Profile Information
  const [userProfile, setUserProfile] = useState({
    name: 'Maya Johnson',
    email: 'maya.johnson@example.com',
    location: 'San Francisco, CA',
    bio: 'Passionate about learning web development and UI/UX design. Always eager to exchange skills and grow together.',
    avatar: '/api/placeholder/200/200'
  });

  // Matched Peers
  const [matchedPeers, setMatchedPeers] = useState([
    {
      id: 1,
      name: 'Alex Chen',
      skills: {
        teaching: ['Web Development', 'React'],
        learning: ['UI/UX Design']
      },
      matchPercentage: 85,
      avatar: '/api/placeholder/50/50'
    },
    {
      id: 2,
      name: 'Jordan Taylor',
      skills: {
        teaching: ['Graphic Design'],
        learning: ['Digital Marketing']
      },
      matchPercentage: 75,
      avatar: '/api/placeholder/50/50'
    }
  ]);

  // Skill Progress
  const [skillProgress, setSkillProgress] = useState([
    {
      skill: 'React',
      level: 'Intermediate',
      progress: 65,
      exchangeSessions: 3
    },
    {
      skill: 'UI/UX Design',
      level: 'Beginner',
      progress: 30,
      exchangeSessions: 1
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex">
      <div className="max-w-6xl mx-auto w-full flex space-x-6">
        {/* User Profile Section */}
        <div className="w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
              />
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full">
                <FiEdit2 size={16} />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {userProfile.name}
            </h2>
          </div>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center">
              <FiMail className="mr-3 text-blue-500" />
              <span>{userProfile.email}</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-3 text-blue-500" />
              <span>{userProfile.location}</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
            <p className="text-gray-600">{userProfile.bio}</p>
          </div>
        </div>

        {/* Matched Peers and Skill Progress Section */}
        <div className="w-2/3 flex flex-col space-y-6">
          {/* Matched Peers */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-1">
            <div className="flex items-center mb-4">
              <FiUsers className="mr-3 text-blue-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">
                Matched Peers
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {matchedPeers.map((peer) => (
                <div 
                  key={peer.id} 
                  className="flex items-center bg-gray-50 p-4 rounded-lg"
                >
                  <img 
                    src={peer.avatar} 
                    alt={peer.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{peer.name}</h3>
                    <div className="text-sm text-gray-600">
                      <p>Teaching: {peer.skills.teaching.join(', ')}</p>
                      <p>Learning: {peer.skills.learning.join(', ')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-blue-600 font-medium">
                      {peer.matchPercentage}% Match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FiTrendingUp className="mr-3 text-blue-500 text-xl" />
              <h2 className="text-xl font-semibold text-gray-800">
                Skill Progress
              </h2>
            </div>
            
            {skillProgress.map((skill) => (
              <div 
                key={skill.skill} 
                className="bg-gray-50 p-4 rounded-lg mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{skill.skill}</h3>
                  <span className="text-sm text-gray-600">{skill.level}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div 
                    className="bg-blue-500 h-2.5 rounded-full" 
                    style={{width: `${skill.progress}%`}}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress: {skill.progress}%</span>
                  <span>
                    {skill.exchangeSessions} Exchange Sessions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;