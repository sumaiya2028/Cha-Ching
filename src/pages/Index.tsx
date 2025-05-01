
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { FiUser, FiArrowRight, FiPieChart, FiBarChart2, FiTarget } from 'react-icons/fi';
import AnimatedBackground from '@/components/AnimatedBackground';

const IntroHeader = () => (
  <div className="w-full flex flex-col items-center mb-10 relative z-10">
    <div className="floating">
      <div className="text-5xl md:text-7xl font-bold mb-2 neon-text">Cha-Ching</div>
    </div>
    <p className="text-xl md:text-2xl text-gray-300 text-center">
      The smarter way to manage your finances
    </p>
  </div>
);

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string 
}) => (
  <div className="glass p-6 rounded-lg neon-border flex flex-col items-center">
    <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-neon-purple/20 text-neon-purple">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400 text-center">{description}</p>
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
        
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
            <FeatureCard 
              icon={FiPieChart}
              title="Track Expenses"
              description="Visualize your spending patterns with interactive charts and graphs."
            />
            <FeatureCard 
              icon={FiBarChart2}
              title="Budget Planning"
              description="Create budgets and get insights on how to optimize your spending."
            />
            <FeatureCard 
              icon={FiTarget}
              title="Financial Goals"
              description="Set savings goals and track your progress towards achieving them."
            />
          </div>
          
          <div className="glass p-8 rounded-lg w-full max-w-md neon-border">
            <h2 className="text-2xl font-bold mb-6 text-center">Get Started</h2>
            
            <div className="space-y-4">
              <Link to="/login" className="w-full block">
                <Button className="w-full bg-neon-purple hover:bg-neon-purple/80 text-white flex items-center justify-center gap-2">
                  <FiUser className="h-5 w-5" /> 
                  Sign in with Google
                </Button>
              </Link>
              
              <Link to="/signup" className="w-full block">
                <Button variant="outline" className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple/10 flex items-center justify-center gap-2">
                  Connect your account
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
