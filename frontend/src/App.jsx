import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signup from "./Pages/SignUp";
import Login from "./Pages/Login";
import { useEffect } from "react";
import VerifyEmail from "./Pages/Verify-Email";
import ProfileFetcher from "./Pages/ProfileFetcher";
import ForgotPassword from "./Pages/ForgotPassword";
import EnterUserNameToChat from "./Pages/EnterUserNameToChat";
import ChatPage from "./Pages/ChatPage";
import MenuPage from "./Pages/MenuPage";
import AllUser from "./Pages/AllUser";
import { userStore } from "./store/UserStore";
import LoadingSpinner from "./components/LoadingSpinner"; // Create this component
import axios from "axios";

// Protected Route Component
const ProtectedRoute = ({ children }) => { 
  const { isAuthenticate, isCheckingAuth } = userStore();
  
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticate ? children : <Navigate to="/" replace />;
};

// Public Route Component (for routes that shouldn't be accessible when authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticate, isCheckingAuth } = userStore();
  
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticate ? children : <Navigate to="/" replace />;
};

const appRouter = createBrowserRouter([
  {
    path: "/ProfileFetcher",
    element: <ProtectedRoute><ProfileFetcher /></ProtectedRoute>, // Example protected route
  },
  { 
    path: "/signup", 
    element: <PublicRoute><Signup /></PublicRoute> 
  },
  { 
    path: "/login", 
    element: <PublicRoute><Login /></PublicRoute> 
  },
  { 
    path: "/VerifyEmail", 
    element: <PublicRoute><VerifyEmail /></PublicRoute> 
  },
  { 
    path: "/ProfileFetcher", 
    element: <ProtectedRoute><ProfileFetcher /></ProtectedRoute> 
  },
  {
    path: "/EnterUserNameToChat",
    element: <ProtectedRoute><EnterUserNameToChat /></ProtectedRoute>
  },
  {
    path: "/ChatPage",
    element: <ProtectedRoute><ChatPage /></ProtectedRoute>
  },
  {
    path: "/",
    element: <MenuPage />
  },
  {
    path: "/AllUser",
    element: <ProtectedRoute><AllUser /></ProtectedRoute>
  },
  { 
    path: "/ForgotPassword", 
    element: <PublicRoute><ForgotPassword /></PublicRoute> 
  },
]);

function App() {
  const { setIsCheckingAuth } = userStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        // Make an API call to verify the authentication status
        const res = await axios.get("/api/v1/user/check-auth", {
          withCredentials: true
        });
        
        if (res.data.authenticated) {
          userStore.getState().setUser(res.data.user);
          userStore.getState().setIsAuthenticate(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        userStore.getState().setIsAuthenticate(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <main>
      <RouterProvider router={appRouter} />
    </main>
  );
}

export default App;