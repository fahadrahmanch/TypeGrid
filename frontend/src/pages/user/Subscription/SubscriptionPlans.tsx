import React, { useEffect, useState } from "react";
import { Check, Lock,
  //  Star, Zap,
    Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/user/Navbar";
import { getSubscriptionPlans } from "../../../api/user/subcription";
import { createSubscriptionSession } from "../../../api/user/subcription";
interface ISubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: "normal" | "company";
  userLimit?: number;
}

const SubscriptionPlans: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await getSubscriptionPlans();

      const plansData = response.data.plans || response.data || [];
      setPlans(plansData);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpgrade = async () => {
    try {
      if (!selectedPlanId) {
        
        return;
      }

      const res = await createSubscriptionSession(selectedPlanId);
      const data = res.data.url;
      window.location.href = data;
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const normalPlans = plans.filter((p) => p.type === "normal");

  useEffect(() => {
    if (!loading && normalPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(normalPlans[0].id);
    }
  }, [loading, normalPlans, selectedPlanId]);

  // const freeFeatures = [
  //   {
  //     name: "Practice Mode",
  //     description: "Free unlimited typing practice sessions",
  //     icon: <Check className="w-5 h-5 text-green-500" />,
  //   },
  //   {
  //     name: "Daily Challenges",
  //     description: "Complete daily typing challenges",
  //     icon: <Check className="w-5 h-5 text-green-500" />,
  //   },
  //   {
  //     name: "Basic Badges",
  //     description: "Earn basic achievement badges",
  //     icon: <Check className="w-5 h-5 text-green-500" />,
  //   },
  // ];



  // function AwardIcon() {
  //   return (
  //     <svg
  //       className="w-5 h-5 text-yellow-500"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <circle cx="12" cy="8" r="7" />
  //       <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  //     </svg>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#FFF8EA] pt-20 pb-12 px-4">
      <Navbar />

      <div className="max-w-5xl mx-auto">
   
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">Unlock Your Typing Potential!</h1>
          <p className="text-base md:text-lg text-gray-600 font-medium">Upgrade to Premium for an Enhanced Experience</p>
        </div>

        {/* <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-900 font-bold text-xl flex items-center gap-2">
                <Check className="w-5 h-5" /> Free Features
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-8">Everything you get for free</p>

            <div className="space-y-6">
              {freeFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{feature.name}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-yellow-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <div className="bg-yellow-400 text-white text-[10px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                Premium
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="text-gray-900 font-bold text-xl flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Premium Features
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-8">Unlock your full potential</p>

            <div className="space-y-6">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-yellow-600/50" />
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{feature.name}</h3>
                      <p className="text-sm text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[40px] p-6 md:p-10 border border-white/60 shadow-xl max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Choose Your Plan</h2>
            <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-widest">Unlock premium features</p>
          </div>

          <div
            className={`grid gap-4 md:gap-6 mb-8 md:mb-10 ${normalPlans.length > 1 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "max-w-md mx-auto"}`}
          >
            {normalPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 border-2 relative ${
                  selectedPlanId === plan.id
                    ? "bg-[#8B7355]/5 border-[#8B7355] shadow-lg shadow-[#8B7355]/10 scale-[1.02]"
                    : "bg-white/50 border-transparent hover:border-gray-200"
                }`}
              >
                <div className="text-center">
                  <h3 className="font-black text-gray-900 mb-4 uppercase tracking-widest text-xs">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-3xl font-black text-gray-900">${plan.price}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">for {plan.duration} days</p>

                  <div className="mt-6 space-y-3 text-left">
                    {plan.features.slice(0, 5).map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-2 text-[11px] md:text-xs text-gray-600 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {normalPlans.length === 0 && !loading && (
            <div className="text-center py-10 bg-white/30 rounded-2xl border border-dashed border-gray-200 mb-10">
              <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No premium plans available at the moment.</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => handleUpgrade()}
              className="w-full md:w-auto bg-[#8B7355] hover:bg-[#766248] text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 mx-auto transition-all shadow-lg hover:shadow-[#8B7355]/20 active:scale-95 mb-4 group"
            >
              UPGRADE NOW
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Join typing champions worldwide</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[2.5rem] md:rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-gradient-to-r from-[#A855F7] to-[#3B82F6] rounded-[2.5rem] md:rounded-[32px] p-8 md:p-12 text-center text-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-blue-500/20 rounded-full -ml-24 -mb-24 md:-ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 tracking-tight">Company Subscription</h2>
              <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
                Join exclusive company contests, compete with your team, and climb the corporate leaderboard. Perfect
                for teams looking to improve typing skills together!
              </p>
              <button
                onClick={() => navigate("/subscription/company")}
                className="w-full md:w-auto bg-white text-purple-600 px-8 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-opacity-90 transition-all shadow-lg hover:shadow-white/20 flex items-center justify-center gap-2 group"
              >
                GO TO COMPANY PLAN
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
