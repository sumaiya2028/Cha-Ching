import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiUser, FiPieChart, FiBarChart2, FiTarget } from 'react-icons/fi';

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


const Feature = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div className="bg-blue-600 p-3 rounded-full text-white mb-3">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm max-w-xs">{description}</p>
  </div>
);

const AboutSection = () => (
  <div className="w-full py-16 px-4 text-center z-10 relative">
    <h2 className="text-3xl font-bold text-white mb-6">How It Works</h2>
    <p className="text-gray-300 max-w-2xl mx-auto mb-12">
      Cha-Ching! simplifies personal finance with two smart modes:
    </p>
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <FeatureCard 
                      icon={FiPieChart}
                      title="Manual Mode"
                      description="Track and log your expenses, set budgets, and visualize financial goals manually for complete control."
                    />
     
     <FeatureCard 
                      icon={FiBarChart2}
                      title="Smart Mode"
                      description="Connect your bank account to let Cha-Ching! automatically categorize spending and suggest improvements."
                    />
    
    </div>
  </div>
);

const CTASection = () => (
  <div className="text-center mt-10">
    <Link to="/Index">
    <button className="bg-gray-900 text-white px-6 py-2 rounded-full font-semibold shadow-[0_0_15px_#00f0ff] hover:shadow-[0_0_25px_#00f0ff] transition">        Get Started Now
      </button>
    </Link>
  </div>
);

const Main = () => {
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
        <CTASection />
        <AboutSection />
        <div className="w-full py-16 px-4 text-center z-10 relative">
    <h2 className="text-3xl font-bold text-white mb-6">More Features:</h2>
    <p className="text-gray-300 max-w-2xl mx-auto ">
      Cha-Ching! also includes the following features:
    </p>
    </div>
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 mb-16">
  <div className="flex flex-col items-center text-center">
    <FiPieChart className="text-neon-purple mb-4" size={36} />
    <h3 className="text-xl font-bold text-white mb-2">Track Expenses</h3>
    <p className="text-gray-400">Visualize your spending patterns with interactive charts and graphs.</p>
  </div>
  <div className="flex flex-col items-center text-center">
    <FiBarChart2 className="text-neon-purple mb-4" size={36} />
    <h3 className="text-xl font-bold text-white mb-2">Budget Planning</h3>
    <p className="text-gray-400">Create budgets and get insights on how to optimize your spending.</p>
  </div>
  <div className="flex flex-col items-center text-center">
    <FiTarget className="text-neon-purple mb-4" size={36} />
    <h3 className="text-xl font-bold text-white mb-2">Financial Goals</h3>
    <p className="text-gray-400">Set savings goals and track your progress towards achieving them.</p>
  </div>
</div>

                  
      </div>
    </div>
  );
};

export default Main;