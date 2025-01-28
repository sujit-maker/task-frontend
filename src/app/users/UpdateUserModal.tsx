import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface UpdateUserModalProps {
  show: boolean;
  onHide: () => void;
  userId: string; 
  fetchUsers: () => void;
}

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ show, onHide, userId, fetchUsers }) => {
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const [departmentId, setdepartmentId] = useState<string>('');
  const [userType, setUserType] = useState<string>('');

  // Fetch existing user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8000/users/${userId}`);
          const userData = response.data;
          setUsername(userData.username);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setContactNumber(userData.contactNumber);
          setEmailId(userData.emailId);
          setdepartmentId(userData.departmentId);
          setUserType(userData.userType);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    if (show) {
      fetchUserData();
    }
  }, [userId, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = {
        username,
        firstName,
        lastName,
        contactNumber,
        emailId,
        departmentId,
        userType,
      };

      await axios.put(`http://localhost:8000/users/${userId}`, updatedUser);
      fetchUsers();
      onHide();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 transition-opacity ${
        show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Update User</h3>
          <button onClick={onHide} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>


            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter contact number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter email ID"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">User Type</label>
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md mt-1"
                placeholder="Enter usertype"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onHide}
              className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserModal;
