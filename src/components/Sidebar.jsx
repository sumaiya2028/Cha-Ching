
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { 
  FiHome, 
  FiPieChart, 
  FiBarChart2, 
  FiTarget, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronRight
} from 'react-icons/fi';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [userInfo, setUserInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Handle window resize to detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile if not already collapsed
      if (mobile && !collapsed) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);
  
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
    { id: 'goals', name: 'Goals', icon: FiTarget },
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

  // Mobile sidebar toggle
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Desktop sidebar toggle
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Render mobile sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 bg-gray-900/80 border border-gray-800"
          onClick={toggleMobileSidebar}
        >
          {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </Button>
        
        {/* Mobile Sidebar - slide in from left */}
        <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} onClick={toggleMobileSidebar} />
        
        <div className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Logo */}
          <div className="p-4 flex justify-start items-center border-b border-gray-800">
            <div className="h-8 w-8 bg-gradient-to-br from-neon-purple to-neon-magenta rounded-md flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="ml-2 font-bold text-lg neon-text">Cha-Ching</span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 px-2">
            {menu.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start mb-1 ${
                  activeTab === item.id 
                    ? 'bg-neon-purple/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
              >
                <item.icon size={20} className="mr-2" />
                <span>{item.name}</span>
              </Button>
            ))}
          </nav>
          
          {/* User profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="" alt={userInfo?.name || "User"} />
                <AvatarFallback className="bg-neon-purple text-white">
                  {userInfo?.name ? getInitials(userInfo.name) : "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="font-medium">{userInfo?.name || "Guest User"}</div>
                <div className="text-sm text-gray-400 truncate">{userInfo?.phone || ""}</div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start mt-4 text-gray-400 hover:text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <FiLogOut size={20} className="mr-2" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  // Desktop sidebar
  return (
    <div className={`
      ${collapsed ? 'w-16' : 'w-60'} 
      bg-gray-900 h-screen transition-all duration-300 ease-in-out 
      flex flex-col justify-between border-r border-gray-800 relative
      sticky top-0 left-0
    `}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
        onClick={toggleSidebar}
      >
        {collapsed ? <FiChevronRight size={12} /> : <FiX size={12} />}
      </Button>
      
      <div>
        {/* Logo */}
        <div className={`p-4 flex ${collapsed ? 'justify-center' : 'justify-start'} items-center`}>
          <div className="h-8 w-8 bg-gradient-to-br from-neon-purple to-neon-magenta rounded-md flex items-center justify-center text-white font-bold">
            C
          </div>
          {!collapsed && (
            <span className="ml-2 font-bold text-lg neon-text">Cha-Ching</span>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-2">
          {menu.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full mb-1 ${
                activeTab === item.id 
                  ? 'bg-neon-purple/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              } ${collapsed ? 'px-0 justify-center' : 'justify-start'}`}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.name : ''}
            >
              <item.icon size={20} className={collapsed ? 'mx-auto' : 'mr-2'} />
              {!collapsed && <span>{item.name}</span>}
            </Button>
          ))}
        </nav>
      </div>
      
      {/* User profile */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex ${collapsed ? 'flex-col' : 'items-center'}`}>
          <Avatar className={`${collapsed ? 'mx-auto' : ''}`}>
            <AvatarImage src="" alt={userInfo?.name || "User"} />
            <AvatarFallback className="bg-neon-purple text-white">
              {userInfo?.name ? getInitials(userInfo.name) : "U"}
            </AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="font-medium">{userInfo?.name || "Guest User"}</div>
              <div className="text-sm text-gray-400 truncate">{userInfo?.phone || ""}</div>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          className={`w-full mt-4 text-gray-400 hover:text-white hover:bg-gray-800 ${
            collapsed ? 'px-0 justify-center' : 'justify-start'
          }`}
          onClick={handleLogout}
          title={collapsed ? "Log out" : ''}
        >
          <FiLogOut size={20} className={collapsed ? 'mx-auto' : 'mr-2'} />
          {!collapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
