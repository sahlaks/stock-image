import React, { useState } from "react";
import toast from "react-hot-toast";
import { validatePassword } from "../Utils/validation";

const ResetPasswordModal = ({ isOpen, onClose, onResetPassword }) => {
  const [password, setPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    const errors = validatePassword({ password: value });
    setNewPasswordError(errors.password || ""); // Set the error if exists, else clear it
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !newPassword || !confirmPassword) {
      toast.error("Fields cannot be empty.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

     if (newPasswordError) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      setLoading(true);
      const res = await onResetPassword(password, newPassword);
      console.log(res, "rese");

      if (res.success) {
        toast.success("Password reset successfully!");
        onClose();
      }
    } catch (err) {
      toast.error("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ transition: "opacity 0.3s" }}
    >
      <div className="bg-white p-8 rounded-xl w-96 shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Reset Password</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Current Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className={`w-full p-2 border ${
                newPasswordError ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            />
            {newPasswordError && (
              <p className="text-red-500 text-sm mt-1">{newPasswordError}</p>
            )}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`bg-blue-500 text-white p-2 rounded-md ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
