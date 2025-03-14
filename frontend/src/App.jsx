import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Navbar from "./Components/Navbar";
import Signup from "./Pages/SignupPage";
import Login from "./Pages/LoginPage";
import SkillMatchingPage from "./Pages/SkillMatching";
import UserProfilePage from "./Pages/UserProfile";
import ChatSessionPage from "./Pages/ChatSessionPage";
import AILearningResourceGenerator from "./Pages/AiResourceGenerator";
import UserDashboard from "./Pages/Dashboard";
import { Provider } from "react-redux";
import { store } from "../Store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/skillMatching" element={<SkillMatchingPage />} />
          <Route path="/userProfile" element={<UserProfilePage />} />
          <Route path="/chatSession" element={<ChatSessionPage />} />
          <Route path="/aiLearning" element={<AILearningResourceGenerator />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
