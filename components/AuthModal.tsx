import React, { useState, useEffect, useCallback } from 'react';
import { XIcon, DevicePhoneMobileIcon, SpinnerIcon } from './Icons';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'phone' | 'otp';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [localPhoneNumber, setLocalPhoneNumber] = useState('7749929725');
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
    if (!isOpen) {
      setTimeout(() => {
        setStep('phone');
        setCountryCode('+91');
        setLocalPhoneNumber('7749929725');
        setOtp('');
        setError('');
        setIsLoading(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (countryCode.length <= 1 || !/^\+\d+$/.test(countryCode)) {
        setError('Please enter a valid country code (e.g., +91).');
        return;
    }
    
    if (!/^\d{7,}$/.test(localPhoneNumber)) {
        setError('Please enter a valid phone number.');
        return;
    }
    
    setIsLoading(true);
    const fullPhoneNumber = countryCode + localPhoneNumber;
    
    const { error } = await supabase.auth.signInWithOtp({
      phone: fullPhoneNumber,
    });

    setIsLoading(false);

    if (error) {
      console.error("Error sending OTP:", error.message);
      if (error.message.includes("is not a valid phone number") || error.message.includes("unverified")) {
         setError("This number isn't verified for the demo. Please use the test number provided.");
      } else {
         setError(`Could not send OTP. Please check the number and try again.`);
      }
    } else {
      setStep('otp');
    }
  };
  
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const fullPhoneNumber = countryCode + localPhoneNumber;

    const { data, error } = await supabase.auth.verifyOtp({
      phone: fullPhoneNumber,
      token: otp,
      type: 'sms',
    });

    setIsLoading(false);

    if (error) {
        console.error("Error verifying OTP:", error.message);
        setError('Invalid OTP. Please try again.');
    } else if (data.session) {
        console.log('OTP verified successfully.');
        // The onAuthStateChange listener in App.tsx will handle the rest.
        onClose();
    } else {
        setError('Could not sign you in. Please try again.');
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
                <form onSubmit={handleSendOtp} className="space-y-4">
                    <div>
                        <label htmlFor="phone-number" className="block text-sm font-medium text-brand-text-secondary mb-2">
                            Enter your mobile number
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                id="country-code"
                                type="text"
                                value={countryCode}
                                onChange={(e) => {
                                    let val = e.target.value;
                                    if (!val.startsWith('+')) val = '+' + val.replace(/\D/g, '');
                                    if (val.length > 4) val = val.slice(0, 4);
                                    setCountryCode(val);
                                }}
                                placeholder="+91"
                                className="w-1/4 bg-brand-dark border border-brand-light-gray rounded-lg py-3 px-3 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                                required
                                aria-label="Country Code"
                            />
                            <div className="relative w-3/4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <DevicePhoneMobileIcon />
                                </div>
                                <input
                                    id="phone-number"
                                    type="tel"
                                    value={localPhoneNumber}
                                    onChange={(e) => setLocalPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder="7749929725"
                                    className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                                    required
                                    aria-label="Phone Number"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-3 bg-brand-dark/50 border border-brand-light-gray/30 rounded-lg">
                        <p className="text-xs text-brand-text-secondary text-center">
                            <span className="font-semibold text-brand-text">Demo Note:</span> OTPs only work with the pre-verified number <br/> <span className="font-semibold text-brand-teal whitespace-nowrap">+91 7749929725</span>
                        </p>
                    </div>

                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                         <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-brand-teal disabled:bg-brand-light-gray disabled:cursor-not-allowed"
                        >
                            {isLoading ? <SpinnerIcon /> : <span>Send OTP</span>}
                        </button>
                    </div>
                </form>
            ) : (
                 <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div>
                         <p className="text-sm text-brand-text-secondary mb-2 text-center">
                            Enter the 6-digit code sent to <br/> <span className="font-semibold text-brand-text">{countryCode} {localPhoneNumber}</span>
                        </p>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="_ _ _ _ _ _"
                            maxLength={6}
                            autoComplete="one-time-code"
                            className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 px-4 text-brand-text placeholder-brand-text-secondary text-center text-2xl tracking-[0.5em] focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                            required
                            aria-label="One-Time Password"
                        />
                    </div>
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    <div>
                         <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-brand-teal disabled:bg-brand-light-gray"
                        >
                            {isLoading ? <SpinnerIcon /> : <span>Verify & Continue</span>}
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