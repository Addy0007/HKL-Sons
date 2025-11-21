// src/customer/components/Navigation/MobileNav.jsx

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { navigation } from "./NavigationConfig";
import { useNavigate } from "react-router-dom";

export default function MobileNav({
  open,
  setOpen,
  jwt,
  user,
  isLoading,
  getUserName,
  handleSignOut,
  handleCategoryClick,
}) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
      <DialogBackdrop className="fixed inset-0 bg-black/25" />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel className="relative flex w-full max-w-xs flex-col bg-white overflow-y-auto pb-12 shadow-xl">

          <div className="flex px-4 pt-5 pb-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="-m-2 p-2 text-gray-400"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Category Tabs */}
          <TabGroup className="mt-2">
            <div className="border-b border-gray-200">
              <TabList className="flex space-x-8 px-4">
                {navigation.categories.map((category) => (
                  <Tab
                    key={category.name}
                    className="text-base font-medium px-1 py-4"
                  >
                    {category.name}
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels as="div">
              {navigation.categories.map((category) => (
                <TabPanel key={category.name} className="px-4 pt-10 pb-8">
                  {category.sections.map((section) => (
                    <div key={section.name} className="space-y-6">
                      <p className="font-medium text-gray-900">{section.name}</p>

                      <ul className="space-y-4">
                        {section.items.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() =>
                                handleCategoryClick(
                                  category.id,
                                  section.id,
                                  item.id,
                                  null
                                )
                              }
                              className="text-gray-700 hover:text-teal-700"
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Bottom Divider */}
          <div className="border-t border-gray-200 mt-6 pt-6 px-4">

            {/* Auth Section */}
            {jwt ? (
              isLoading || !user ? (
                <div className="h-12 bg-gray-100 rounded animate-pulse" />
              ) : (
                <>
                  <div className="mb-4">
                    <p className="font-medium">{getUserName()}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="block w-full text-left py-2 font-medium text-gray-700"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate("/account/order");
                      setOpen(false);
                    }}
                    className="block w-full text-left py-2 font-medium text-gray-700"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 font-medium text-red-600"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="block w-full text-left py-2 font-medium"
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setOpen(false);
                  }}
                  className="block w-full text-left py-2 font-medium"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
