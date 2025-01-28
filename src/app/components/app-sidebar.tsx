"use client";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  Calendar,
  Settings,
  ChevronDown,
  ChevronUp,
  User2,
} from "lucide-react";
import { BiUserCircle, BiHomeAlt2, BiCategory } from "react-icons/bi";
import "./app.css";

export function AppSidebar() {
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [addressBookOpen, setAddressBookOpen] = useState(false);

  const menuItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Department", url: "/department", icon: BiHomeAlt2 },
    { title: "User Management", url: "/users", icon: User2 },
    { title: "Service Management", url: "/service", icon: Settings },
    { title: "Task Management", url: "/task", icon: Calendar },
  ];

  return (
    <Sidebar className="custom-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-label" style={{ marginTop: "25px" }}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Static Menu Items */}
              {menuItems.slice(0, 3).map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar-item">
                  <SidebarMenuButton asChild className="sidebar-button">
                    <a href={item.url} className="sidebar-link">
                      <item.icon className="sidebar-icon" />
                      <span className="sidebar-text">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Inventory Dropdown */}
              <SidebarMenuItem className="sidebar-item dropdown-item">
                <SidebarMenuButton
                  onClick={() => setInventoryOpen(!inventoryOpen)}
                  className="sidebar-button"
                >
                  <BiCategory className="sidebar-icon" />
                  <span className="sidebar-text">Inventory</span>
                  <span className="dropdown-toggle-icon">
                    {inventoryOpen ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </SidebarMenuButton>
                {inventoryOpen && (
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a href="/category" className="dropdown-link">
                        Product Category
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="/product" className="dropdown-link">
                        Product SKU
                      </a>
                    </li>
                  </ul>
                )}
              </SidebarMenuItem>

              {/* Address Book Dropdown */}
              <SidebarMenuItem className="sidebar-item dropdown-item">
                <SidebarMenuButton
                  onClick={() => setAddressBookOpen(!addressBookOpen)}
                  className="sidebar-button"
                >
                  <BiUserCircle className="sidebar-icon" />
                  <span className="sidebar-text">Address Book</span>
                  <span className="dropdown-toggle-icon">
                    {addressBookOpen ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </SidebarMenuButton>
                {addressBookOpen && (
                  <ul className="dropdown-menu">
                    <li className="dropdown-item">
                      <a href="/vendor" className="dropdown-link">
                        Vendors
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="/customer" className="dropdown-link">
                        Customers
                      </a>
                    </li>
                    <li className="dropdown-item">
                      <a href="/site" className="dropdown-link">
                        Sites
                      </a>
                    </li>
                  </ul>
                )}
              </SidebarMenuItem>

              {/* Task Management */}
              {menuItems.slice(3).map((item) => (
                <SidebarMenuItem key={item.title} className="sidebar-item">
                  <SidebarMenuButton asChild className="sidebar-button">
                    <a href={item.url} className="sidebar-link">
                      <item.icon className="sidebar-icon" />
                      <span className="sidebar-text">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
