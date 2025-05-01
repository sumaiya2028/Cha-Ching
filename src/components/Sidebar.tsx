
import React, { useState } from 'react';
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
  FiX
} from 'react-icons/fi';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = () => {
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
  
  return (
    <div className={`${
      collapsed ? 'w-16' : 'w-60'
    } bg-gray-900 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between border-r border-gray-800 relative`}>
      {/* Toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-6 h-6 w-6 rounded-full bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <FiMenu size={12} /> : <FiX size={12} />}
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
              className={`w-full justify-start mb-1 ${
                activeTab === item.id 
                  ? 'bg-neon-purple/20 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              } ${collapsed ? 'px-0 justify-center' : ''}`}
              onClick={() => setActiveTab(item.id)}
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
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback className="bg-neon-purple text-white">JD</AvatarFallback>
          </Avatar>
          
          {!collapsed && (
            <div className="ml-3 flex-1 overflow-hidden">
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-400 truncate">john@example.com</div>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          className={`w-full justify-start mt-4 text-gray-400 hover:text-white hover:bg-gray-800 ${
            collapsed ? 'px-0 justify-center' : ''
          }`}
          onClick={handleLogout}
        >
          <FiLogOut size={20} className={collapsed ? 'mx-auto' : 'mr-2'} />
          {!collapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
