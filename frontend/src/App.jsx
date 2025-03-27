import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import { Provider } from "react-redux";
import { store } from "../store/store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
