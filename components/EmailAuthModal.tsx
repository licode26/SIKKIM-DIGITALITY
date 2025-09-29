
import React, { useState } from 'react';
import { XIcon, SpinnerIcon, MailIcon, UserIcon, LockClosedIcon } from './Icons';

interface EmailAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onSignIn: (email: string, password: string) => Promise<void>;
}

const EmailAuthModal: React.FC<EmailAuthModalProps> = ({ isOpen, onClose, onSignUp, onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name) {
            throw new Error("Name is required for sign up.");
        }
        await onSignUp(name, email, password);
      } else {
        await onSignIn(email, password);
      }
      onClose();
    } catch (err: any) {
        // Firebase provides more user-friendly error messages
        switch (err.code) {
            case 'auth/email-already-in-use':
                setError('This email address is already in use.');
                break;
            case 'auth/invalid-email':
                setError('Please enter a valid email address.');
                break;
            case 'auth/weak-password':
                setError('Password should be at least 6 characters.');
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                setError('Invalid email or password.');
                break;
            default:
                setError(err.message || 'An unexpected error occurred. Please try again.');
                break;
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative w-full max-w-sm bg-brand-gray rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-brand-light-gray/50">
          <h2 className="text-lg font-semibold text-white">
            {isSignUp ? 'Create an Account' : 'Sign In'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close authentication">
            <XIcon />
          </button>
        </div>
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-brand-text-secondary mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon /></div>
                  <input id="full-name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors" />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-brand-text-secondary mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon /></div>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors" />
              </div>
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-brand-text-secondary mb-2">Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon /></div>
                 <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors" />
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <div>
              <button type="submit" disabled={isLoading} className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-brand-teal disabled:bg-brand-light-gray disabled:cursor-not-allowed">
                {isLoading ? <SpinnerIcon /> : <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={handleToggleMode} className="text-sm text-brand-text-secondary hover:text-brand-teal underline">
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EmailAuthModal;
