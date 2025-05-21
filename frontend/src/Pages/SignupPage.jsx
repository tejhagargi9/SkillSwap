import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../Store/userSlice";

const Signup = () => {
  // Popular skill categories that users might select from
  const skillCategories = [
    "Programming",
    "Graphic Design",
    "Photography",
    "Writing",
    "Marketing",
    "Music",
    "Language",
    "Cooking",
    "Fitness",
    "Finance",
    "Art",
    "Math",
    "Science",
    "Business",
    "Public Speaking",
  ];

  const [step, setStep] = useState(1);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    teachSkills: [{ skill: "", tag: "", proficiency: "Intermediate" }],
    learnSkills: [""],
    agreeToTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [customTagInput, setCustomTagInput] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get("userId");

    if (userId) {
      // Store userId in localStorage
      localStorage.setItem("userId", userId);
      dispatch(login());
      localStorage.setItem("isLogin", true);
      navigate("/");
    }
  }, [location, dispatch, navigate]);

  // Check passwords match whenever either password field changes
  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTeachSkillChange = (index, field, value) => {
    const skills = [...formData.teachSkills];
    skills[index] = { ...skills[index], [field]: value };
    setFormData({
      ...formData,
      teachSkills: skills,
    });
  };

  const handleLearnSkillChange = (index, value) => {
    const skills = [...formData.learnSkills];
    skills[index] = value;
    setFormData({
      ...formData,
      learnSkills: skills,
    });
  };

  const googlSignUp = () => {
    window.open("http://localhost:3000/auth/google", "_self");
    localStorage.setItem("isLogin", true);
    dispatch(login());
  };

  const handleCustomTagSubmit = (index) => {
    if (customTagInput.trim()) {
      handleTeachSkillChange(index, "tag", customTagInput.trim());
      setCustomTagInput("");
    }
  };

  const addTeachSkillField = () => {
    setFormData({
      ...formData,
      teachSkills: [
        ...formData.teachSkills,
        { skill: "", tag: "", proficiency: "Intermediate" },
      ],
    });
  };

  const addLearnSkillField = () => {
    setFormData({
      ...formData,
      learnSkills: [...formData.learnSkills, ""],
    });
  };

  const removeTeachSkillField = (index) => {
    const skills = [...formData.teachSkills];
    if (skills.length > 1) {
      skills.splice(index, 1);
      setFormData({
        ...formData,
        teachSkills: skills,
      });
    }
  };

  const removeLearnSkillField = (index) => {
    const skills = [...formData.learnSkills];
    if (skills.length > 1) {
      skills.splice(index, 1);
      setFormData({
        ...formData,
        learnSkills: skills,
      });
    }
  };

  const nextStep = () => {
    // For step 1, validate passwords before proceeding
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      if (!formData.password) {
        setPasswordError("Password is required");
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    // Prepare data for backend
    const formattedData = {
      fullName: formData.fullName.trim(),
      email: formData.email.toLowerCase().trim(),
      password: formData.password,
      teachSkills: formData.teachSkills
        .filter((skillObj) => skillObj.skill.trim())
        .map((skillObj) => ({
          skill: skillObj.skill.trim(),
          tag: skillObj.tag.trim() || "Other", // Default to "Other" if no tag
          proficiency: skillObj.proficiency,
        })),
      learnSkills: formData.learnSkills
        .filter((skill) => skill.trim())
        .map((skill) => skill.trim()),
    };

    try {
      setLoading(true);
      setError("");

      const response = await axios.post(`${BACKEND_URL}/signup`, formattedData);

      if (response.status === 201) {
        setSuccess(true);
        console.log("User registered successfully!!");
        // Redirect or clear form after successful registration
        setTimeout(() => {
          // You can use react-router's useNavigate hook instead
          window.location.href = "/login";
        }, 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8"
      >
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl font-bold text-gray-800"
          >
            Join SkillSwap
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-2 text-gray-600"
          >
            Create your account and start exchanging skills
          </motion.p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div
              className={`w-full flex items-center ${
                step > 1 ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                1
              </div>
              <div className="ml-2 text-sm font-medium">Account</div>
            </div>
            <div
              className={`w-full flex items-center ${
                step > 2 ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <div
                className={`w-full h-1 mx-2 ${
                  step > 1 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <div className="ml-2 text-sm font-medium">Skills</div>
            </div>
            <div className="w-full flex items-center text-gray-500">
              <div
                className={`w-full h-1 mx-2 ${
                  step > 2 ? "bg-blue-600" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= 3
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                3
              </div>
              <div className="ml-2 text-sm font-medium">Confirm</div>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm"
          >
            Account created successfully! Redirecting to login...
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          onSubmit={handleSubmit}
        >
          {/* Step 1: Account Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-4">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="your@email.com"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    passwordError ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } ${
                    passwordError
                      ? "focus:border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    passwordError ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    passwordError ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } ${
                    passwordError
                      ? "focus:border-red-500"
                      : "focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <div className="flex justify-end">
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    passwordError
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                  disabled={!!passwordError}
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Skills Information */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills You Can Teach
                </label>
                {formData.teachSkills.map((skillObj, index) => (
                  <div
                    key={`teach-${index}`}
                    className="mb-5 p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Skill Description
                      </label>
                      <div className="flex mb-2">
                        <input
                          type="text"
                          value={skillObj.skill}
                          onChange={(e) =>
                            handleTeachSkillChange(
                              index,
                              "skill",
                              e.target.value
                            )
                          }
                          className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Describe your skill"
                        />
                        <button
                          type="button"
                          onClick={() => removeTeachSkillField(index)}
                          className="ml-2 p-2 text-gray-500 hover:text-red-500"
                          disabled={formData.teachSkills.length <= 1}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Skill Category
                      </label>
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        {skillCategories.slice(0, 9).map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() =>
                              handleTeachSkillChange(index, "tag", category)
                            }
                            className={`py-1 px-2 text-xs rounded-full border ${
                              skillObj.tag === category
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center mt-2">
                        <div className="flex-grow relative">
                          <input
                            type="text"
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            placeholder="Other category..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCustomTagSubmit(index)}
                          className="ml-2 px-3 py-2 border border-transparent rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                      </div>

                      {skillObj.tag && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {skillObj.tag}
                            <button
                              type="button"
                              className="ml-1 text-blue-500 hover:text-blue-600"
                              onClick={() =>
                                handleTeachSkillChange(index, "tag", "")
                              }
                            >
                              &times;
                            </button>
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Proficiency Level
                      </label>
                      <select
                        value={skillObj.proficiency}
                        onChange={(e) =>
                          handleTeachSkillChange(
                            index,
                            "proficiency",
                            e.target.value
                          )
                        }
                        className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTeachSkillField}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add another skill
                </button>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills You Want to Learn
                </label>
                {formData.learnSkills.map((skill, index) => (
                  <div key={`learn-${index}`} className="flex mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) =>
                        handleLearnSkillChange(index, e.target.value)
                      }
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Photography, Public Speaking"
                    />
                    <button
                      type="button"
                      onClick={() => removeLearnSkillField(index)}
                      className="ml-2 p-2 text-gray-500 hover:text-red-500"
                      disabled={formData.learnSkills.length <= 1}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLearnSkillField}
                  className="mt-1 text-sm text-blue-600 hover:text-blue-500 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add another skill
                </button>
              </div>

              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Review Your Information
                </h3>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium text-sm text-gray-700 mb-1">
                    Account
                  </p>
                  <p className="text-gray-800">Name: {formData.fullName}</p>
                  <p className="text-gray-800">Email: {formData.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium text-sm text-gray-700 mb-1">
                    Skills You Can Teach
                  </p>
                  {formData.teachSkills.some(skill => skill.skill.trim()) ? (
                    <ul className="list-disc list-inside">
                      {formData.teachSkills
                        .filter((skill) => skill.skill.trim())
                        .map((skillObj, index) => (
                          <li
                            key={`teach-review-${index}`}
                            className="text-gray-800 mb-1"
                          >
                            {skillObj.skill}
                            {skillObj.tag && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {skillObj.tag}
                              </span>
                            )}
                            <span className="text-gray-500 ml-1">
                              ({skillObj.proficiency})
                            </span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No teaching skills added</p>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-medium text-sm text-gray-700 mb-1">
                    Skills You Want to Learn
                  </p>
                  {formData.learnSkills.some(skill => skill.trim()) ? (
                    <ul className="list-disc list-inside">
                      {formData.learnSkills
                        .filter((skill) => skill.trim())
                        .map((skill, index) => (
                          <li
                            key={`learn-review-${index}`}
                            className="text-gray-800"
                          >
                            {skill}
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic">No learning skills added</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeToTerms"
                      className="font-medium text-gray-700"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={!formData.agreeToTerms || loading}
                  whileHover={
                    formData.agreeToTerms && !loading ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    formData.agreeToTerms && !loading ? { scale: 0.98 } : {}
                  }
                  className={`px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                    formData.agreeToTerms && !loading
                      ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 text-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>

            <div className="w-full max-w-xs">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={googlSignUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center w-full max-w-xs px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up with Google
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
