// src/customer/components/Navigation/MobileNav.jsx

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { XMarkIcon, ChevronRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { navigation } from "./NavigationConfig";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function MobileNav({
  open,
  setOpen,
  jwt,
  user,
  isLoading,
  getUserName,
  getInitial,
  handleSignOut,
  handleCategoryClick,
}) {
  const navigate = useNavigate();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex">
        <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-col bg-white shadow-xl">
          
          {/* Header with User Info */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {jwt && user ? (
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 bg-white text-teal-700 rounded-full flex items-center justify-center font-semibold text-lg">
                  {getInitial(user)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base">{getUserName()}</p>
                  <p className="text-teal-100 text-sm">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <UserCircleIcon className="w-12 h-12 text-white" />
                <div>
                  <p className="text-white font-semibold text-base">Welcome!</p>
                  <p className="text-teal-100 text-sm">Sign in to continue</p>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">

            {/* Categories */}
            <div className="py-2">
              {navigation.categories.map((category) => (
                <div key={category.id} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-base font-semibold text-gray-900">
                      {category.name}
                    </span>
                    <ChevronRightIcon 
                      className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                        expandedCategory === category.id ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {/* Expanded Category Items */}
                  {expandedCategory === category.id && (
                    <div className="bg-gray-50 px-6 py-3">
                      {category.sections.map((section) => (
                        <div key={section.id} className="mb-4 last:mb-0">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                            {section.name}
                          </p>
                          <ul className="space-y-2">
                            {section.items.map((item) => (
                              <li key={item.id}>
                                <button
                                  onClick={() => {
                                    handleCategoryClick(
                                      category.id,
                                      section.id,
                                      item.id,
                                      null
                                    );
                                    setOpen(false);
                                    setExpandedCategory(null);
                                  }}
                                  className="text-sm text-gray-700 hover:text-teal-700 hover:translate-x-1 transform transition-all duration-150 block w-full text-left py-1.5"
                                >
                                  {item.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pages */}
            <div className="border-b border-gray-100">
              {navigation.pages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="block px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-700"
                  onClick={() => setOpen(false)}
                >
                  {page.name}
                </a>
              ))}
            </div>

            {/* User Actions */}
            <div className="py-2">
              {jwt ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-700"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/account/order");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-6 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-700"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-6 py-4 text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-6 py-4 space-y-3">
                  <button
                    onClick={() => {
                      navigate("/login");
                      setOpen(false);
                    }}
                    className="w-full py-3 px-4 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition-colors shadow-sm"
                  >
                    Sign In
                  </button>

                  <button
                    onClick={() => {
                      navigate("/signup");
                      setOpen(false);
                    }}
                    className="w-full py-3 px-4 border-2 border-teal-700 text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              )}
            </div>

          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}