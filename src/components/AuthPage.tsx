import React, { useState } from 'react';

interface AuthPageProps {
  onBackToOverview: () => void;
  onSignedIn: (analystName: string) => void;
  onOpenDocs?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onBackToOverview,
  onSignedIn,
  onOpenDocs,
}) => {
  const [email, setEmail] = useState('researcher@smartcrime.org.ng');
  const [password, setPassword] = useState('AnalystPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [accessRequestEmail, setAccessRequestEmail] = useState('');
  const [accessRequestSent, setAccessRequestSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid authorized analyst email address.');
      return;
    }
    setEmailError(null);
    setIsLoading(true);
    setStatusMessage('Verifying analyst credentials with NBS directory...');

    setTimeout(() => {
      setStatusMessage('Session Initialized ✓');
      setTimeout(() => {
        setIsLoading(false);
        const analystDisplay = email.split('@')[0].replace('.', ' ').toUpperCase();
        onSignedIn(`Analyst ${analystDisplay} (SEC-AUTH-2026)`);
      }, 700);
    }, 1200);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      onSignedIn('Analyst John I. (Google Workspace)');
    }, 1100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-purple-100 selection:text-purple-900 antialiased font-sans">
      {/* Top Micro Notice / Back Navigation bar */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 lg:px-12 py-3.5 flex items-center justify-between text-xs text-slate-600 z-30">
        <button
          onClick={onBackToOverview}
          className="inline-flex items-center gap-2 font-medium hover:text-purple-700 transition-colors group cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-purple-700 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span>Back to Public Overview</span>
        </button>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 font-mono text-[11px]">AUTHORIZED ANALYSTS ONLY</span>
        </div>
      </header>

      {/* Main Split-Screen Container */}
      <main className="flex-1 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto overflow-hidden relative">
        {/* ============================================================ */}
        {/* LEFT PANEL: Brand Intelligence & Abstract Data Art (46% Desktop) */}
        {/* ============================================================ */}
        <section className="lg:w-[46%] w-full bg-slate-50 p-6 lg:p-12 xl:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 relative overflow-hidden">
          {/* Ambient background decorative light halos */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-slate-200/40 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Brand Mark & Pill */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-700 p-0.5 flex items-center justify-center shadow-xs">
                  <div className="w-full h-full bg-purple-700 rounded-[10px] flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M12 3v3m0 12v3M3 12h3m12 0h3"></path>
                      <path d="m5.6 5.6 2.1 2.1m8.6 8.6 2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold tracking-tight text-xl text-slate-900">SMART CRIME</span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold tracking-wider rounded-md border border-purple-200">
                      DATA SUITE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                    Predictive Analytics & Spatial Intelligence
                  </p>
                </div>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-semibold text-purple-700 shadow-xs">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Verified NBS Baseline</span>
              </div>
            </div>

            {/* Headline & Editorial Intro */}
            <div className="mt-8 lg:mt-12 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-semibold text-purple-700 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                <span>Empirical Intelligence Architecture</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 tracking-tight leading-[1.18]">
                Crime Intelligence <br />
                <span className="text-purple-700">
                  Starts Here.
                </span>
              </h1>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
                Access calibrated machine learning models, longitudinal trend indices, K-Means clustering, and
                geospatial incident envelopes across 36 Nigerian states and the FCT.
              </p>
            </div>
          </div>

          {/* Centerpiece: Abstract Nigerian Geospatial & Analytics Visualization */}
          <div className="my-8 lg:my-10 relative z-10 w-full flex items-center justify-center">
            <div className="w-full max-w-[480px] bg-white rounded-2xl border border-slate-200 p-5 relative overflow-hidden shadow-sm">
              {/* Card Header inside preview */}
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-700"></div>
                  <span className="text-xs font-bold text-slate-900">
                    National Spatial Matrix & Incident Envelopes
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold">
                  Zone VI ACTIVE
                </span>
              </div>

              {/* Stylized Map Canvas & Cluster Graph */}
              <div className="relative w-full h-[220px] bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                {/* Grid lines inside map area */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:28px_28px] opacity-60"></div>

                {/* Stylized SVG of Nigeria Map Contour with Nodes & Connectors */}
                <svg className="w-full h-full p-2 relative z-0" viewBox="0 0 460 210" fill="none">
                  {/* Stylized Regional Polygon (Abstract Nigeria Contour) */}
                  <path
                    d="M 60 70 Q 120 40 210 50 Q 310 30 380 75 Q 430 110 390 160 Q 320 195 240 170 Q 170 190 95 160 Q 40 135 60 70 Z"
                    fill="#f8fafc"
                    stroke="#cbd5e1"
                    strokeWidth="1.8"
                    strokeDasharray="4 3"
                    opacity="0.9"
                  />

                  {/* Sub-zonal partitions / Delaunay Voronoi edges */}
                  <path
                    d="M 95 160 L 175 125 L 210 50 L 265 110 L 320 195 M 175 125 L 265 110 L 390 160 M 175 125 L 240 170"
                    stroke="#a855f7"
                    strokeWidth="1"
                    strokeLinecap="round"
                    opacity="0.6"
                  />

                  {/* Incident Density Pulse Rings (Hotspots) */}
                  {/* Lagos Hub */}
                  <circle cx="105" cy="155" r="18" fill="#7E22CE" fillOpacity="0.12" />
                  <circle cx="105" cy="155" r="9" fill="#7E22CE" fillOpacity="0.25" />
                  <circle cx="105" cy="155" r="4" fill="#7E22CE" />

                  {/* Kano Hub */}
                  <circle cx="235" cy="65" r="16" fill="#9333EA" fillOpacity="0.12" />
                  <circle cx="235" cy="65" r="8" fill="#9333EA" fillOpacity="0.25" />
                  <circle cx="235" cy="65" r="3.5" fill="#9333EA" />

                  {/* Rivers Hub */}
                  <circle cx="215" cy="170" r="14" fill="#A855F7" fillOpacity="0.15" />
                  <circle cx="215" cy="170" r="3.5" fill="#A855F7" />

                  {/* FCT Abuja Center */}
                  <circle
                    cx="210"
                    cy="115"
                    r="22"
                    fill="#7E22CE"
                    fillOpacity="0.08"
                    stroke="#7E22CE"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <circle cx="210" cy="115" r="5" fill="#5B21B6" />

                  {/* Connecting vector arc */}
                  <path
                    d="M 105 155 Q 160 110 210 115 T 235 65"
                    fill="none"
                    stroke="#7E22CE"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  {/* Tiny state dots */}
                  <circle cx="140" cy="100" r="2" fill="#64748b" />
                  <circle cx="280" cy="90" r="2.5" fill="#64748b" />
                  <circle cx="340" cy="110" r="2" fill="#64748b" />
                  <circle cx="160" cy="165" r="2" fill="#64748b" />
                  <circle cx="310" cy="150" r="2" fill="#64748b" />
                </svg>

                {/* Floating Micro Card 1: Cluster Confidence Badge */}
                <div className="absolute top-2.5 left-3 bg-white border border-slate-200 rounded-lg p-2 text-left shadow-xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>K-Means Model #3</span>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    Silhouette: <span className="font-bold text-slate-900">0.84</span> (Strong)
                  </p>
                </div>

                {/* Floating Micro Card 2: Hotspot Warning Indicator */}
                <div className="absolute bottom-2.5 right-3 bg-white border border-amber-200 rounded-lg p-2 text-left shadow-xs">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>Lagos Mainland</span>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-0.5">
                    Risk Rating: <span className="font-bold text-amber-700">Moderate (38.4)</span>
                  </p>
                </div>
              </div>

              {/* Bottom mini metrics ticker */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center">
                <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Normalized Cases</div>
                  <div className="text-xs font-bold text-slate-900">134,663</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Jurisdictions</div>
                  <div className="text-xs font-bold text-slate-900">36 + FCT</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-1.5 border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Model F1-Score</div>
                  <div className="text-xs font-bold text-purple-700">0.94 ROC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Statement at Bottom of Brand Column */}
          <div className="pt-4 border-t border-slate-200 relative z-10 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-700 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-medium text-slate-900">
                Data-driven insights from historical Nigerian crime records.
              </span>
            </div>
            <span className="hidden sm:inline-block font-mono text-[11px] text-slate-400">SEC-AUTH-2026</span>
          </div>
        </section>

        {/* ============================================================ */}
        {/* RIGHT PANEL: Authentication Form & Security Controls (54% Desktop) */}
        {/* ============================================================ */}
        <section className="lg:w-[54%] w-full bg-white p-6 sm:p-10 lg:p-14 xl:p-20 flex flex-col justify-between relative">
          {/* Centered Authentication Form Box */}
          <div className="w-full max-w-[440px] mx-auto my-auto py-4">
            {/* Form Intro Heading */}
            <div className="mb-7">
              <div className="text-xs font-bold uppercase tracking-wider text-purple-700 mb-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-700"></span>
                <span>Welcome back</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Sign in to Smart Crime
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Access your crime intelligence dashboard and analytical tools.
              </p>
            </div>

            {/* The Sign-In Form */}
            <form id="signin-form" className="space-y-4" onSubmit={handleSubmit}>
              {/* Field 1: Email */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-email" className="block text-[13px] font-semibold text-slate-900">
                    Work Email Address
                  </label>
                  <span className="text-[11px] text-slate-400">e.g. analyst@gov.ng</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="auth-email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    required
                    className="w-full h-[50px] pl-10 pr-4 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                </div>
                {emailError && (
                  <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Field 2: Password with Show/Hide toggle */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password" className="block text-[13px] font-semibold text-slate-900">
                    Password
                  </label>
                  <span className="text-[11px] text-slate-400">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-[50px] pl-10 pr-11 text-sm bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-purple-700 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title="Toggle password visibility"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-purple-700 transition-colors focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Auxiliary Row: Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1 pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-200 text-purple-700 focus:ring-purple-700 focus:ring-offset-0 focus:ring-2 transition-all cursor-pointer accent-purple-700"
                  />
                  <span className="text-xs font-medium text-slate-600">Remember my workstation</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Primary CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[50px] bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm rounded-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-85 shadow-xs"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span>{statusMessage || 'Signing in...'}</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <svg
                        className="w-4 h-4 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Subtle Divider: OR */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-slate-400 font-semibold tracking-wider">OR</span>
              </div>
            </div>

            {/* Google SSO Option */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full h-[48px] bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-900 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2 text-purple-700">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span>Authenticating with Google Workspace...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span className="group-hover:text-purple-700 transition-colors font-medium">
                      Continue with Google Workspace
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Registration & Access Request Note */}
            <div className="mt-7 pt-5 border-t border-slate-200 text-center text-xs text-slate-600">
              <span>Don't have an analyst account?</span>
              <button
                type="button"
                onClick={() => setShowAccessModal(true)}
                className="font-bold text-purple-700 hover:text-purple-900 transition-colors ml-1 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Request verified access</span>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Understated Security Assurance Footer in Auth Panel */}
          <div className="pt-6 border-t border-slate-200 w-full max-w-[460px] mx-auto flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-600">
              <svg className="w-4 h-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span className="font-medium">Secure access to Smart Crime</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenDocs) onOpenDocs();
                }}
                className="hover:text-purple-700 transition-colors cursor-pointer"
              >
                Privacy Charter
              </button>
              <span>•</span>
              <span className="font-mono text-[11px] text-slate-400">Audit Logging</span>
            </div>
          </div>
        </section>
      </main>

      {/* Access Request Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <h3 className="font-bold text-slate-900 text-[16px]">Request Analyst Access</h3>
              </div>
              <button
                onClick={() => {
                  setShowAccessModal(false);
                  setAccessRequestSent(false);
                }}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
            {accessRequestSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[28px]">check_circle</span>
                <span className="text-xs font-bold text-emerald-900">Access Request Submitted</span>
                <p className="text-[11px] text-emerald-700">
                  Your departmental credentials have been queued for verification with the security administrator.
                </p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verified analyst credentials are provisioned for personnel from civil oversight agencies, state
                  statistical bureaus, and academic security researchers.
                </p>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-900">Official Institution Email</label>
                  <input
                    type="email"
                    value={accessRequestEmail}
                    onChange={(e) => setAccessRequestEmail(e.target.value)}
                    placeholder="e.g. officer@police.gov.ng"
                    className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-700 text-slate-900"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowAccessModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setAccessRequestSent(true)}
                    className="px-4 py-1.5 bg-purple-700 text-white text-xs font-bold rounded-lg hover:bg-purple-800 cursor-pointer shadow-xs"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                </div>
                <h3 className="font-bold text-slate-900 text-[16px]">Reset Workstation Password</h3>
              </div>
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your assigned work email. A temporary security token will be dispatched to your registered security
              officer.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900">Work Email</label>
              <input
                type="email"
                defaultValue="researcher@smartcrime.org.ng"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-700 text-slate-900"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowForgotPasswordModal(false)}
                className="px-4 py-1.5 bg-purple-700 text-white text-xs font-bold rounded-lg hover:bg-purple-800 cursor-pointer shadow-xs"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
