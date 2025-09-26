import React, { useState, useEffect, useCallback } from 'react';
import { XIcon, DevicePhoneMobileIcon, SpinnerIcon } from './Icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (phone: string) => void;
}

type AuthStep = 'phone' | 'otp';

const MOCK_OTP = '123456';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn }) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    // Reset form when modal is opened or closed
    if (!isOpen) {
      setTimeout(() => {
        setStep('phone');
        setPhoneNumber('');
        setOtp('');
        setError('');
        setIsLoading(false);
      }, 300); // Delay reset to allow for closing animation
    }
  }, [isOpen]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basic validation for phone number
    if (!/^\d{10,}$/.test(phoneNumber.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number.');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call to send OTP
    console.log(`Sending OTP to ${phoneNumber}. Mock OTP is ${MOCK_OTP}`);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };
  
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (otp === MOCK_OTP) {
        console.log('OTP verified successfully.');
        onSignIn(phoneNumber);
    } else {
        setError('Invalid OTP. Please try again.');
    }
  };

  const changeNumber = () => {
    setStep('phone');
    setOtp('');
    setError('');
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative w-full max-w-sm bg-brand-gray rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-brand-light-gray/50">
          <h2 className="text-lg font-semibold text-white">
            {step === 'phone' ? 'Sign In or Sign Up' : 'Verify Your Number'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close authentication">
            <XIcon />
          </button>
        </div>

        <div className="p-6 sm:p-8">
            {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                    <div>
                        <label htmlFor="phone-number" className="block text-sm font-medium text-brand-text-secondary mb-2">
                            Enter your mobile number to begin
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DevicePhoneMobileIcon />
                            </div>
                            <input
                                id="phone-number"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Phone Number"
                                className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                                required
                                aria-label="Phone Number"
                            />
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                         <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-brand-teal disabled:bg-brand-light-gray disabled:cursor-not-allowed"
                        >
                            {isLoading ? <SpinnerIcon /> : <span>Send OTP via WhatsApp</span>}
                        </button>
                    </div>
                </form>
            ) : (
                 <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                         <p className="text-sm text-brand-text-secondary mb-2 text-center">
                            Enter the 6-digit code sent to <br/> <span className="font-semibold text-brand-text">{phoneNumber}</span>
                        </p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="_ _ _ _ _ _"
                            maxLength={6}
                            className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 px-4 text-brand-text placeholder-brand-text-secondary text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                            required
                            aria-label="One-Time Password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                         <button
                            type="submit"
                            className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-brand-teal"
                        >
                            Verify & Continue
                        </button>
                    </div>
                     <div className="text-center">
                        <button type="button" onClick={changeNumber} className="text-sm text-brand-text-secondary hover:text-brand-teal underline">
                            Change Number
                        </button>
                    </div>
                </form>
            )}
             <p className="mt-6 text-xs text-brand-text-secondary text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
