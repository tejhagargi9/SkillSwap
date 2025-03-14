import React, { useState } from "react";
import { 
  FiSend, 
  FiPaperclip, 
  FiSmile, 
  FiSearch,
  FiMessageCircle,
  FiCalendar
} from "react-icons/fi";

const ChatSessionPage = () => {
  // Current active chat user
  const [activeChat, setActiveChat] = useState({
    id: 1,
    name: "Alex Chen",
    avatar: "/api/placeholder/50/50",
    status: "online",
    skills: {
      teaching: ["Web Development", "React"],
      learning: ["UI/UX Design", "Graphic Design"]
    }
  });

  // Mock chat messages
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex Chen",
      text: "Hey Maya! I saw your profile and I'm interested in doing a skill exchange. Do you have time this week?",
      timestamp: "10:15 AM",
      type: "received"
    },
    {
      id: 2,
      sender: "Maya Johnson",
      text: "Hi Alex! Sure, I'd love to discuss web development. What specific areas are you looking to learn?",
      timestamp: "10:17 AM",
      type: "sent"
    }
  ]);

  // New message input
  const [newMessage, setNewMessage] = useState("");

  // Upcoming sessions
  const [upcomingSessions, setUpcomingSessions] = useState([
    {
      id: 1,
      partner: "Alex Chen",
      skill: "Web Development",
      date: "March 15, 2024",
      time: "7:00 PM",
      status: "Confirmed"
    }
  ]);

  // AI Assistant suggestions
  const [aiSuggestions, setAiSuggestions] = useState([
    "How to start learning Python?",
    "Best resources for React beginners",
    "UX design interview tips",
    "Graphic design portfolio building"
  ]);

  // Render chat interface
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex">
      {/* Sidebar - Contacts & Sessions */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Chats & Sessions</h2>
          <button className="text-blue-600">
            <FiSearch />
          </button>
        </div>

        {/* Upcoming Sessions */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-700">Upcoming Sessions</h3>
            <FiCalendar className="text-blue-600" />
          </div>
          {upcomingSessions.map((session) => (
            <div 
              key={session.id} 
              className="bg-blue-50 p-3 rounded-lg mb-2"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-blue-800">{session.partner}</p>
                  <p className="text-sm text-gray-600">{session.skill}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{session.date}</p>
                  <p className="text-xs text-gray-500">{session.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Chats */}
        <div className="flex-1 overflow-y-auto">
          {[
            {
              id: 1,
              name: "Alex Chen",
              avatar: "/api/placeholder/50/50",
              lastMessage: "Looking forward to our session...",
              timestamp: "10:20 AM",
              unread: 2
            },
            {
              id: 2,
              name: "Jordan Taylor",
              avatar: "/api/placeholder/50/50",
              lastMessage: "Thanks for the UI tips!",
              timestamp: "Yesterday",
              unread: 0
            }
          ].map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 flex items-center hover:bg-blue-50 cursor-pointer ${
                chat.id === activeChat.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => setActiveChat({
                id: chat.id,
                name: chat.name,
                avatar: chat.avatar,
                status: "online",
                skills: {
                  teaching: ["Web Development"],
                  learning: ["UI/UX"]
                }
              })}
            >
              <div className="relative mr-4">
                <img 
                  src={chat.avatar} 
                  alt={chat.name} 
                  className="w-12 h-12 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{chat.name}</h3>
                  <span className="text-xs text-gray-500">{chat.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative mr-4">
              <img 
                src={activeChat.avatar} 
                alt={activeChat.name} 
                className="w-12 h-12 rounded-full"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{activeChat.name}</h2>
              <p className="text-sm text-gray-500">
                {activeChat.status === "online" ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-blue-50">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${
                message.type === 'sent' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div 
                className={`max-w-md p-3 rounded-lg ${
                  message.type === 'sent' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p>{message.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex overflow-x-auto space-x-2 mb-2">
            {aiSuggestions.map((suggestion, index) => (
              <button 
                key={index}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm whitespace-nowrap hover:bg-blue-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 hover:text-blue-600">
              <FiPaperclip size={20} />
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              <FiSmile size={20} />
            </button>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
              <FiSend />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* AI Assistant */}
        <div className="flex-1 p-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiMessageCircle className="text-white text-3xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              AI Learning Assistant
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get instant guidance, resources, and answers about your skills.
            </p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSessionPage;