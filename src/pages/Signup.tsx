import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AnimatedBackground from '@/components/AnimatedBackground';
import { FiArrowLeft, FiPhone, FiShield, FiCheck, FiLock, FiCreditCard, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

// Sample bank data
const BANKS = [
  { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
  { id: 'icici', name: 'ICICI Bank', logo: '🏦' },
  { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
  { id: 'pnb', name: 'Punjab National Bank', logo: '🏦' },
];

const SignupComponent = () => {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Google Login Handler
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post('/api/auth/google', {
          token: tokenResponse.access_token
        });

        localStorage.setItem('token', data.token);
        if (data.user) {
          setUserName(data.user.name || '');
          setEmail(data.user.email || '');
        }

        toast({
          title: "Google Signup Successful!",
          description: "Please connect your bank account",
        });
        setStep(4); // Skip to bank connection step
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Google Signup Failed",
          description: "Please try another method",
        });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Google Signup Failed",
        description: "Please try again",
      });
    }
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Phone Verified",
        description: "Your phone number has been verified successfully.",
      });
      setStep(3);
    }, 1500);
  };
  
  const handleSubmitConsent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      toast({
        title: "Consent Required",
        description: "Please review and accept the consent terms to proceed.",
        variant: "destructive",
      });
      return;
    }
    setStep(4);
  };
  
  const handleSelectBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      toast({
        title: "Bank Selection Required",
        description: "Please select a bank to connect your account.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessDialog(true);
      
      localStorage.setItem('userInfo', JSON.stringify({
        name: userName || 'Google User',
        email: email,
        phone: phoneNumber,
        bank: BANKS.find(bank => bank.id === selectedBank)?.name || selectedBank
      }));
      
      setTimeout(() => {
        navigate('/dashboardbank');
      }, 2000);
    }, 2500);
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
            {[1, 2, 3, 4, 5].map((i) => (
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
                  {i === 1 ? 'Profile' : 
                   i === 2 ? 'Verify' : 
                   i === 3 ? 'Consent' : 
                   i === 4 ? 'Bank' : 'Connect'}
                </span>
              </div>
            ))}
            <div className={`h-1 absolute top-[8.5rem] left-1/4 right-1/4 bg-gray-800 -z-10`}>
              <div 
                className="h-1 bg-neon-purple transition-all duration-500" 
                style={{ width: `${(step - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          
          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold mb-2 neon-text">Connect Your Bank</h2>
              <p className="text-gray-400 mb-6">Enter your details to get started</p>

              <Button 
                onClick={() => handleGoogleLogin()}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-100 text-black mb-4 flex items-center gap-2"
              >
                <FcGoogle className="h-5 w-5" />
                {isLoading ? "Signing up..." : "Sign up with Google"}
              </Button>

              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-700"></div>
                <span className="px-3 text-sm text-gray-500">OR</span>
                <div className="flex-grow h-px bg-gray-700"></div>
              </div>
              
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-500" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      placeholder="John Doe"
                      className="bg-gray-900 border-gray-700 focus:border-neon-purple pl-10"
                    />
                  </div>
                </div>
                
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
                      placeholder="+91 98765 43210"
                      className="bg-gray-900 border-gray-700 focus:border-neon-purple pl-10"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-neon-purple hover:bg-neon-purple/80"
                  disabled={isLoading || phoneNumber.length < 10 || !userName}
                >
                  {isLoading ? "Sending OTP..." : "Continue"}
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  By continuing, you agree to our <Link to="/terms" className="text-neon-purple hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-neon-purple hover:underline">Privacy Policy</Link>
                </p>
              </form>
            </>
          )}
          
          {/* Steps 2-5 remain exactly the same as your original code */}
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
                  {isLoading ? "Verifying..." : "Verify OTP"}
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
            <>
              <h2 className="text-3xl font-bold mb-2 neon-text">Account Access</h2>
              <p className="text-gray-400 mb-6">RBI Account Aggregator Consent</p>
              
              <form onSubmit={handleSubmitConsent} className="space-y-4">
                <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <FiLock className="text-neon-green" />
                    <h3 className="text-sm font-medium text-white">Account Aggregator Consent</h3>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-3">
                    By proceeding, you authorize Cha-Ching to access your financial information via India's Account Aggregator framework as regulated by the Reserve Bank of India.
                  </p>
                  
                  <div className="space-y-3 text-xs text-gray-300">
                    <p className="border-l-2 border-neon-purple pl-3">We will access transaction data from your selected bank accounts for the past 12 months.</p>
                    <p className="border-l-2 border-neon-purple pl-3">This data will be used to categorize expenses, track spending patterns, and help you set financial goals.</p>
                    <p className="border-l-2 border-neon-purple pl-3">Your consent is valid for 6 months and can be revoked at any time from the settings page.</p>
                  </div>
                  
                  <div className="mt-4 flex items-start space-x-3">
                    <Checkbox 
                      id="consent" 
                      checked={consentChecked} 
                      onCheckedChange={(checked) => setConsentChecked(checked === true)}
                      className="data-[state=checked]:bg-neon-purple data-[state=checked]:border-neon-purple"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-300 leading-tight">
                      I understand and consent to Cha-Ching accessing my financial information through the Account Aggregator framework for the purposes described above.
                    </label>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-neon-purple hover:bg-neon-purple/80"
                  disabled={!consentChecked}
                >
                  I Consent
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Your data privacy is our priority. Read our <Link to="/privacy" className="text-neon-purple hover:underline">Privacy Policy</Link> for more details.
                </p>
              </form>
            </>
          )}
          
          {step === 4 && (
            <>
              <h2 className="text-3xl font-bold mb-2 neon-text">Select Your Bank</h2>
              <p className="text-gray-400 mb-6">Choose your bank to connect your account</p>
              
              <form onSubmit={handleSelectBank} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {BANKS.map(bank => (
                    <div
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`cursor-pointer border p-3 rounded-md transition-all ${
                        selectedBank === bank.id 
                        ? 'border-neon-purple bg-neon-purple/10' 
                        : 'border-gray-700 bg-gray-800/30 hover:bg-gray-800/50'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <span className="text-2xl mr-2">{bank.logo}</span>
                        <div className="text-sm font-medium truncate">{bank.name}</div>
                      </div>
                      <div className="flex justify-center">
                        {selectedBank === bank.id && (
                          <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-neon-purple hover:bg-neon-purple/80 mt-4"
                  disabled={isLoading || !selectedBank}
                >
                  {isLoading ? "Connecting..." : "Connect Bank"}
                </Button>
                
                <p className="text-center text-xs text-gray-500 mt-2">
                  Your credentials are securely processed as per RBI guidelines
                </p>
              </form>
            </>
          )}
          
          {step === 5 && (
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
      
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="bg-gray-900 border border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center">
              <div className="w-12 h-12 mb-3 bg-neon-green/20 rounded-full flex items-center justify-center">
                <FiCreditCard className="w-6 h-6 text-neon-green" />
              </div>
              <span className="text-neon-green">Account Connected Successfully</span>
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300">
              We're setting up your financial dashboard with your transaction history and account details.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-neon-purple animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" style={{width: '100%'}}></div>
            </div>
            <p className="text-center text-sm text-gray-400">
              Please wait while we load your financial data...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrap with Google provider
const Signup = () => (
  <GoogleOAuthProvider clientId="62629678556-4sdn31go99vlev9qtc2n5312orfo8s6h.apps.googleusercontent.com">
    <SignupComponent />
  </GoogleOAuthProvider>
);

export default Signup;