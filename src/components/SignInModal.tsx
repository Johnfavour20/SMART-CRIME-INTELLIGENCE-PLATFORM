import React, { useState } from 'react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignedIn?: (analystName: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onSignedIn }) => {
  const [email, setEmail] = useState('analyst@nigeria-nbs.gov.ng');
  const [badgeId, setBadgeId] = useState('NBS-SEC-8924');
  const [isLoading, setIsLoading] = useState(false);
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSignedInUser('Senior Intelligence Analyst (NBS-SEC-8924)');
      if (onSignedIn) onSignedIn('Senior Intelligence Analyst (NBS-SEC-8924)');
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#e9dff2] p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#6200a9] flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[22px]">verified_user</span>
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#1e1926]">
                Analyst Portal
              </h3>
              <span className="text-[12px] text-[#4c4354]">
                Authorized Security Operations Access
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#faf0ff] hover:bg-[#efe4f8] flex items-center justify-center text-[#4c4354] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {signedInUser ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[32px]">check_circle</span>
            <span className="text-[14px] font-bold text-emerald-900">
              Authentication Confirmed
            </span>
            <span className="text-[12px] text-emerald-700">
              Welcome, {signedInUser}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#4c4354] uppercase tracking-wider">
                Official Agency Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf0ff] border border-[#cfc2d6] text-[#1e1926] text-[13px] focus:outline-none focus:border-[#7e22ce]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#4c4354] uppercase tracking-wider">
                Security Badge / Dispatch ID
              </label>
              <input
                type="text"
                required
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf0ff] border border-[#cfc2d6] text-[#1e1926] text-[13px] font-mono focus:outline-none focus:border-[#7e22ce]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#faf0ff] border border-[#e9dff2] text-[11px] text-[#4c4354] leading-relaxed">
              <strong>Security Protocol:</strong> Access is audited in compliance with the Zero-Surveillance and Ethical AI Charter. All analytics sessions are watermarked.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7e22ce] hover:bg-[#6200a9] text-white font-bold text-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate Analyst'}</span>
              <span className="material-symbols-outlined text-[16px]">lock_open</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
