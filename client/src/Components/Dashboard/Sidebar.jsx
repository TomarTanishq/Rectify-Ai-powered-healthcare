import axios from 'axios';
import { User, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import React, { useState } from 'react';
import api from '../../api';

const menuItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { icon: <User size={20} />, label: "Patients" }
];

const Sidebar = ({ activePage, setActivePage }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/doctors/logout", {}, {
        withCredentials: true,
      })
      window.location.href = '/'
    } catch (err) {
      console.log("Logout error", err);
    }
  }
  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1B1B1B] text-white rounded-md shadow-lg"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        h-screen fixed z-40
        transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} md:w-40 bg-[#1B1B1B] shadow-lg lg:shadow-none`}>
        <div className="group h-full">
          <ul className="flex flex-col w-full pt-16 lg:pt-4 space-y-2">
            {menuItems.map((item, idx) => (
              <li
                key={idx}
                className={`flex items-center gap-4 px-4 py-3 text-white hover:bg-gray-700 cursor-pointer transition-colors duration-200
                  ${activePage === item.label ? "bg-gray-700 text-white" : "text-white hover:bg-gray-700"}`}
                onClick={() => {
                  setActivePage(item.label)
                  setIsMobileOpen(false)
                }
                }
              >
                <span className="min-w-[20px] flex-shrink-0">{item.icon}</span>
                <span>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          {/* Logout button at the bottom */}
          <div className="mt-auto pb-4 pt-120 md:pt-150">
            <li
              className="flex items-center gap-4 px-4 py-3 text-white hover:bg-red-600 cursor-pointer transition-colors duration-200 border-t border-gray-600"
              onClick={handleLogout}
            >
              <span className="min-w-[20px] flex-shrink-0">
                <LogOut size={20} />
              </span>
              <span>Logout</span>
            </li>
          </div>
          <div>
          </div>
        </div>


      </div>
    </>
  );
};

export default Sidebar;