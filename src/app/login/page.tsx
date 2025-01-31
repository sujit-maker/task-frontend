"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
  
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = "Invalid credentials";
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log("Login Response Data:", data);
  
      // Use the correct key `userId` and convert it to string
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("userId", data.userId.toString());
      localStorage.setItem("userType", data.userType);
  
      toast.success("Successfully logged in!");
  
      setTimeout(() => {
        switch (data.userType) {
          case "HOD":
          case "MANAGER":
          case "EXECUTIVE":
          case "SUPERADMIN":
            router.push("/dashboard"); // Navigate to dashboard for all roles
            break;
          default:
            router.push("/"); // Default fallback
            break;
        }
      }, 1000);
    } catch (error: any) {
      console.error("Login Error:", error.message);
      setErrorMessage(error.message);
      toast.error(error.message || "Invalid credentials");
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>

        {errorMessage && (
          <div className="mb-4 text-red-500 text-center">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={true} />
    </div>
  );
}
