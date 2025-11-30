import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function AdminRoute({ children }) {
  const location = useLocation();
  const { jwt, user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("🔐 AdminRoute Check:");
    console.log("   JWT exists:", !!jwt);
    console.log("   User:", user);
    console.log("   User Role:", user?.role);
    console.log("   Is Loading:", isLoading);
    console.log("   Current Path:", location.pathname);
  }, [jwt, user, isLoading, location]);

  // Show loading spinner while fetching user
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!jwt || !user) {
    console.log("❌ No authentication - redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if user has admin role
  const userRole = user.role || "";
  const isAdmin = 
    userRole === "ROLE_ADMIN" || 
    userRole === "ADMIN";

  console.log("   Is Admin:", isAdmin);

  if (!isAdmin) {
    console.log("❌ User is not admin - showing access denied");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h2>
          
          <p className="text-gray-600 mb-2">
            You need administrator privileges to access this page.
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Current role: <span className="font-mono font-semibold">{userRole || "None"}</span>
          </p>
          
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Go to Home
            </a>
            
            <button
              onClick={() => {
                localStorage.removeItem("jwt");
                window.location.href = "/login";
              }}
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Login as Different User
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log("✅ Admin access granted");
  return children;
}
