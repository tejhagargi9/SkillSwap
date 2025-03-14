import React, { useState } from 'react';
import { 
  FiSearch, 
  FiBook, 
  FiStar, 
  FiTarget, 
  FiBookOpen, 
  FiCheckCircle 
} from 'react-icons/fi';

const AILearningResourceGenerator = () => {
  // State for skill input and generated plan
  const [skill, setSkill] = useState('');
  const [learningPlan, setLearningPlan] = useState(null);

  // Mock function to generate learning plan (would be replaced with actual API call)
  const generateLearningPlan = () => {
    // Simulated learning plan generation
    setLearningPlan({
      skillName: skill,
      overview: `7-Day Learning Plan for ${skill}`,
      days: [
        {
          day: 1,
          focus: 'Introduction and Fundamentals',
          resources: [
            { 
              title: 'Beginner Basics Video Tutorial', 
              type: 'Video',
              link: '#'
            },
            { 
              title: 'Introductory Article', 
              type: 'Article',
              link: '#'
            }
          ]
        },
        {
          day: 2,
          focus: 'Core Concepts',
          resources: [
            { 
              title: 'Intermediate Concept Explained', 
              type: 'Tutorial',
              link: '#'
            }
          ]
        },
        // Additional days would be similar
      ]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 rounded-t-xl">
          <h1 className="text-2xl font-bold flex items-center">
            <FiBookOpen className="mr-3" /> AI Learning Resource Generator
          </h1>
          <p className="text-blue-100 mt-2">
            Get a personalized 7-day learning plan for any skill
          </p>
        </div>

        {/* Skill Input Section */}
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <input 
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="Enter the skill you want to learn (e.g., React, Python, UX Design)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={generateLearningPlan}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FiSearch className="mr-2" /> Generate Plan
            </button>
          </div>
        </div>

        {/* Learning Plan Result */}
        {learningPlan && (
          <div className="p-6 bg-blue-50 rounded-b-xl">
            <div className="flex items-center mb-6">
              <FiTarget className="mr-3 text-blue-600 text-2xl" />
              <h2 className="text-xl font-semibold text-blue-800">
                {learningPlan.overview}
              </h2>
            </div>

            {learningPlan.days.map((dayPlan) => (
              <div 
                key={dayPlan.day} 
                className="bg-white p-4 rounded-lg mb-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-blue-700">
                    <FiBook className="inline mr-2" />
                    Day {dayPlan.day}: {dayPlan.focus}
                  </h3>
                </div>

                <div className="space-y-2">
                  {dayPlan.resources.map((resource, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-blue-50 rounded"
                    >
                      <div className="flex items-center">
                        <FiCheckCircle className="mr-2 text-green-500" />
                        <span className="font-medium">{resource.title}</span>
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {resource.type}
                        </span>
                      </div>
                      <a 
                        href={resource.link} 
                        className="text-blue-600 hover:underline"
                      >
                        View Resource
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AILearningResourceGenerator;