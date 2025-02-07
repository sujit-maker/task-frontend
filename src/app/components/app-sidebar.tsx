"use client";
import React, { useEffect, useState } from "react";
import {
  BiUserCircle,
  BiCategory,
  BiStoreAlt,
  BiTask,
  BiSolidDashboard,
} from "react-icons/bi";
import { ChevronDown, ChevronUp, Menu, Settings, X, LogOut } from "lucide-react";
import { FaRegAddressBook } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

  export function AppSidebar() {
  const { userType } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [addressBookOpen, setAddressBookOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Define menu items
  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: BiSolidDashboard },
    { title: "Department", url: "/department", icon: BiStoreAlt },
    ...(userType === "SUPERADMIN"
      ? [{ title: "User Management", url: "/users", icon: BiUserCircle }]
      : []),
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 shadow-lg w-full fixed top-0 left-0 z-50">
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-blue-300 transition-all transform duration-300"
          aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex items-center">
       
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full bg-gradient-to-b from-indigo-800 to-blue-900 text-white transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-16"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}
      >
        <div className="flex items-center justify-between px-4 py-4 bg-indigo-900">
          <button
            onClick={toggleSidebar}
            className="text-white md:hidden flex hover:text-gray-300 transition-all"
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Items */}
        <div
          className="overflow-y-auto pt-8 transition-all duration-300"
          onMouseEnter={() => !isMobile && setIsSidebarOpen(true)}
          onMouseLeave={() => !isMobile && setIsSidebarOpen(false)}
        >
          <ul className="space-y-2 mt-9">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.url}
                  className="flex items-center px-4 py-2 hover:bg-indigo-700 hover:scale-105 rounded-lg transition-all duration-300 ease-in-out"
                  aria-label={item.title}
                >
                  <item.icon className="w-6 h-6 transition-all duration-300 ease-in-out hover:text-blue-400" />
                  {isSidebarOpen && (
                    <span className="ml-4 transition-all duration-300">{item.title}</span>
                  )}
                </a>
              </li>
            ))}

            {/* Address Book Dropdown */}
            <li>
              <button
                onClick={() => setAddressBookOpen(!addressBookOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-indigo-700 rounded-lg transition-all"
                aria-expanded={addressBookOpen ? "true" : "false"}
                aria-controls="address-book-dropdown"
              >
                <div className="flex items-center">
                  <FaRegAddressBook className="w-6 h-6 transition-all duration-300 ease-in-out hover:text-blue-400" />
                  {isSidebarOpen && <span className="ml-4">Address Book</span>}
                </div>
                <span>
                  {addressBookOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>
              {addressBookOpen && (
                <ul id="address-book-dropdown" className="pl-8 mt-1 space-y-1 text-gray-400">
                  <li>
                    <a
                      href="/vendor"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Vendors"
                    >
                      Vendors
                    </a>
                  </li>
                  <li>
                    <a
                      href="/customer"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Customers"
                    >
                      Customers
                    </a>
                  </li>
                  <li>
                    <a
                      href="/site"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Customer Sites"
                    >
                      Customer Sites
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Service Management Dropdown */}
            <li>
              <button
                onClick={() => setServiceOpen(!serviceOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-indigo-700 rounded-lg transition-all"
                aria-expanded={serviceOpen ? "true" : "false"}
                aria-controls="service-dropdown"
              >
                <div className="flex items-center">
                  <Settings className="w-6 h-6 transition-all duration-300 ease-in-out hover:text-blue-400" />
                  {isSidebarOpen && <span className="ml-4">Service Management</span>}
                </div>
                <span>
                  {serviceOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>
              {serviceOpen && (
                <ul id="service-dropdown" className="pl-8 mt-1 space-y-1 text-gray-400">
                  <li>
                    <a
                      href="/category"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Service Category"
                    >
                      Add Category
                    </a>
                  </li>
                  <li>
                    <a
                      href="/subCategory"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Service SubCategory"
                    >
                      Add SubCategory
                    </a>
                  </li>
                  <li>
                    <a
                      href="/service"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Service Management"
                    >
                      Service SKU
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Inventory Dropdown */}
            <li>
              <button
                onClick={() => setInventoryOpen(!inventoryOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-indigo-700 rounded-lg transition-all"
                aria-expanded={inventoryOpen ? "true" : "false"}
                aria-controls="inventory-dropdown"
              >
                <div className="flex items-center">
                  <BiCategory className="w-6 h-6 transition-all duration-300 ease-in-out hover:text-blue-400" />
                  {isSidebarOpen && <span className="ml-4">Inventory Management</span>}
                </div>
                <span>
                  {inventoryOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>
              {inventoryOpen && (
                <ul id="inventory-dropdown" className="pl-8 mt-1 space-y-1 text-gray-400">
                  <li>
                    <a
                      href="/category"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Product Category"
                    >
                      Add Category
                    </a>
                  </li>
                  <li>
                    <a
                      href="/subCategory"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Product SubCategory"
                    >
                      Add SubCategory
                    </a>
                  </li>
                  <li>
                    <a
                      href="/product"
                      className="block px-2 py-1 hover:bg-indigo-700 hover:text-white rounded transition-all duration-300"
                      aria-label="Product SKU"
                    >
                      Product SKU
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* Task Management */}
            <li>
              <a
                href="/task"
                className="flex items-center px-4 py-2 hover:bg-indigo-700 rounded-lg transition-all duration-300"
                aria-label="Task Management"
              >
                <BiTask className="w-6 h-6 transition-all duration-300 ease-in-out hover:text-blue-400" />
                {isSidebarOpen && <span className="ml-4 transition-all">{'Task Management'}</span>}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
