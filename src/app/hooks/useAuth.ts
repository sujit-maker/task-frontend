import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./authService"; 
import { toast } from "react-toastify";


type UserType = "HOD" | "MANAGER" | "EXECUTIVE" | "SUPERADMIN";

interface LoginResponse {
  access_token: string;
  userType: UserType;
  message: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const setLocalStorage = (key: string, value: string | null) => {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  };

  
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      // Call the loginUser function to authenticate the user
      const { access_token, userType }: LoginResponse = await loginUser(username, password);
  
      // Store the access_token and userType in localStorage
      setLocalStorage("access_token", access_token);
      setLocalStorage("userType", userType);

      // Show success message
      toast.success("Login successful!");
      return true;
    } catch (error: any) {
      toast.error(error.message || "Login failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };
  

  return {
    login,
    loading,
    error,
  };
};
