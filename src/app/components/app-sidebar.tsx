"use client";
import React, { useState } from "react";
import {
  BiUserCircle,
  BiHomeAlt2,
  BiCategory,
  BiStoreAlt,
  BiTask,
} from "react-icons/bi";
import { ChevronDown, ChevronUp, Menu, Settings, X } from "lucide-react";
import { FaRegAddressBook, FaServicestack } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";

export function AppSidebar() {
  const { userType } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [addressBookOpen, setAddressBookOpen] = useState(false);

  // Define menu items
  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: BiHomeAlt2 },
    { title: "Department", url: "/department", icon: BiStoreAlt },
    ...(userType === "SUPERADMIN"
      ? [{ title: "User Management", url: "/users", icon: BiUserCircle }]
      : []),
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-full bg-gray-800 text-white transition-transform duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:block`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
          <button
            onClick={toggleSidebar}
            className="text-white md:hidden flex hover:text-gray-300"
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Items */}
        <ul className="mt-10 space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.url}
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg"
                aria-label={item.title}
              >
                <item.icon className="w-6 h-6 hover:text-gray-400" />
                {isSidebarOpen && <span className="ml-4">{item.title}</span>}
              </a>
            </li>
          ))}

          {/* Address Book Dropdown (Moved After User Management) */}
          <li>
            <button
              onClick={() => setAddressBookOpen(!addressBookOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg"
              aria-expanded={addressBookOpen ? "true" : "false"}
              aria-controls="address-book-dropdown"
            >
              <div className="flex items-center">
                <FaRegAddressBook className="w-6 h-6 hover:text-gray-400" />
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
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
                    aria-label="Vendors"
                  >
                    Vendors
                  </a>
                </li>
                <li>
                  <a
                    href="/customer"
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
                    aria-label="Customers"
                  >
                    Customers
                  </a>
                </li>
                <li>
                  <a
                    href="/site"
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
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
              className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg"
              aria-expanded={serviceOpen ? "true" : "false"}
              aria-controls="service-dropdown"
            >
              <div className="flex items-center">
                <Settings className="w-6 h-6 hover:text-gray-400" />
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
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
                    aria-label="Service Category"
                  >
                    Add Category
                  </a>
                </li>
                <li>
                  <a
                    href="/subCategory"
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
                    aria-label="Service SubCategory"
                  >
                    Add SubCategory
                  </a>
                </li>
                <li>
                  <a
                    href="/service"
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
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
              className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-700 rounded-lg"
              aria-expanded={inventoryOpen ? "true" : "false"}
              aria-controls="inventory-dropdown"
            >
              <div className="flex items-center">
                <BiCategory className="w-6 h-6 hover:text-gray-400" />
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
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
                    aria-label="Product Category"
                  >
                    Add Category
                  </a>
                </li>
                <li>
                  <a
                    href="/subCategory"
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
                    aria-label="Product SubCategory"
                  >
                    Add SubCategory
                  </a>
                </li>
                <li>
                  <a
                    href="/product"
                    className="block px-2 py-1 hover:bg-gray-700 hover:text-white rounded"
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
              className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-lg"
              aria-label="Task Management"
            >
              <BiTask className="w-6 h-6 hover:text-gray-400" />
              {isSidebarOpen && <span className="ml-4">Task Management</span>}
            </a>
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1">
        {/* Sidebar Toggle for small screens */}
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            aria-label={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}