import React from "react";
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
import "./app.css"; 
import {
  Home,
  User,
  Calendar,
  Settings,
  Settings2,
  TagsIcon,
  PersonStanding,
  Type,
} from "lucide-react";
import { BiBasket, BiCategory, BiHome, BiHomeAlt2, BiHomeHeart } from "react-icons/bi";
import {  GiSettingsKnobs } from "react-icons/gi";

// Menu items.
const items = [
  
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Department",
    url: "/department",
    icon: BiHomeAlt2,
  },
  {
    title: "User Management",
    url: "/users",
    icon: User,
  },
  {
    title: "Category",
    url: "/category",
    icon: BiCategory,
  },
  {
    title: "Product Management",
    url: "/product",
    icon: Calendar,
  },
  {
    title: "Service Management",
    url: "/service",
    icon: Settings,
  },
  {
    title: "Vendor Management",
    url: "/vendor",
    icon: Settings2,
  },
  {
    title: "Customer Management",
    url: "/customer",
    icon: PersonStanding,
  },
  {
    title: "Site Management",
    url: "/site",
    icon: BiBasket,
  },
  
  {
    title: "Task Management",
    url: "/task",
    icon: TagsIcon,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="custom-sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-label" style={{marginTop:"25px"}}>
            Task Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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