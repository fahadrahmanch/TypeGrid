import { Link } from "react-router-dom";

const CompanySubcriptionDiv1:React.FC=()=>{
    return (
        <>
        <div className="min-h-screen  py-10 px-4 sm:px-6 font-sans">
  <div className="max-w-7xl mx-auto">
    
    {/* --- Top Nav: Back Button --- */}
    <div className="mb-5 mt-10">
      <button className="flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back to Plans
      </button>
    </div>

    {/* --- Header Section --- */}
    <div className="flex flex-col items-center text-center mb-16">
      <div className="bg-purple-100 p-3 rounded-2xl mb-6">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
          <path d="M9 22v-4h6v4"/>
          <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
          <path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/>
          <path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
        </svg>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Choose a Company Subscription Plan</h1>
      <p className="text-slate-500 text-lg">Select the plan that fits your team size and needs</p>
    </div>

    {/* --- Pricing Cards Grid --- */}
    {/* items-center ensures vertical alignment for the scaled middle card */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-center max-w-6xl mx-auto mb-24">

      {/* CARD 1: STARTER */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-fit">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-extrabold text-slate-900">$49</span>
            <span className="text-slate-400 ml-2 font-medium">/month</span>
          </div>
        </div>
        <ul className="space-y-4 mb-8">
          {["Up to 25 employees", "Access to company contests", "Team leaderboard", "Basic analytics", "Email support"].map((item, i) => (
            <li key={i} className="flex items-center text-slate-600 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-purple-400 mr-3 shrink-0"></div>
              {item}
            </li>
          ))}
        </ul>
        <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors">
          Select Plan
        </button>
      </div>

      {/* CARD 2: PROFESSIONAL (Highlighted) */}
      <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-purple-100 transform md:scale-105 z-10">
        {/* Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#6366F1] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
          Most Popular
        </div>
        
        <div className="text-center mb-8 mt-2">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Professional</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-extrabold text-slate-900">$99</span>
            <span className="text-slate-400 ml-2 font-medium">/month</span>
          </div>
        </div>
        <ul className="space-y-4 mb-8">
          {["Up to 100 employees", "All Starter features", "Advanced team analytics", "Custom contests", "Department-wise tracking", "Priority support"].map((item, i) => (
             <li key={i} className="flex items-center text-slate-600 text-sm font-medium">
             <div className="w-2 h-2 rounded-full bg-purple-400 mr-3 shrink-0"></div>
             {item}
           </li>
          ))}
        </ul>
        <Link to='/subscription/company/verify'>
        <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors">
          Select Plan
        </button>
          </Link>
      </div>

      {/* CARD 3: ENTERPRISE */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-fit">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-extrabold text-slate-900">$249</span>
            <span className="text-slate-400 ml-2 font-medium">/month</span>
          </div>
        </div>
        <ul className="space-y-4 mb-8">
          {["Unlimited employees", "All Professional features", "Dedicated account manager", "Custom integrations", "White-label options", "24/7 premium support"].map((item, i) => (
             <li key={i} className="flex items-center text-slate-600 text-sm font-medium">
             <div className="w-2 h-2 rounded-full bg-purple-400 mr-3 shrink-0"></div>
             {item}
           </li>
          ))}
        </ul>
        <button className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors">
          Select Plan
        </button>
      </div>

    </div>

    {/* --- Footer Features --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-gray-200 pt-16 max-w-6xl mx-auto text-center">
      
      {/* Feature 1 */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
        </div>
        <h4 className="font-bold text-slate-900 text-lg mb-2">Company Contests</h4>
        <p className="text-slate-500 text-sm max-w-xs">Exclusive competitions for your team members</p>
      </div>

      {/* Feature 2 */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <h4 className="font-bold text-slate-900 text-lg mb-2">Team Leaderboard</h4>
        <p className="text-slate-500 text-sm max-w-xs">Track and compare team performance</p>
      </div>

      {/* Feature 3 */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
        </div>
        <h4 className="font-bold text-slate-900 text-lg mb-2">Department Tracking</h4>
        <p className="text-slate-500 text-sm max-w-xs">Organize contests by departments</p>
      </div>

    </div>
  </div>
</div>
        </>
    );
};
export default CompanySubcriptionDiv1;