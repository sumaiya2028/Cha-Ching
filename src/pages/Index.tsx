import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { FiUser, FiArrowRight, FiPieChart, FiBarChart2, FiTarget } from 'react-icons/fi';
import AnimatedBackground from '@/components/AnimatedBackground';

const IntroHeader = () => (
  <div className="w-full flex flex-col items-center mb-10 relative z-10">
    <div className="floating overflow-visible">
    <div className="text-5xl md:text-7xl font-bold mb-2 neon-text w-full text-center" style={{ lineHeight: '1.3' }}>
  Cha-Ching!
</div>


</div>

    <p className="text-xl md:text-2xl text-gray-300 text-center">
      The smarter way to manage your finances
    </p>
    
  
  
  </div>
);



const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="container px-4 py-16 mx-auto relative z-10">
        <IntroHeader />
        
       
        <div className="flex justify-center">
          <div className="glass p-8 rounded-lg w-full max-w-md neon-border items-center justify-center">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose your preferred mode:</h2>
            
            <div className="space-y-4">
              <Link to="/login" className="w-full block">
                <Button className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center justify-center gap-2">
                  <FiUser className="h-5 w-5" /> 
                  Manual Mode
                </Button>
              </Link>
              
              <Link to="/signup" className="w-full block">
                <Button variant="outline" className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple/10 flex items-center justify-center gap-2">
                   Bank Connection Mode
                  <FiArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              
              <div className="text-center text-sm text-gray-500 mt-6">
                <p>Already have an account? <Link to="/login" className="text-neon-purple hover:underline">Sign in</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
  );
};

export default Index;