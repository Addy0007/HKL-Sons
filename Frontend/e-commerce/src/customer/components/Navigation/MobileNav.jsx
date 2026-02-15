// src/customer/components/Navigation/MobileNav.jsx

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { XMarkIcon, ChevronRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useCategories } from "../../../hooks/useCategories";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/* ✅ Format for UI only */
const formatLabel = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/-/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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
  const categories = useCategories();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (slug) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex">
        <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-col bg-white shadow-xl">

          <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-6 py-6">
            <button
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
                <div>
                  <p className="text-white font-semibold">{getUserName()}</p>
                  <p className="text-teal-100 text-sm">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <UserCircleIcon className="w-12 h-12 text-white" />
                <div>
                  <p className="text-white font-semibold">Welcome!</p>
                  <p className="text-teal-100 text-sm">Sign in to continue</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">

            <div className="py-2">
              {categories.map((category) => (
                <div key={category.slug} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleCategory(category.slug)}
                    className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-gray-50"
                  >
                    <span className="text-base font-semibold text-gray-900">
                      {formatLabel(category.name)}
                    </span>
                    <ChevronRightIcon
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expandedCategory === category.slug ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {expandedCategory === category.slug && (
                    <div className="bg-gray-50 px-6 py-3">
                      {category.children?.map((section) => (
                        <div key={section.slug} className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            {formatLabel(section.name)}
                          </p>
                          <ul className="space-y-2">
                            {section.children?.map((item) => (
                              <li key={item.slug}>
                                <button
                                  onClick={() => {
                                    handleCategoryClick(
                                      category.slug,
                                      section.slug,
                                      item.slug,
                                      null
                                    );
                                    setOpen(false);
                                    setExpandedCategory(null);
                                  }}
                                  className="text-sm text-gray-700 hover:text-teal-700 block w-full text-left py-1.5"
                                >
                                  {formatLabel(item.name)}
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

            {jwt ? (
              <>
                <button
                  onClick={() => { navigate("/profile"); setOpen(false); }}
                  className="block w-full text-left px-6 py-4 hover:bg-gray-50"
                >
                  My Profile
                </button>

                <button
                  onClick={() => { navigate("/account/order"); setOpen(false); }}
                  className="block w-full text-left px-6 py-4 hover:bg-gray-50"
                >
                  My Orders
                </button>

                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-6 py-4 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="px-6 py-4 space-y-3">
                <button
                  onClick={() => { navigate("/login"); setOpen(false); }}
                  className="w-full py-3 bg-teal-700 text-white rounded-lg"
                >
                  Sign In
                </button>

                <button
                  onClick={() => { navigate("/signup"); setOpen(false); }}
                  className="w-full py-3 border-2 border-teal-700 text-teal-700 rounded-lg"
                >
                  Create Account
                </button>
              </div>
            )}

          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
