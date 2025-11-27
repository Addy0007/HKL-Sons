// src/customer/components/Navigation/Navigation.jsx

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUser, logout } from "../../../State/Auth/Action";
import { useNavigate } from "react-router-dom";
import { Bars3Icon, ShoppingBagIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import MobileSearchBar from "./MobileSearchBar";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
    setOpen(false);
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
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">

        {/* Mobile Nav Sidebar */}
        <MobileNav
          open={open}
          setOpen={setOpen}
          jwt={jwt}
          user={user}
          isLoading={isLoading}
          handleSignOut={handleSignOut}
          getUserName={getUserName}
          getInitial={getInitial}
          handleCategoryClick={handleCategoryClick}
        />

        {/* Top Promo Banner */}
        <div
          className="h-10 flex items-center justify-center text-white text-sm font-medium"
          style={{ backgroundColor: "#3D8D7A" }}
        >
          Free delivery on orders over ₹1000
        </div>

        {/* Main Navigation */}
        <nav className="bg-[#FFFEC2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Mobile Header */}
            <div className="flex items-center justify-between h-16 lg:hidden">
              {/* Menu Button */}
              <button
                type="button"
                className="p-2 -ml-2 text-gray-700"
                onClick={() => setOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=700"
                  className="h-8 w-auto"
                  alt="HKL Sons"
                />
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="p-2 text-gray-700"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="relative p-2 text-gray-700"
                >
                  <ShoppingBagIcon className="h-6 w-6" />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-teal-700 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar (Collapsible) */}
            {mobileSearchOpen && (
              <div className="lg:hidden pb-3 px-2">
                <MobileSearchBar onSearch={() => setMobileSearchOpen(false)} />
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:h-16 border-b border-gray-200">
              {/* Logo */}
              <div className="cursor-pointer" onClick={() => navigate("/")}>
                <img
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=teal&shade=700"
                  className="h-8 w-auto"
                  alt="HKL Sons"
                />
              </div>

              {/* Desktop Nav */}
              <DesktopNav
                handleCategoryClick={handleCategoryClick}
                getInitial={getInitial}
                getUserName={getUserName}
              />
            </div>

          </div>
        </nav>
      </div>

      {/* SPACER - Prevents content from going under fixed nav */}
      <div className="h-[104px]" />
    </>
  );
}