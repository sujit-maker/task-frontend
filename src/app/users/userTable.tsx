"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import UpdateUserModal from './UpdateUserModal';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  contactNumber: string;
  emailId: string;
  departmentId: number;
  userType: string;
}

interface Department {
  id: number;
  departmentName: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://192.168.29.225:8000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://192.168.29.225:8000/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://192.168.29.225:8000/users/${id}`);
      alert('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (userId: string) => {
    setSelectedUserId(userId);
    setShowUpdateModal(true);
  };

  const getDepartmentName = (id: number) => {
    const department = departments.find((dept) => dept.id === id);
    return department ? department.departmentName : 'Unknown';
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-center table-auto border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3">Username</th>
                <th className="border border-gray-300 p-3">Name</th>
                <th className="border border-gray-300 p-3">Contact</th>
                <th className="border border-gray-300 p-3">Email</th>
                <th className="border border-gray-300 p-3">Department</th>
                <th className="border border-gray-300 p-3">User Type</th>
                <th className="border border-gray-300 p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3">{user.username}</td>
                  <td className="border border-gray-300 p-3">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="border border-gray-300 p-3">{user.contactNumber}</td>
                  <td className="border border-gray-300 p-3">{user.emailId}</td>
                  <td className="border border-gray-300 p-3">
                    {getDepartmentName(user.departmentId)}
                  </td>
                  <td className="border border-gray-300 p-3">{user.userType}</td>
                  <td className="border border-gray-300 p-3">
                    <button
                      onClick={() => handleEdit(user.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <CreateUserModal
        show={isCreateModalOpen}
        onHide={() => setIsCreateModalOpen(false)}
        fetchUsers={fetchUsers}
      />
      {showUpdateModal && (
        <UpdateUserModal
          show={showUpdateModal}
          onHide={() => setShowUpdateModal(false)}
          userId={selectedUserId}
          fetchUsers={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserTable;
