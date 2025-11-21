// src/components/Navigation/DesktopNav.jsx

import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import { navigation } from "./NavigationConfig";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../State/Auth/Action";

export default function DesktopNav({ handleCategoryClick, getInitial, getUserName }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { jwt, user, isLoading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="hidden lg:flex lg:items-center lg:w-full">

      <PopoverGroup className="ml-8 flex space-x-8">
        {navigation.categories.map((category) => (
          <Popover key={category.name} className="flex">
            {({ close }) => (
              <>
                <div className="relative flex">
                  <PopoverButton className="group relative flex items-center text-sm font-medium text-gray-700 hover:text-teal-700">
                    {category.name}
                  </PopoverButton>
                </div>

                <PopoverPanel className="absolute inset-x-0 top-full text-sm bg-[#FFFEC2] shadow-lg">
                  <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-3 gap-10">

                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p className="font-medium text-gray-900">{section.name}</p>

                        <ul className="mt-4 space-y-3">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              <button
                                onClick={() =>
                                  handleCategoryClick(
                                    category.id,
                                    section.id,
                                    item.id,
                                    close
                                  )
                                }
                                className="text-gray-600 hover:text-teal-700"
                              >
                                {item.name}
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

        {navigation.pages.map((page) => (
          <a
            key={page.name}
            href={page.href}
            className="text-sm font-medium text-gray-700 hover:text-teal-700"
          >
            {page.name}
          </a>
        ))}
      </PopoverGroup>

      <SearchBar />

      <div className="ml-auto flex items-center">

        {/* User menu */}
        {jwt ? (
          isLoading || !user ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : (
            <Menu as="div" className="relative ml-6">
              <MenuButton className="flex items-center gap-2">
                <div
                  className="w-9 h-9 bg-teal-700 text-white rounded-full flex items-center justify-center"
                >
                  {getInitial(user)}
                </div>
                <span className="text-sm">{getUserName()}</span>
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 text-sm">
                <MenuItem>
                  <button
                    onClick={() => navigate("/profile")}
                    className="p-2 w-full text-left hover:bg-gray-100"
                  >
                    My Profile
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => navigate("/account/order")}
                    className="p-2 w-full text-left hover:bg-gray-100"
                  >
                    My Orders
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleSignOut}
                    className="p-2 w-full text-left text-red-600 hover:bg-red-50"
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
              className="text-sm ml-6 font-medium text-gray-700 hover:text-teal-700"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-sm ml-4 font-medium text-gray-700 hover:text-teal-700"
            >
              Create Account
            </button>
          </>
        )}

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="group ml-6 flex items-center"
        >
          <ShoppingBagIcon className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
          <span className="ml-2 text-sm font-medium">
            {cartItems?.length || 0}
          </span>
        </button>
      </div>

    </div>
  );
}
