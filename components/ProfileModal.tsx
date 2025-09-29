import React, { useState, useEffect, useCallback } from 'react';
import { XIcon, UserIcon, SpinnerIcon } from './Icons';
import { auth } from '../database';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  isSaving: boolean;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, isSaving }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

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
    if (isOpen) {
        const user = auth.currentUser;
        if (user) {
            setName(user.displayName || '');
        }
    } else {
      setTimeout(() => {
        setName('');
        setError('');
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    onSave(name);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative w-full max-w-sm bg-brand-gray rounded-2xl shadow-2xl border border-brand-light-gray/50 flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-brand-light-gray/50">
          <h2 className="text-lg font-semibold text-white">Complete Your Profile</h2>
          <button onClick={onClose} className="p-2 rounded-full text-brand-text-secondary hover:text-white hover:bg-brand-light-gray transition-colors" aria-label="Close profile setup">
            <XIcon />
          </button>
        </div>

        <div className="p-6 sm:p-8">
            <p className="text-center text-brand-text-secondary text-sm mb-6">Welcome! Please set your name to unlock your personalized experience.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-brand-text-secondary mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon />
                        </div>
                        <input
                            id="full-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="w-full bg-brand-dark border border-brand-light-gray rounded-lg py-3 pl-10 pr-4 text-brand-text placeholder-brand-text-secondary focus:ring-2 focus:ring-brand-teal focus:border-brand-teal focus:outline-none transition-colors"
                            required
                        />
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                <div>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full inline-flex justify-center items-center space-x-2 px-6 py-3 font-semibold bg-brand-teal text-brand-dark rounded-md hover:bg-brand-teal-dark transition-transform duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-gray focus:ring-brand-teal disabled:bg-brand-light-gray disabled:cursor-not-allowed"
                    >
                        {isSaving ? <SpinnerIcon /> : <span>Save & Continue</span>}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;