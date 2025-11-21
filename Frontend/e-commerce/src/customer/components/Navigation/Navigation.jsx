// src/customer/components/Navigation/Navigation.jsx

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, logout } from "../../../State/Auth/Action";
import { useNavigate } from "react-router-dom";

import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { jwt, user, isLoading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Load user profile if jwt exists
  useEffect(() => {
    if (jwt && !user && !isLoading) {
      dispatch(getUser(jwt));
    }
  }, [jwt, user, isLoading, dispatch]);

  const handleCategoryClick = (categoryId, sectionId, itemId, close) => {
    const url = `/${categoryId}/${sectionId}/${itemId}`;

    if (close) close();
    setOpen(false);

    navigate(url);
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const getInitial = (user) =>
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  const getUserName = () => {
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#FFFEC2]">

      {/* Mobile Nav */}
      <MobileNav
        open={open}
        setOpen={setOpen}
        jwt={jwt}
        user={user}
        isLoading={isLoading}
        handleSignOut={handleSignOut}
        getUserName={getUserName}
        handleCategoryClick={handleCategoryClick}
      />

      {/* Sticky Header */}
      <header className="bg-white">
        <p
          className="h-10 flex items-center justify-center text-white text-sm"
          style={{ backgroundColor: "#3D8D7A" }}
        >
          Free delivery on orders over ₹1000
        </p>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 border-b border-gray-200">

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden text-gray-500 mr-4"
              onClick={() => setOpen(true)}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo */}
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=700"
                className="h-8 w-auto"
                alt="HKL Sons"
              />
            </div>

            {/* Desktop Navigation */}
            <DesktopNav
              handleCategoryClick={handleCategoryClick}
              getInitial={getInitial}
              getUserName={getUserName}
            />

          </div>
        </nav>
      </header>
    </div>
  );
}
