
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLoginWithGoogle = () => {
    setIsLoading(true);
    
    // Simulate Google login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });
      navigate('/dashboard');
    }, 1500);
  };
  
  const handleLoginWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate email login
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="w-full max-w-md z-10">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to home
        </Link>
        
        <div className="glass p-8 rounded-lg neon-border">
          <h2 className="text-3xl font-bold mb-2 neon-text">Welcome Back</h2>
          <p className="text-gray-400 mb-6">Sign in to continue to Cha-Ching</p>
          
          <Button 
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-100 text-black mb-4 flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" />
            Sign in with Google
          </Button>
          
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-700"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-700"></div>
          </div>
          
          <form onSubmit={handleLoginWithEmail} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="bg-gray-900 border-gray-700 focus:border-neon-purple"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1 flex justify-between">
                Password
                <Link to="/forgot-password" className="text-neon-purple hover:underline text-xs">
                  Forgot password?
                </Link>
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-900 border-gray-700 focus:border-neon-purple"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-neon-purple hover:bg-neon-purple/80"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <Link to="/signup" className="text-neon-purple hover:underline">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
