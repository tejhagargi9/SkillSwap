import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, MoreVertical, Phone, Video, Paperclip, Smile, Mic, ChevronLeft, ChevronRight, X } from "lucide-react";

// Mock data for users and messages
const users = [
  {
    id: 1,
    name: "Emma Watson",
    avatar: "EW",
    status: "online",
    lastMessage: "Sure, let's meet tomorrow!",
    time: "5m",
    unread: 0,
  },
  {
    id: 2,
    name: "John Doe",
    avatar: "JD",
    status: "online",
    lastMessage: "Did you finish the project?",
    time: "30m",
    unread: 2,
  },
  {
    id: 3,
    name: "Sarah Parker",
    avatar: "SP",
    status: "offline",
    lastMessage: "The meeting was rescheduled",
    time: "2h",
    unread: 0,
  },
  {
    id: 4,
    name: "Michael Chen",
    avatar: "MC",
    status: "online",
    lastMessage: "Check out this new design",
    time: "1d",
    unread: 0,
  },
  {
    id: 5,
    name: "Lisa Johnson",
    avatar: "LJ",
    status: "offline",
    lastMessage: "Thanks for your help!",
    time: "2d",
    unread: 0,
  },
];

const messages = [
  {
    id: 1,
    sender: 2,
    text: "Hey there! How's your day going?",
    time: "10:30 AM",
    isRead: true,
  },
  {
    id: 2,
    sender: 0, // Current user
    text: "Hi! Pretty good, just finishing up some work. How about you?",
    time: "10:32 AM",
    isRead: true,
  },
  {
    id: 3,
    sender: 2,
    text: "I'm doing well! Just wondering if you've had a chance to look at the project requirements I sent yesterday?",
    time: "10:35 AM",
    isRead: true,
  },
  {
    id: 4,
    sender: 0,
    text: "Yes, I've gone through them. I have a few questions about the timeline though.",
    time: "10:38 AM",
    isRead: true,
  },
  {
    id: 5,
    sender: 2,
    text: "Sure, what questions do you have?",
    time: "10:40 AM",
    isRead: true,
  },
  {
    id: 6,
    sender: 2,
    text: "Did you finish the project?",
    time: "10:45 AM",
    isRead: false,
  },
];

// Emoji data
const emojiCategories = [
  {
    name: "Smileys & Emotion",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱"]
  },
  {
    name: "People & Body",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦵", "🦿", "🦶", "👂", "🦻", "👃", "🧠", "👣", "🫀", "🫁", "🦷", "🦴"]
  },
  {
    name: "Animals & Nature",
    emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🐛", "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕"]
  },
  {
    name: "Food & Drink",
    emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🫒", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫓", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟"]
  },
  {
    name: "Travel & Places",
    emojis: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸"]
  },
  {
    name: "Activities",
    emojis: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴"]
  },
  {
    name: "Objects",
    emojis: ["⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️"]
  },
  {
    name: "Symbols",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "☮️", "✝️", "☪️", "🕉️", "☸️", "✡️", "🔯", "🕎", "☯️", "☦️", "🛐", "⛎", "♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓", "🆔", "⚛️"]
  }
];

export default function ChatApplication() {
  const [selectedUser, setSelectedUser] = useState(users[1]);
  const [messageInput, setMessageInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState(messages);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(0);
  const emojiPickerRef = useRef(null);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      sender: 0, // Current user
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setMessageInput("");
  };

  useEffect(() => {
    // Close emoji picker when clicked outside
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  
  const handleEmojiClick = (emoji) => {
    setMessageInput(messageInput + emoji);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar with user list */}
      <motion.div 
        className="bg-white shadow-md flex flex-col"
        initial={{ width: sidebarOpen ? 320 : 0 }}
        animate={{ width: sidebarOpen ? 320 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              <div className="flex space-x-2">
              </div>
            </div>

            {/* Search */}
            <div className="p-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search messages" 
                  className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>

            {/* User list */}
            <div className="flex-1 overflow-y-auto">
              {users.map(user => (
                <motion.div 
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`flex items-center p-4 cursor-pointer border-l-4 ${
                    selectedUser.id === user.id 
                      ? "border-indigo-500 bg-indigo-50" 
                      : "border-transparent hover:bg-gray-50"
                  }`}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center 
                      ${selectedUser.id === user.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-200 text-gray-600"} 
                      font-semibold text-lg`}>
                      {user.avatar}
                    </div>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white 
                      ${user.status === "online" ? "bg-green-500" : "bg-gray-400"}`}>
                    </span>
                  </div>
                  
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <span className="text-xs text-gray-500">{user.time}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-gray-500 truncate max-w-xs">{user.lastMessage}</p>
                      {user.unread > 0 && (
                        <span className="bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {user.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Toggle sidebar button */}
      <button 
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md z-10 rounded-r-md p-1"
        style={{ left: sidebarOpen ? "320px" : "0" }}
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-white ml-1">
        {/* Chat header */}
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
          <div className="flex items-center">
            <div className="relative mr-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold">
                {selectedUser.avatar}
              </div>
              <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white 
                ${selectedUser.status === "online" ? "bg-green-500" : "bg-gray-400"}`}>
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{selectedUser.name}</h3>
              <p className="text-xs text-gray-500">{selectedUser.status === "online" ? "Online" : "Offline"}</p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {chatMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 0 ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                    message.sender === 0 
                      ? "bg-indigo-500 text-white rounded-br-none" 
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                    message.sender === 0 ? "text-indigo-100" : "text-gray-500"
                  }`}>
                    <span>{message.time}</span>
                    {message.sender === 0 && (
                      <span>{message.isRead ? "✓✓" : "✓"}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="border-t p-4 relative">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <div className="relative">
              <button 
                className={`p-2 rounded-full ${showEmojiPicker ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                onClick={toggleEmojiPicker}
              >
                <Smile size={20} className="text-gray-600" />
              </button>
              
              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div 
                    ref={emojiPickerRef}
                    className="absolute bottom-14 left-0 bg-white rounded-lg shadow-xl border border-gray-200 w-72 sm:w-80 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2 border-b flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Emoji</h3>
                      <button 
                        onClick={() => setShowEmojiPicker(false)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                    
                    {/* Category tabs */}
                    <div className="flex overflow-x-auto p-2 border-b scrollbar-hide">
                      {emojiCategories.map((category, index) => (
                        <button
                          key={category.name}
                          onClick={() => setSelectedEmojiCategory(index)}
                          className={`flex-shrink-0 p-2 mx-1 rounded-md ${
                            selectedEmojiCategory === index 
                              ? 'bg-indigo-100 text-indigo-600' 
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          {category.emojis[0]}
                        </button>
                      ))}
                    </div>
                    
                    {/* Emojis grid */}
                    <div className="h-48 overflow-y-auto p-2">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">{emojiCategories[selectedEmojiCategory].name}</h4>
                      <div className="grid grid-cols-8 gap-1">
                        {emojiCategories[selectedEmojiCategory].emojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="w-8 h-8 flex items-center justify-center text-xl hover:bg-gray-100 rounded"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 resize-none max-h-32 py-2 px-3 text-sm"
              rows={1}
            />
            <div className="flex space-x-2"> 
              <button 
                onClick={handleSendMessage}
                className={`p-2 rounded-full ${
                  messageInput.trim() ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}