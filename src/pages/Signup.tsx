
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiArrowLeft, FiPhone, FiShield, FiCheck } from 'react-icons/fi';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "OTP sent",
        description: "Please check your phone for the verification code.",
      });
      setStep(2);
    }, 1500);
  };
  
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Connected",
        description: "Your bank account has been connected successfully.",
      });
      setStep(3);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
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
          <div className="flex justify-between items-center mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i < step ? 'bg-neon-green text-black' : 
                    i === step ? 'bg-neon-purple' : 'bg-gray-800'
                  } mb-1`}
                >
                  {i < step ? <FiCheck /> : i}
                </div>
                <span className="text-xs text-gray-400">
                  {i === 1 ? 'Phone' : i === 2 ? 'Verify' : 'Connect'}
                </span>
              </div>
            ))}
            <div className={`h-1 absolute top-[8.5rem] left-1/4 right-1/4 bg-gray-800 -z-10`}>
              <div 
                className="h-1 bg-neon-purple transition-all duration-500" 
                style={{ width: `${(step - 1) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold mb-2 neon-text">Connect Your Bank</h2>
              <p className="text-gray-400 mb-6">Enter your phone number to get started</p>
              
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-500" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-900 border-gray-700 focus:border-neon-purple pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-neon-purple hover:bg-neon-purple/80"
                  disabled={isLoading || phoneNumber.length < 10}
                >
                  {isLoading ? "Sending OTP..." : "Continue"}
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  By continuing, you agree to our <Link to="/terms" className="text-neon-purple hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-neon-purple hover:underline">Privacy Policy</Link>
                </p>
              </form>
            </>
          )}
          
          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold mb-2 neon-text">Verify OTP</h2>
              <p className="text-gray-400 mb-6">Enter the 6-digit code sent to your phone</p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-400 mb-1">
                    One-Time Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiShield className="text-gray-500" />
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
                      required
                      placeholder="123456"
                      maxLength={6}
                      className="bg-gray-900 border-gray-700 focus:border-neon-purple pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-neon-purple hover:bg-neon-purple/80"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? "Verifying..." : "Verify & Connect"}
                </Button>
                
                <p className="text-center text-sm text-gray-500 mt-2">
                  Didn't receive code? 
                  <button 
                    type="button" 
                    className="text-neon-purple hover:underline ml-1"
                    onClick={() => {
                      toast({
                        title: "OTP Resent",
                        description: "A new verification code has been sent to your phone.",
                      });
                    }}
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            </>
          )}
          
          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-neon-green" />
              </div>
              <h2 className="text-3xl font-bold mb-2 neon-text">Connected!</h2>
              <p className="text-gray-400 mb-6">Your account has been connected successfully.</p>
              <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
