import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, userLogout } from "../API/userApi";
import Modal from "./modal";
import ResetPasswordModal from "./resetPasswordModal";
import { useAuth } from "../Context/AuthContext";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth()

  const confirmLogout = () => {
    setModalOpen(true);
  };

  const cancelLogout = () => {
    setModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      const result = await userLogout();
      await logout();
      if (result.success) {
        toast.success("Logout Successfully!!");
        navigate("/login");
      } else {
        toast.error("Logout Failed!");
      }
    } catch (err) {
      toast.error("Something happened in logout.");
    } finally {
      setModalOpen(false);
    }
  };

  const handleReset = () => {
    setResetPasswordModalOpen(true);
  }

  const handleResetPassword = async (currentPassword, newPassword) => {
    const response = await resetPassword(currentPassword, newPassword);
    try{
    if (response.success) {
      return response; 
    } else {
      
      if (response.errors?.length) {
        response.errors.forEach((error) => toast.error(error));
      } else {
        toast.error(response.message);
      }
      return response;
    }
  } catch (err) {
    console.error("Error in Reset Password: ", err);
    toast.error("Unexpected error occurred.");
    }
  };

  return (
    <header className="bg-indigo-600 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link to="/">PicCloud</Link>
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="text-white hover:text-indigo-300">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/upload" className="text-white hover:text-indigo-300">
                Upload
              </Link>
            </li>
            <li>
              <button
                onClick={handleReset}
                className="text-white hover:text-indigo-300"
              >
                Reset Password
              </button>
            </li>
            <li>
              <button
                onClick={confirmLogout}
                className="text-white hover:text-indigo-300"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isModalOpen && (
        <Modal
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={cancelLogout}
        />
      )}

      {isResetPasswordModalOpen && (
        <ResetPasswordModal
          isOpen={isResetPasswordModalOpen}
          onClose={() => setResetPasswordModalOpen(false)}
          onResetPassword={handleResetPassword}
        />
      )}
    </header>
  );
}
