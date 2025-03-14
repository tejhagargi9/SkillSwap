import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiLoader, FiAward, FiCheckCircle, FiBook, FiCalendar, FiLink } from "react-icons/fi";

const AiRecommendationsModal = ({ isOpen, onClose, recommendations, loading }) => {
  // Local state to manage animation
  const [animationComplete, setAnimationComplete] = useState(false);
  const [activeTab, setActiveTab] = useState('recommendations');

  // Reset animation state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAnimationComplete(false);
    }
  }, [isOpen]);

  // Extract data from recommendations object
  const skillRecommendations = recommendations?.recommendations || [];
  const roadmap = recommendations?.roadmap || [];
  const resources = recommendations?.resources || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden z-50"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b p-5">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <FiAward className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">AI Learning Recommendations</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              {/* Tabs */}
              {!loading && (
                <div className="flex border-b">
                  <button
                    className={`px-4 py-3 font-medium ${activeTab === 'recommendations' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('recommendations')}
                  >
                    Recommendations
                  </button>
                  <button
                    className={`px-4 py-3 font-medium ${activeTab === 'roadmap' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('roadmap')}
                  >
                    Learning Roadmap
                  </button>
                  <button
                    className={`px-4 py-3 font-medium ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
                    onClick={() => setActiveTab('resources')}
                  >
                    Resources
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="mb-4"
                    >
                      <FiLoader className="text-blue-600 text-4xl" />
                    </motion.div>
                    <p className="text-lg text-gray-700 font-medium">Generating personalized recommendations...</p>
                    <p className="text-gray-500 mt-2 text-center max-w-md">
                      Our AI is analyzing your learning preferences to create a tailored learning path
                    </p>

                    {/* Loading bars */}
                    <div className="w-full max-w-md mt-6">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        onAnimationComplete={() => setAnimationComplete(true)}
                        className="h-2 bg-blue-500 rounded-full mb-2"
                      />
                      <AnimatePresence>
                        {animationComplete && (
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "90%" }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="h-2 bg-blue-400 rounded-full mb-2"
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Recommendations Tab */}
                    {activeTab === 'recommendations' && (
                      <div>
                        <p className="text-gray-600 mb-6">
                          Based on your learning goals and profile, we recommend you focus on these complementary skills:
                        </p>
                        
                        <div className="space-y-4">
                          {skillRecommendations.map((rec, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              className="bg-blue-50 p-5 rounded-lg border border-blue-100"
                            >
                              <h3 className="font-semibold text-lg text-blue-700">{rec.skill}</h3>
                              <div className="mt-2 text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                                <p className="flex items-start">
                                  <FiCheckCircle className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                                  <span>{rec.reason}</span>
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Roadmap Tab */}
                    {activeTab === 'roadmap' && (
                      <div>
                        <div className="flex items-center mb-4">
                          <FiCalendar className="text-blue-600 mr-2" />
                          <p className="text-gray-700 font-medium">
                            Your Learning Roadmap
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          {roadmap.map((skillPath, index) => (
                            <div key={index} className="mb-6">
                              <h3 className="text-lg font-semibold text-blue-700 mb-4">{skillPath.skill} Learning Path</h3>
                              
                              <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-blue-200"></div>
                                
                                {/* Timeline items */}
                                {skillPath.weeks.map((week, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="ml-12 relative mb-8"
                                  >
                                    {/* Week circle */}
                                    <div className="absolute -left-12 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                      {week.week}
                                    </div>
                                    
                                    {/* Week content */}
                                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                      <h4 className="font-medium text-gray-800 mb-2">Week {week.week}</h4>
                                      <ul className="list-disc pl-4 space-y-1">
                                        {week.goals.map((goal, goalIdx) => (
                                          <li key={goalIdx} className="text-gray-700">{goal}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Resources Tab */}
                    {activeTab === 'resources' && (
                      <div>
                        <p className="text-gray-600 mb-6">
                          Here are some resources to help you on your learning journey:
                        </p>
                        
                        <div className="space-y-6">
                          {resources.map((resourceCategory, categoryIndex) => (
                            <div key={categoryIndex} className="mb-6">
                              <h3 className="text-lg font-semibold text-blue-700 mb-3">{resourceCategory.skill}</h3>
                              
                              <div className="space-y-3">
                                {resourceCategory.materials.map((resource, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                                  >
                                    <div className="flex items-start">
                                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                                        <FiBook className="text-blue-600" />
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-gray-800">{resource.title}</h4>
                                        <p className="text-sm text-gray-500 mb-1">{resource.type}</p>
                                        <div className="flex items-center text-blue-600 text-sm">
                                          <FiLink className="mr-1" />
                                          <span>{resource.link}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {!loading && (
                <div className="border-t p-4 flex justify-between items-center bg-gray-50">
                  <p className="text-sm text-gray-500">
                    {activeTab === 'recommendations' && `${skillRecommendations.length} recommended skills`}
                    {activeTab === 'roadmap' && `${roadmap.length} learning paths`}
                    {activeTab === 'resources' && `${resources.length} resource categories`}
                  </p>
                  <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AiRecommendationsModal;