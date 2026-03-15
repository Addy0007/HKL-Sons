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
        <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-col bg-[#F6F3EC] shadow-xl">

          {/* Header */}
          <div
            className="px-6 py-6"
            style={{ background: "linear-gradient(to right, #162d1f, #1F3D2B)" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {jwt && user ? (
              <div className="flex items-center gap-3 mt-2">
                <div className="w-12 h-12 bg-[#F6F3EC] text-[#1F3D2B] rounded-full flex items-center justify-center font-semibold text-lg">
                  {getInitial(user)}
                </div>
                <div>
                  <p className="text-white font-semibold">{getUserName()}</p>
                  <p className="text-[#D8C7A3] text-sm">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <UserCircleIcon className="w-12 h-12 text-white" />
                <div>
                  <p className="text-white font-semibold">Welcome!</p>
                  <p className="text-[#D8C7A3] text-sm">Sign in to continue</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">

            <div className="py-2">
              {categories.map((category) => (
                <div key={category.slug} className="border-b border-[#C6A15B]/20">
                  <button
                    onClick={() => toggleCategory(category.slug)}
                    className="flex items-center justify-between w-full px-6 py-4 text-left hover:bg-[#C6A15B]/10"
                  >
                    <span className="text-base font-semibold text-[#2C2C2C]">
                      {formatLabel(category.name)}
                    </span>
                    <ChevronRightIcon
                      className={`h-5 w-5 text-[#C6A15B] transition-transform ${
                        expandedCategory === category.slug ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {expandedCategory === category.slug && (
                    <div className="bg-[#EDE9E0] px-6 py-3">
                      {category.children?.map((section) => (
                        <div key={section.slug} className="mb-4">
                          <p className="text-xs font-semibold text-[#C6A15B] uppercase mb-2">
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
                                  className="text-sm text-[#3D3D3D] hover:text-[#1F3D2B] block w-full text-left py-1.5"
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
                  className="block w-full text-left px-6 py-4 hover:bg-[#C6A15B]/10 text-[#2C2C2C] border-b border-[#C6A15B]/20"
                >
                  My Profile
                </button>

                <button
                  onClick={() => { navigate("/account/order"); setOpen(false); }}
                  className="block w-full text-left px-6 py-4 hover:bg-[#C6A15B]/10 text-[#2C2C2C] border-b border-[#C6A15B]/20"
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
                  className="w-full py-3 text-white rounded-lg font-medium hover:opacity-90 transition"
                  style={{ backgroundColor: "#1F3D2B" }}
                >
                  Sign In
                </button>

                <button
                  onClick={() => { navigate("/signup"); setOpen(false); }}
                  className="w-full py-3 border-2 border-[#C6A15B] text-[#C6A15B] rounded-lg font-medium hover:bg-[#C6A15B]/10 transition"
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