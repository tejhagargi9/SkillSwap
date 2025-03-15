import React, { useState, useEffect } from "react";
import {
  FiUser,
  FiMapPin,
  FiMail,
  FiEdit2,
  FiSave,
  FiX,
  FiLock,
  FiPhone,
  FiCalendar,
  FiBookOpen,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiAward,
} from "react-icons/fi";
import axios from "axios";

const AccountPage = () => {
  // User account information
  const [userAccount, setUserAccount] = useState({
    fullName: "",
    email: "",
    bio: "",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
    teachSkills: [],
    learnSkills: [],
    ratings: 0,
    createdAt: "",
  });

  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userAccount });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changePassword, setChangePassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
    url: "",
  });
  const [addingCertification, setAddingCertification] = useState(false);
  const [newTeachSkill, setNewTeachSkill] = useState({
    skill: "",
    tag: "Other",
    proficiency: "Intermediate",
  });
  const [newLearnSkill, setNewLearnSkill] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  // Tags for skills
  const availableTags = [
    "Programming",
    "Language",
    "Music",
    "Art",
    "Sports",
    "Cooking",
    "Finance",
    "Education",
    "Other",
  ];
  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced"];

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you'd get the userId from context/state/URL
        const userId = localStorage.getItem("userId"); // Example ID
        const response = await axios.get(`${BACKEND_URL}/getUser`, {
          params: { userId }, // Correct way to pass query parameters
        });
        const userData = response.data;


        // Format date from ISO to readable format
        const joinDate = new Date(userData.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );

        setUserAccount({
          ...userData,
          createdAt: joinDate,
        });
        setFormData({
          ...userData,
          createdAt: joinDate,
        });

        console.log("details : ",formData)

        // For demonstration, initialize with sample certifications
        setCertifications([
          {
            id: 1,
            name: "Web Development",
            issuer: "Udemy",
            date: "2023-05-15",
            url: "https://udemy.com/certificate/123",
          },
          {
            id: 2,
            name: "React Advanced",
            issuer: "Coursera",
            date: "2023-10-22",
            url: "https://coursera.org/verify/456",
          },
        ]);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle new teach skill input
  const handleTeachSkillChange = (e) => {
    const { name, value } = e.target;
    setNewTeachSkill((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new teach skill
  const handleAddTeachSkill = () => {
    if (newTeachSkill.skill.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      teachSkills: [
        ...prev.teachSkills,
        {
          skill: [newTeachSkill.skill.trim()],
          tag: newTeachSkill.tag,
          proficiency: newTeachSkill.proficiency,
        },
      ],
    }));

    setNewTeachSkill({ skill: "", tag: "Other", proficiency: "Intermediate" });
  };

  // Remove teach skill
  const handleRemoveTeachSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      teachSkills: prev.teachSkills.filter((_, i) => i !== index),
    }));
  };

  // Add new learn skill
  const handleAddLearnSkill = () => {
    if (newLearnSkill.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      learnSkills: [...prev.learnSkills, newLearnSkill.trim()],
    }));

    setNewLearnSkill("");
  };

  // Remove learn skill
  const handleRemoveLearnSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      learnSkills: prev.learnSkills.filter((_, i) => i !== index),
    }));
  };

  // Handle certification input changes
  const handleCertificationChange = (e) => {
    const { name, value } = e.target;
    setNewCertification((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new certification
  const handleAddCertification = () => {
    if (
      newCertification.name.trim() === "" ||
      newCertification.issuer.trim() === ""
    )
      return;

    const newCert = {
      id: Date.now(),
      ...newCertification,
    };

    setCertifications((prev) => [...prev, newCert]);
    setNewCertification({ name: "", issuer: "", date: "", url: "" });
    setAddingCertification(false);
  };

  // Remove certification
  const handleRemoveCertification = (id) => {
    setCertifications((prev) => prev.filter((cert) => cert.id !== id));
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically send data to your backend
      // const response = await axios.put(`/api/users/update/${userAccount._id}`, formData);
      setUserAccount(formData);
      setEditMode(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
    }
  };

  // Save password changes
  const handleSavePassword = async (e) => {
    e.preventDefault();
    try {
      // Here you would typically validate and send data to your backend
      // const response = await axios.put(`/api/users/update-password/${userAccount._id}`, passwordForm);
      setChangePassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error updating password:", err);
      setError("Failed to update password");
    }
  };

  // Cancel edit mode
  const handleCancel = () => {
    setEditMode(false);
    setFormData({ ...userAccount });
  };

  // Cancel password change
  const handleCancelPassword = () => {
    setChangePassword(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Account Settings
        </h1>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center">
            <FiCheck className="text-green-500 mr-2" />
            {successMessage}
          </div>
        )}

        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiUser className="mr-2 text-blue-500" />
              Profile Information
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FiEdit2 className="mr-1" />
                Edit
              </button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleSaveProfile}>
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                  <div className="relative">
                    <img
                      src={formData.image}
                      alt={formData.fullName}
                      className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Skills I Can Teach Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Skills I Can Teach
                </h3>
                <div className="space-y-3">
                  {formData.teachSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {skill.skill.join(", ")}
                        </span>
                        <div className="flex space-x-2 text-sm text-gray-600">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            {skill.tag}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md">
                            {skill.proficiency}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveTeachSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}

                  <div className="flex flex-col space-y-2 bg-gray-50 p-3 rounded-md">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="skill"
                        value={newTeachSkill.skill}
                        onChange={handleTeachSkillChange}
                        placeholder="Add a skill to teach"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        name="tag"
                        value={newTeachSkill.tag}
                        onChange={handleTeachSkillChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {availableTags.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                      <select
                        name="proficiency"
                        value={newTeachSkill.proficiency}
                        onChange={handleTeachSkillChange}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {proficiencyLevels.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddTeachSkill}
                      className="self-start flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <FiPlus className="mr-1" />
                      Add Skill
                    </button>
                  </div>
                </div>
              </div>

              {/* Skills I Want to Learn Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Skills I Want to Learn
                </h3>
                <div className="space-y-3">
                  {formData.learnSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLearnSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}

                  <div className="flex space-x-2 bg-gray-50 p-3 rounded-md">
                    <input
                      type="text"
                      value={newLearnSkill}
                      onChange={(e) => setNewLearnSkill(e.target.value)}
                      placeholder="Add a skill to learn"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddLearnSkill}
                      className="flex items-center text-blue-500 hover:text-blue-700"
                    >
                      <FiPlus className="mr-1" />
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-col md:flex-row mb-6">
                <div className="md:w-1/3 flex justify-center mb-4 md:mb-0">
                  <img
                    src={userAccount.image}
                    alt={userAccount.fullName}
                    className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                  />
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {userAccount.fullName}
                    </h3>
                    <div className="flex items-center text-gray-600 mt-1">
                      <FiCalendar className="mr-2" />
                      <span>Member since {userAccount.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="text-blue-500 mr-2" />
                    <span>{userAccount.email}</span>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <FiBookOpen className="text-blue-500 mr-2" />
                      <span className="font-medium">Bio</span>
                    </div>
                    <p className="text-gray-600">
                      {userAccount.bio || "No bio added yet."}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center mr-3">
                      <FiCheck className="text-green-500 mr-1" />
                      <span>Rating: {userAccount.ratings}/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Display */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Skills I Can Teach
                </h3>
                {userAccount.teachSkills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userAccount.teachSkills.map((skill, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md">
                        <div className="font-medium">
                          {skill.skill.join(", ")}
                        </div>
                        <div className="flex space-x-2 mt-1">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                            {skill.tag}
                          </span>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-md">
                            {skill.proficiency}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No teaching skills added yet.</p>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Skills I Want to Learn
                </h3>
                {userAccount.learnSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userAccount.learnSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gray-50 px-3 py-2 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No learning skills added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Password Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiLock className="mr-2 text-blue-500" />
              Password
            </h2>
            {!changePassword && (
              <button
                onClick={() => setChangePassword(true)}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FiEdit2 className="mr-1" />
                Change Password
              </button>
            )}
          </div>

          {changePassword ? (
            <form onSubmit={handleSavePassword}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Update Password
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center">
              <div className="w-full bg-gray-100 rounded-md px-4 py-3 text-gray-600">
                ••••••••••••••
              </div>
            </div>
          )}
        </div>

        {/* Certifications Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FiAward className="mr-2 text-blue-500" />
              Certifications
            </h2>
            {!addingCertification && (
              <button
                onClick={() => setAddingCertification(true)}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FiPlus className="mr-1" />
                Add Certification
              </button>
            )}
          </div>

          {addingCertification ? (
            <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certification Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newCertification.name}
                  onChange={handleCertificationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  name="issuer"
                  value={newCertification.issuer}
                  onChange={handleCertificationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={newCertification.date}
                  onChange={handleCertificationChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credential URL (optional)
                </label>
                <input
                  type="url"
                  name="url"
                  value={newCertification.url}
                  onChange={handleCertificationChange}
                  placeholder="https://example.com/verify/123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setAddingCertification(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCertification}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Add Certification
                </button>
              </div>
            </div>
          ) : null}

          {certifications.length > 0 ? (
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-md"
                >
                  <div>
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-sm text-gray-600">
                      {cert.issuer} • {new Date(cert.date).toLocaleDateString()}
                    </div>
                    {cert.url && (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        View Credential
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(cert.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No certifications added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
