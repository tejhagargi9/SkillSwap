import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Calendar,
  Edit,
  LogOut,
  Mail,
  PlusCircle,
  Share2,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    profilePicture: "/api/placeholder/150/150",
    joinDate: "May 15, 2023",
    connections: 142,
    skillsToTeach: ["JavaScript", "React", "UI/UX Design"],
    skillsToLearn: ["Python", "Data Science", "Machine Learning"],
    certifications: [],
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    skillsToTeach: user.skillsToTeach.join(", "),
    skillsToLearn: user.skillsToLearn.join(", "),
  });

  // File input reference
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // State for certification modal
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [newCert, setNewCert] = useState({ name: "", link: "", date: "" });
  const [currentUser, setCurrentUser] = useState(null);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/getAllUsers`);
        const users = res.data;

        const matchedUser = users.find((user) => user._id === userId);

        if (matchedUser) {
          setCurrentUser(matchedUser);
          setEditFormData({
            name: matchedUser.fullName,
            email: matchedUser.email,
            profilePicture: matchedUser.image,
            skillsToTeach: matchedUser.teachSkills.join(", "),
            skillsToLearn: matchedUser.learnSkills.join(", "),
          });
          setPreviewUrl(matchedUser.image);
        }

        console.log("Fetched users:", users);
        console.log("Matched user:", matchedUser);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  // Handle profile edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle profile edit form submission
  const handleEditFormSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("fullName", editFormData.name);
      formData.append("email", editFormData.email);
      formData.append(
        "teachSkills",
        JSON.stringify(
          editFormData.skillsToTeach
            .split(",")
            .map((skill) => ({
              skill: skill.trim(),
              tag: "",
              proficiency: "Beginner",
            }))
            .filter((skillObj) => skillObj.skill) // filter out empty strings
        )
      );

      formData.append(
        "learnSkills",
        JSON.stringify(
          editFormData.skillsToLearn
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        )
      );

      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

      const response = await axios.put(
        `${BACKEND_URL}/updateProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setCurrentUser(response.data.user);
        setSelectedFile(null);
        setIsEditModalOpen(false);
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle certification form changes
  const handleCertFormChange = (e) => {
    const { name, value } = e.target;
    setNewCert({
      ...newCert,
      [name]: value,
    });
  };

  // Handle certification form submission
  const handleCertFormSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!newCert.name || !newCert.date) {
      alert("Please fill in the required fields");
      return;
    }

    setIsLoading(true);

    try {
      // Send certification to the database
      const response = await axios.post(`${BACKEND_URL}/addCertifications`, {
        userId: userId,
        certification: {
          name: newCert.name,
          link: newCert.link,
          date: newCert.date,
        },
      });

      if (response.data.success) {
        // Update the local user data with the updated user from the server
        setCurrentUser(response.data.user);

        // Reset the form
        setNewCert({ name: "", link: "", date: "" });
        setIsCertModalOpen(false);
      } else {
        alert("Failed to add certification");
      }
    } catch (error) {
      console.error("Error adding certification:", error);
      alert("Error adding certification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete certification
  const handleDeleteCert = async (certId) => {
    if (
      !window.confirm("Are you sure you want to delete this certification?")
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/user/certifications`,
        {
          data: {
            userId: userId,
            certificationId: certId,
          },
        }
      );

      if (response.data.success) {
        // Update the local user data with the updated user from the server
        setCurrentUser(response.data.user);
      } else {
        alert("Failed to delete certification");
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Error deleting certification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      // Clear localStorage
      localStorage.removeItem("isLogin");
      localStorage.removeItem("userId");
      // Redirect to login page
      window.location.href = "/login";
      
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <Edit className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="px-6 pt-16 pb-6 relative">
            <div className="absolute -top-16 left-6">
              <img
                src={currentUser?.image}
                alt={currentUser?.fullName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>

            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentUser?.fullName}
                </h2>
                <div className="flex items-center mt-1 text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{currentUser?.email}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {currentUser?.createdAt &&
                      new Date(currentUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Share2 className="w-4 h-4" />
                  <span>{currentUser?.matches?.length || 0} connections</span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills I Teach
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser?.teachSkills?.map((skillObj, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skillObj.skill} {/* or any other property you want */}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Skills I Want to Learn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentUser?.learnSkills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-white rounded-lg shadow mt-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Certifications
            </h3>
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <PlusCircle className="w-5 h-5 mr-1" />
              <span>Add Certification</span>
            </button>
          </div>

          {currentUser?.certifications &&
          currentUser.certifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {currentUser.certifications.map((cert) => (
                <div
                  key={cert._id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{cert.name}</h4>
                    <div className="text-sm text-gray-500">
                      Issued: {cert.date}
                    </div>
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View credential
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCert(cert._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    disabled={isLoading}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto text-gray-300 mb-2" />
              <p>You haven't added any certifications yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Profile
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <img
                      src={previewUrl || editFormData.profilePicture}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handleChooseFile}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Change
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="skillsToTeach"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skills to Teach (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skillsToTeach"
                    name="skillsToTeach"
                    value={editFormData.skillsToTeach}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="skillsToLearn"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Skills to Learn (comma separated)
                  </label>
                  <input
                    type="text"
                    id="skillsToLearn"
                    name="skillsToLearn"
                    value={editFormData.skillsToLearn}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isUpdatingProfile}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleEditFormSubmit}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {isCertModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Add Certification
              </h3>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCertFormSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="certName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Certification Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="certName"
                    name="name"
                    value={newCert.name}
                    onChange={handleCertFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="certLink"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Credential Link (optional)
                  </label>
                  <input
                    type="url"
                    id="certLink"
                    name="link"
                    value={newCert.link}
                    onChange={handleCertFormChange}
                    placeholder="https://example.com/credential"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="certDate"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Issue Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="certDate"
                    name="date"
                    value={newCert.date}
                    onChange={handleCertFormChange}
                    placeholder="May 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}