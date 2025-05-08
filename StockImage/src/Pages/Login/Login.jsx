import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LockIcon, ImageIcon, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userLogin } from "../../API/userApi";
import { useAuth } from "../../Context/AuthContext";

const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const Button = React.forwardRef(({ className, ...props }, ref) => (
  <button
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
    ref={ref}
    {...props}
  />
));

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default function LoginPage() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignupRedirect = () => {
    navigate("/signup");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });

    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    // Validate email
    if (!userDetails.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(userDetails.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate password
    if (!userDetails.password) {
      newErrors.password = "Password is required";
    }

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
      setError(newErrors);
      return;
    }

    setIsLoading(true);

    if (
      userDetails.email === "user@example.com" &&
      userDetails.password === "password"
    ) {
      toast.success("Test user in!");
      login({ email: userDetails.email });
      navigate("/");
    } else {
      try {
        const result = await userLogin(userDetails);
        if (result.success) {
          toast.success("Login successful!");
          login(result.data);
          navigate("/");
        }
      } catch (error) {
        const serverMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Something went wrong. Please try again.";
        toast.error(serverMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl"
      >
        <div>
          <ImageIcon className="mx-auto h-12 w-auto text-indigo-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to PicCloud
          </h2>
          <p className="mt-2 text-center text-md font-bold">
            Sign in to your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="sr-only">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                value={userDetails.email}
                onChange={handleInputChange}
              />
              {error.email && (
                <span className="text-red-500 text-sm">{error.email}</span>
              )}
            </div>
            <div>
              <Label htmlFor="password" className="sr-only">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={userDetails.password}
                onChange={handleInputChange}
              />
              {error.password && (
                <span className="text-red-500 text-sm">{error.password}</span>
              )}
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>

        <div className="mt-6 flex flex-col space-y-4">
          <Button
            onClick={handleSignupRedirect}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Sign up
          </Button>
          {/* <Button
            onClick={handleTestCredentials}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Test Credentials
          </Button> */}
        </div>
      </motion.div>
    </div>
  );
}
