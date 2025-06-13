import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { FiHome, FiPieChart, FiBarChart2, FiTarget, FiSettings, FiLogOut, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from "@/hooks/useAuth";



const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, setUser } = useAuth(); // Use the user info from AuthContext
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get user's initials for avatar fallback
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';
  };

  const handleLogout = () => {
    // Clear user data on logout
    localStorage.removeItem('userInfo');
    setUser(null); // Clear user info from context
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

  ];

  return (
    <div className="sticky top-0 z-50 bg-gray-900 h-16 px-4 flex items-center justify-between border-b border-gray-800">
      {/* Logo */}
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-md flex items-center justify-center text-white font-bold">
          <img src="/Cha-Ching.png" alt="Logo" className="h-6 w-6 object-contain" />
        </div>
        <span className="ml-2 font-bold text-lg text-white">Cha-Ching</span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center space-x-2">
        {menu.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`text-sm px-2 py-1 h-auto ${activeTab === item.id ? 'bg-neon-purple/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={18} className="mr-1" />
            <span>{item.name}</span>
          </Button>
        ))}
      </div>

      {/* User profile (visible on Desktop) */}
      <div className="hidden md:flex items-center">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-neon-purple text-white text-sm">
            {user?.name ? getInitials(user.name) : <FiUser />}
          </AvatarFallback>
        </Avatar>
        <div className="ml-3 max-w-[100px] lg:max-w-none">
          <div className="font-medium text-white text-sm truncate">{user?.name || "Guest User"}</div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="ml-4 text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <FiLogOut size={18} />
        </Button>
      </div>

      {/* Hamburger Menu Button */}
      <div className="md:hidden flex items-center">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu (Hamburger menu) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-gray-900 text-white py-4 border-l border-gray-800 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation Links */}
            <div className="space-y-2 px-4">
              {menu.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start ${activeTab === item.id ? 'bg-neon-purple/20' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <item.icon size={18} className="mr-2" />
                  <span>{item.name}</span>
                </Button>
              ))}
            </div>

            {/* User Profile and Logout */}
            <div className="mt-6 px-4 py-4 border-t border-gray-800">
              <div className="flex items-center">
                <Avatar>
                  <AvatarImage src={user?.picture || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-neon-purple text-white">
                    {user?.name ? getInitials(user.name) : <FiUser />}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="font-medium text-white">{user?.name || "Guest User"}</div>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 text-gray-400 hover:text-white hover:border-neon-purple"
                onClick={handleLogout}
              >
                <FiLogOut size={18} className="mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
