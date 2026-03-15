// src/components/Navigation/DesktopNav.jsx

import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

import { useCategories } from "../../../hooks/useCategories";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../State/Auth/Action";

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

export default function DesktopNav({
  handleCategoryClick,
  getInitial,
  getUserName,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const categories = useCategories();

  const { jwt, user, isLoading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="hidden lg:flex lg:items-center lg:w-full">

      <PopoverGroup className="ml-8 flex space-x-8">
        {categories.map((category) => (
          <Popover key={category.slug} className="flex">
            {({ close }) => (
              <>
                <PopoverButton className="group relative flex items-center text-sm font-medium text-[#2C2C2C] hover:text-[#1F3D2B]">
                  {formatLabel(category.name)}
                </PopoverButton>

                {/* Dropdown panel */}
                <PopoverPanel className="absolute inset-x-0 top-full text-sm bg-[#F6F3EC] shadow-lg border-t border-[#C6A15B]/30">
                  <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-3 gap-10">
                    {category.children?.map((section) => (
                      <div key={section.slug}>
                        <p className="font-medium text-[#2C2C2C]">
                          {formatLabel(section.name)}
                        </p>
                        <ul className="mt-4 space-y-3">
                          {section.children?.map((item) => (
                            <li key={item.slug}>
                              <button
                                onClick={() =>
                                  handleCategoryClick(
                                    category.slug,
                                    section.slug,
                                    item.slug,
                                    close
                                  )
                                }
                                className="text-[#3D3D3D] hover:text-[#1F3D2B]"
                              >
                                {formatLabel(item.name)}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </PopoverPanel>
              </>
            )}
          </Popover>
        ))}
      </PopoverGroup>

      <SearchBar />

      <div className="ml-auto flex items-center">
        {jwt ? (
          isLoading || !user ? (
            <div className="w-8 h-8 bg-[#C6A15B]/20 rounded-full animate-pulse" />
          ) : (
            <Menu as="div" className="relative ml-6">
              <MenuButton className="flex items-center gap-2">
                <div
                  className="w-9 h-9 text-white rounded-full flex items-center justify-center font-medium"
                  style={{ backgroundColor: "#1F3D2B" }}
                >
                  {getInitial(user)}
                </div>
                <span className="text-sm text-[#2C2C2C]">{getUserName()}</span>
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-48 bg-[#F6F3EC] shadow-lg rounded-lg p-2 text-sm border border-[#C6A15B]/30">
                <MenuItem>
                  <button
                    onClick={() => navigate("/profile")}
                    className="p-2 w-full text-left hover:bg-[#C6A15B]/10 rounded text-[#2C2C2C]"
                  >
                    My Profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => navigate("/account/order")}
                    className="p-2 w-full text-left hover:bg-[#C6A15B]/10 rounded text-[#2C2C2C]"
                  >
                    My Orders
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleSignOut}
                    className="p-2 w-full text-left text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          )
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm ml-6 font-medium text-[#2C2C2C] hover:text-[#1F3D2B]"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm ml-4 font-medium text-[#2C2C2C] hover:text-[#1F3D2B]"
            >
              Create Account
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/cart")}
          className="group ml-6 flex items-center"
        >
          <ShoppingBagIcon className="w-6 h-6 text-[#C6A15B] group-hover:text-[#a8843d]" />
          <span className="ml-2 text-sm font-medium text-[#2C2C2C]">
            {cartItems?.length || 0}
          </span>
        </button>
      </div>
    </div>
  );
}