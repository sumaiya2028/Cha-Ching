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

  const handleLoginWithEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Existing email login logic
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
            onClick={() => {
              const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
              window.location.href = `${backendBaseUrl}/oauth2/authorization/google`;
            }}
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
          
          {<form onSubmit={handleLoginWithEmail}>
  <Input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="mb-4"
    required
  />
  <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="mb-6"
    required
  />
  <Button type="submit" className="w-full">
    {isLoading ? "Signing in..." : "Sign in"}
  </Button>
</form>}
        </div>
      </div>
    </div>
  );
};

export default Login;
