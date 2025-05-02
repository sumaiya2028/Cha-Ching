import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { FiHome, FiPieChart, FiBarChart2, FiTarget, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        const parsedInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedInfo);
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }
  }, []);
  
  const handleLogout = () => {
    // Clear user data on logout
    localStorage.removeItem('userInfo');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };
  
  const menu = [
    { id: 'overview', name: 'Overview', icon: FiHome },
    { id: 'transactions', name: 'Transactions', icon: FiPieChart },
    { id: 'budgets', name: 'Budgets', icon: FiBarChart2 },
    { id: 'goals', name: 'Financial Goals', icon: FiTarget },
    { id: 'settings', name: 'Settings', icon: FiSettings },
  ];
  
  // Get user's initials for avatar fallback
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="bg-gray-900 h-16 px-4 flex items-center justify-between border-b border-gray-800 relative">
      {/* Logo */}
      <div className="flex items-center">
        <div className="h-8 w-8 bg-gradient-to-br from-neon-purple to-neon-magenta rounded-md flex items-center justify-center text-white font-bold">
          C
        </div>
        <span className="ml-2 font-bold text-lg text-white">Cha-Ching</span>
      </div>
      
      {/* Hamburger Menu Button */}
      <div className="md:hidden flex items-center absolute right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </Button>
      </div>
      
      {/* Mobile Menu (Hamburger menu) */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-900 text-white p-4 border-t border-gray-800 md:hidden">
          <div className="flex items-center justify-between mb-6">
            {/* Logo in Mobile Menu */}
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-br from-neon-purple to-neon-magenta rounded-md flex items-center justify-center text-white font-bold">
                C
              </div>
              <span className="ml-2 font-bold text-lg text-white">Cha-Ching</span>
            </div>
            {/* Close Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <FiX size={20} />
            </Button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-4">
            {menu.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full text-left py-2 ${activeTab === item.id ? 'bg-neon-purple/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false); // Close menu after selection
                }}
              >
                <item.icon size={20} className="mr-2" />
                <span>{item.name}</span>
              </Button>
            ))}
          </div>

          {/* User Profile and Logout */}
          <div className="mt-6 flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="" alt={userInfo?.name || "User"} />
              <AvatarFallback className="bg-neon-purple text-white">
                {userInfo?.name ? getInitials(userInfo.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium text-white">{userInfo?.name || "Guest User"}</div>
            </div>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <FiLogOut size={20} />
            </Button>
          </div>
        </div>
      )}
      
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-4">
        {menu.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`text-white ${activeTab === item.id ? 'bg-neon-purple/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={20} className="mr-2" />
            <span>{item.name}</span>
          </Button>
        ))}
      </div>
      
      {/* User profile (visible on Desktop) */}
      <div className="hidden md:flex items-center">
        <Avatar>
          <AvatarImage src="" alt={userInfo?.name || "User"} />
          <AvatarFallback className="bg-neon-purple text-white">
            {userInfo?.name ? getInitials(userInfo.name) : "U"}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3">
          <div className="font-medium text-white">{userInfo?.name || "Guest User"}</div>
        </div>
        <Button
          variant="ghost"
          className="ml-4 text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
