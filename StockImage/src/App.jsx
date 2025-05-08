import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import ImageUploadPage from "./Pages/ImageUpload/ImageUpload";
import LoginPage from "./Pages/Login/Login";
import SignUpPage from "./Pages/Signup/Signup";
import NotFoundPage from "./ErrorPages/NotFound";
import { useAuth } from "./Context/AuthContext";

const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};
function App() {
  return (
    <>
        <Routes>
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <LoginPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/" element={<ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>} />
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <SignUpPage />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/upload" element={<ProtectedRoute>
              <ImageUploadPage />
            </ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </>
  );
}

export default App;
