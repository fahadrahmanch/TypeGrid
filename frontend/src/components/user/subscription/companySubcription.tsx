import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCompanyPlans } from "../../../api/user/subcription";
import { Check, ArrowLeft, Building2, Users, Trophy, BarChart3, Mail, Zap, Loader2 } from "lucide-react";
interface ICompanyPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  type: "company";
  userLimit: number;
}

const CompanySubcriptionDiv1: React.FC = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ICompanyPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanyDetails() {
      try {
        const response = await getCompanyPlans();
        const plansData = response.data.plans || response.data || [];
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching company plans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanyDetails();
  }, []);

  useEffect(()=>{
     const companyDetails= async()=>{
      try {
        const response = await getCompanyDetailsApi();
        const companyData = response.data.data
        console.log(companyData);
        
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
     }
     companyDetails();
  },[])
  const getDurationText = (days: number) => {
    if (days >= 365) return "/year";
    if (days >= 30) return "/month";
    return `/${days} days`;
  };
  return (
    <>
      <div className="min-h-screen  py-10 px-4 sm:px-6 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* --- Top Nav: Back Button --- */}
          <div className="mb-5 mt-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Plans
            </button>
          </div>

          {/* --- Header Section --- */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Choose a Company Subscription Plan
            </h1>
            <p className="text-slate-500 text-lg">
              Select the plan that fits your team size and needs
            </p>
          </div>

          {/* --- Pricing Cards Grid --- */}
          {/* items-center ensures vertical alignment for the scaled middle card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-24">
            {loading ? (
              // Loading Skeletons
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 animate-pulse">
                  <div className="h-6 w-24 bg-slate-100 rounded-full mx-auto mb-6" />
                  <div className="h-12 w-32 bg-slate-100 rounded-xl mx-auto mb-8" />
                  <div className="space-y-4 mb-8">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <div key={j} className="h-4 w-full bg-slate-50 rounded" />
                    ))}
                  </div>
                  <div className="h-12 w-full bg-slate-100 rounded-xl" />
                </div>
              ))
            ) : plans.length > 0 ? (
              plans.map((plan, index) => {
                const isPopular = plans.length === 3 ? index === 1 : plans.length > 1 && index === Math.floor(plans.length / 2);

                return (
                  <div
                    key={plan.id}
                    className={`relative bg-white rounded-[32px] p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 ${isPopular ? "border-purple-200 shadow-xl scale-105 z-10" : "border-slate-100 shadow-sm"
                      }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg shadow-purple-200">
                        Most Popular
                      </div>
                    )}

                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 capitalize">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-black text-slate-900">
                          ${plan.price}
                        </span>
                        <span className="text-slate-400 ml-1 font-semibold text-sm">
                          {getDurationText(plan.duration)}
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-10">
                      <li className="flex items-center text-slate-700 text-sm font-semibold">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-3 shrink-0">
                          <Users className="w-4 h-4 text-indigo-600" />
                        </div>
                        Up to {plan.userLimit} employees
                      </li>
                      {(plan.features.length > 0 ? plan.features : [
                        "Access to company contests",
                        "Team leaderboard",
                        "Advanced analytics",
                        "Priority support"
                      ]).map((item, i) => (
                        <li key={i} className="flex items-center text-slate-600 text-sm font-medium">
                          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mr-3 shrink-0">
                            <Check className="w-4 h-4 text-purple-600" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>

                    <Link to={`/subscription/company/verify/${plan.id}`} className="block">
                      <button className={`w-full py-4 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${isPopular
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-100 hover:opacity-90"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
                        }`}>
                        Select Plan
                        <Zap className={`w-4 h-4 ${isPopular ? "fill-current" : ""}`} />
                      </button>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Building2 className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">No plans available</h3>
                <p className="text-slate-500">Check back later for new company subscriptions.</p>
              </div>
            )}
          </div>

          {/* --- Footer Features --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-gray-200 pt-16 max-w-6xl mx-auto text-center">
            {/* Feature 1 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform shadow-sm">
                <Trophy className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">
                Company Contests
              </h4>
              <p className="text-slate-500 text-sm max-w-xs">
                Exclusive competitions for your team members
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-500 group-hover:scale-110 transition-transform shadow-sm">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">
                Team Leaderboard
              </h4>
              <p className="text-slate-500 text-sm max-w-xs">
                Track and compare team performance
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-500 group-hover:scale-110 transition-transform shadow-sm">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">
                Department Tracking
              </h4>
              <p className="text-slate-500 text-sm max-w-xs">
                Organize contests by departments
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CompanySubcriptionDiv1;
