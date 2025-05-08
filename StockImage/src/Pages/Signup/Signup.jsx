import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LockIcon, ImageIcon, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { userSignup } from "../../API/userApi";
import { validateEmail, validatePassword, validatePhone } from "../../Utils/validation";

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

export default function SignUpPage() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    mobile: "",
    password: "",
    confirmpassword: "",
  });

  
  const [error, setError] = useState({
    email: "",
    mobile: "",
    password: "",
    confirmpassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSigninRedirect = () => {
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
    

    let errorMessage = '';
    if (name === 'email') {
      errorMessage = validateEmail(value);
    } else if (name === 'mobile') {
      errorMessage = validatePhone(value);
    } else if (name === 'password') {
      errorMessage = validatePassword({ password: value })?.password || '';
    } else if (name === "confirmpassword") {
      errorMessage =
        value !== userDetails.password
          ? "Passwords do not match"
          : "";
    }

    setError((prevError) => ({
      ...prevError,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const emailError = validateEmail(userDetails.email);
    const phoneError = validatePhone(userDetails.mobile);
    const passwordError = validatePassword({ password: userDetails.password })?.password || '';
    const confirmPasswordError =
      userDetails.confirmpassword !== userDetails.password
        ? "Passwords do not match"
        : "";

    const newError = {
      email: emailError,
      mobile: phoneError,
      password: passwordError,
      confirmpassword: confirmPasswordError,
    };
  
    setError(newError);
   console.log('err',error);
   
    const hasErrors = Object.values(newError).some((err) => err !== "");
    if (hasErrors) {
      setIsLoading(false);
      return;
    }
  
    try {
      const result = await userSignup(userDetails);
      console.log("Signup result:", result);
      if(result.success){
        toast.success("Signup successful!");
        navigate("/");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
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
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
    {/* Email Input */}
    <div>
      <Label htmlFor="email" className="sr-only">
        Email address
      </Label>
      <Input
        id="email"
        type="email"
        name="email"
        placeholder="Email address"
        value={userDetails.email}
        onChange={handleChange}
      />
      {error.email && <span className="text-red-500">{error.email}</span>}
    </div>

    {/* Mobile Input */}
    <div>
      <Label htmlFor="mobile" className="sr-only">
        Mobile number
      </Label>
      <Input
        id="mobile"
        type="tel"
        name="mobile"
        placeholder="Mobile number"
        value={userDetails.mobile}
        onChange={handleChange}
      />
      {error.mobile && <span className="text-red-500">{error.mobile}</span>}
    </div>

    {/* Password Input */}
    <div>
      <Label htmlFor="password" className="sr-only">
        Password
      </Label>
      <Input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        value={userDetails.password}
        onChange={handleChange}
      />
      {error.password && <span className="text-red-500">{error.password}</span>}
    </div>
    <div>
      <Label htmlFor="password" className="sr-only">
        Confirm Password
      </Label>
      <Input
        id="confirmpassword"
        type="password"
        name="confirmpassword"
        placeholder="Confirm Password"
        value={userDetails.confirmpassword}
        onChange={handleChange}
      />
      {error.confirmpassword && <span className="text-red-500">{error.confirmpassword}</span>}
    </div>
  </div>
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
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </form>
        <Button
          onClick={handleSigninRedirect}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <Key className="h-5 w-5 mr-2" />
          Already have an account
        </Button>
      </motion.div>
    </div>
  );
}
