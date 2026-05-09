import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import ReusableTable from "../../components/common/ReusableTable";
import { toast } from "react-toastify";
import {
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../../api/admin/subscription";
import {
  nameValidation,
  priceValidation,
  durationValidation,
  typeValidation,
  userLimitValidation,
  featuresValidation,
} from "../../validations/subscriptionValidation";

import { getSubscriptionNormalPlans, getSubscriptionCompanyPlans } from "../../api/admin/subscription";

interface ISubscriptionPlan {
  id: string;
  name: string;
  price: string | number;
  duration: string | number;
  type: "normal" | "company";
  features: string[];
  userLimit?: string | number;
}

const SubscriptionPlans: React.FC = () => {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);


  const [normalPlans, setNormalPlans] = useState<ISubscriptionPlan[]>([]);
  const [companyPlans, setCompanyPlans] = useState<ISubscriptionPlan[]>([]);


  const fetchPlans = async () => {
    try {
      // setLoading(true);
      const [normalRes, companyRes] = await Promise.all([getSubscriptionNormalPlans(), getSubscriptionCompanyPlans()]);

      const normalData = normalRes.data.subscriptionPlans || [];
      const companyData = companyRes.data.subscriptionPlans || [];

      setNormalPlans(normalData);
      setCompanyPlans(companyData);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const [values, setValues] = useState({
    name: "",
    price: "",
    duration: "monthly",
    type: "normal",
    userLimit: "",
    features: [] as string[],
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
    duration: "",
    type: "",
    userLimit: "",
    features: "",
  });

  const [editValues, setEditValues] = useState({
    id: "",
    name: "",
    price: "",
    duration: "",
    type: "normal",
    userLimit: "",
    features: [] as string[],
  });

  const [editFormErrors, setEditFormErrors] = useState({
    name: "",
    price: "",
    duration: "",
    type: "",
    userLimit: "",
    features: "",
  });

  const NORMAL_FEATURES = ["Solo Play", "Quick Play", "Group Play"];

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        features: name === "type" && value === "company" ? [] : prev.features,
        userLimit: name === "type" && value === "normal" ? "" : name === "userLimit" ? value : prev.userLimit,
      };

      // Real-time validation
      let error = "";
      if (name === "name") error = nameValidation(value);
      if (name === "price") error = priceValidation(value);
      if (name === "duration") error = durationValidation(value);
      if (name === "type") {
        error = typeValidation(value);
        setFormErrors((prevErr) => ({
          ...prevErr,
          userLimit: "",
          features: "",
        }));
      }
      if (name === "userLimit") error = userLimitValidation(updated.type, value);

      setFormErrors((prevErr) => ({ ...prevErr, [name]: error }));
      return updated;
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => {
      const updated = {
        ...prev,
        [name]: value,
        features: name === "type" && value === "company" ? [] : prev.features,
        userLimit: name === "type" && value === "normal" ? "" : name === "userLimit" ? value : prev.userLimit,
      };

      // Real-time validation
      let error = "";
      if (name === "name") error = nameValidation(value);
      if (name === "price") error = priceValidation(value);
      if (name === "duration") error = durationValidation(value);
      if (name === "type") {
        error = typeValidation(value);
        setEditFormErrors((prevErr) => ({
          ...prevErr,
          userLimit: "",
          features: "",
        }));
      }
      if (name === "userLimit") error = userLimitValidation(updated.type, value);

      setEditFormErrors((prevErr) => ({ ...prevErr, [name]: error }));
      return updated;
    });
  };

  const toggleFeature = (type: "create" | "edit", feature: string) => {
    if (type === "create") {
      setValues((prev) => {
        const updatedFeatures = prev.features.includes(feature)
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature];

        const error = featuresValidation(prev.type, updatedFeatures);
        setFormErrors((prevErr) => ({ ...prevErr, features: error }));

        return { ...prev, features: updatedFeatures };
      });
    } else {
      setEditValues((prev) => {
        const updatedFeatures = prev.features.includes(feature)
          ? prev.features.filter((f) => f !== feature)
          : [...prev.features, feature];

        const error = featuresValidation(prev.type, updatedFeatures);
        setEditFormErrors((prevErr) => ({ ...prevErr, features: error }));

        return { ...prev, features: updatedFeatures };
      });
    }
  };

  const validateAll = (data: typeof values, setErrorFn: Function) => {
    const errors = {
      name: nameValidation(data.name),
      price: priceValidation(data.price),
      duration: durationValidation(data.duration),
      type: typeValidation(data.type),
      userLimit: userLimitValidation(data.type, data.userLimit),
      features: featuresValidation(data.type, data.features),
    };
    setErrorFn(errors);
    return !Object.values(errors).some((err) => err !== "");
  };

  const handleCreateSubmit = async () => {
    if (validateAll(values, setFormErrors)) {
      try {
        await createSubscriptionPlan(values);
        setCreateOpen(false);
        fetchPlans(); // Refresh the list
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error creating plan");
        }
      }
    }
  };

  const handleEditSubmit = async () => {
    if (validateAll(editValues, setEditFormErrors)) {
      try {
        await updateSubscriptionPlan(editValues.id, editValues);
        setEditOpen(false);
        fetchPlans(); // Refresh the list
      } catch (error:any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error updating plan");
        }
      }
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setPlanToDelete({ id, name });
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (planToDelete) {
      try {
        await deleteSubscriptionPlan(planToDelete.id);
        setDeleteOpen(false);
        setPlanToDelete(null);
        fetchPlans(); // Refresh the list
      } catch (error:any) {
          if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error updating plan");
        }
      }
    }
  };

  const openEdit = (plan: ISubscriptionPlan) => {
    // Map numeric duration back to select values and ensure numbers are converted to strings for form inputs
    const normalizedPlan = {
      ...plan,
      duration: plan.duration === 30 ? "monthly" : plan.duration === 365 ? "yearly" : String(plan.duration),
      price: String(plan.price),
      userLimit: plan.userLimit ? String(plan.userLimit) : "",
    };

    setEditValues(normalizedPlan);
    setEditFormErrors({
      name: "",
      price: "",
      duration: "",
      type: "",
      userLimit: "",
      features: "",
    });
    setEditOpen(true);
  };

  return (
    <>
      <SideNavbar />

      <div className="md:ml-64 p-4 md:p-8 min-h-screen bg-[#FFF8EA] pt-24 md:pt-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-1 md:mb-2">Subscription Plans</h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">Manage platform tiers and pricing models.</p>
            </div>

            <button
              onClick={() => {
                setValues({
                  name: "",
                  price: "",
                  duration: "monthly",
                  type: "normal",
                  userLimit: "",
                  features: [],
                });
                setFormErrors({
                  name: "",
                  price: "",
                  duration: "",
                  type: "",
                  userLimit: "",
                  features: "",
                });
                setCreateOpen(true);
              }}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#ECA468] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#ECA468]/20 hover:bg-[#D0864B] transition-all duration-300 uppercase text-[10px] md:text-xs tracking-widest"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" />
              Create Plan
            </button>
          </div>

          {/* Normal Plan Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10 mb-6 md:mb-8">
            <div className="mb-6 px-1">
              <h2 className="text-lg md:text-xl font-black text-gray-900 mb-1 capitalize">Individual Plans</h2>
              <p className="text-[10px] md:text-sm text-gray-400 font-medium">
                Standard membership tiers for regular users.
              </p>
            </div>

            {/* Individual Plans Table */}
            <div className="overflow-x-auto">
              <ReusableTable
                columns={[
                  {
                    header: "Plan Tier",
                    key: "name",
                    className: "py-5 px-6 text-sm font-bold text-gray-800 whitespace-nowrap",
                  },
                  {
                    header: "Pricing",
                    key: "price",
                    className: "py-5 px-6 text-sm font-bold text-[#ECA468] whitespace-nowrap",
                    render: (plan) => `$${plan.price}`,
                  },
                  {
                    header: "Cycle",
                    key: "duration",
                    className: "py-5 px-6 text-sm font-bold text-gray-500 capitalize whitespace-nowrap",
                    render: (plan) =>
                      plan.duration === 30 ? "Monthly" : plan.duration === 365 ? "Yearly" : `${plan.duration} Days`,
                  },
                  {
                    header: "Feature Set",
                    key: "features",
                    className: "py-5 px-6 whitespace-nowrap",
                    render: (plan) => (
                      <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature, fIndex) => (
                          <span
                            key={fIndex}
                            className="px-3 py-1 bg-white text-[#64748B] text-[10px] font-bold rounded-full border border-gray-100"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  {
                    header: "Actions",
                    key: "actions",
                    headerClassName: "text-right",
                    className: "py-5 px-6 text-right whitespace-nowrap",
                    render: (plan) => (
                      <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button
                          onClick={() => openEdit(plan as ISubscriptionPlan)}
                          className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(plan.id, plan.name)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={normalPlans}
                rowClassName="hover:bg-gray-50/50 transition-colors"
                headerClassName="bg-[#FFF8EA] text-left"
                columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
              />
            </div>
          </div>

          {/* Company Plan Section */}
          <div className="bg-[#fff8ea]/60 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-4 md:p-8 shadow-sm border border-[#ECA468]/10">
            <div className="mb-6 px-1">
              <h2 className="text-lg md:text-xl font-black text-gray-900 mb-1 capitalize">Enterprise Plans</h2>
              <p className="text-[10px] md:text-sm text-gray-400 font-medium">
                Bulk licensing for organizations and corporate teams.
              </p>
            </div>

            {/* Enterprise Plans Table */}
            <div className="overflow-x-auto">
              <ReusableTable
                columns={[
                  {
                    header: "Corporate Tier",
                    key: "name",
                    className: "py-5 px-6 text-sm font-bold text-gray-800 whitespace-nowrap",
                  },
                  {
                    header: "Pricing",
                    key: "price",
                    className: "py-5 px-6 text-sm font-bold text-[#ECA468] whitespace-nowrap",
                    render: (plan) => `$${plan.price}`,
                  },
                  {
                    header: "Cycle",
                    key: "duration",
                    className: "py-5 px-6 text-sm font-bold text-gray-500 capitalize whitespace-nowrap",
                    render: (plan) =>
                      plan.duration === 30 ? "Monthly" : plan.duration === 365 ? "Yearly" : `${plan.duration} Days`,
                  },
                  {
                    header: "User Limit",
                    key: "userLimit",
                    className: "py-5 px-6 text-sm font-bold text-gray-700 whitespace-nowrap",
                    render: (plan) => (
                      <span className="px-3 py-1 bg-white border border-gray-100 rounded-lg">
                        {plan.userLimit} Seats
                      </span>
                    ),
                  },
                  {
                    header: "Actions",
                    key: "actions",
                    headerClassName: "text-right",
                    className: "py-5 px-6 text-right whitespace-nowrap",
                    render: (plan) => (
                      <div className="flex justify-end gap-2 md:translate-x-2 md:opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button
                          onClick={() => openEdit(plan as ISubscriptionPlan)}
                          className="p-2 text-gray-400 hover:text-[#ECA468] bg-white rounded-lg shadow-sm border border-gray-50 hover:border-[#FADDB8] transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(plan.id, plan.name)}
                          className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg shadow-sm border border-gray-50 hover:border-red-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ),
                  },
                ]}
                data={companyPlans}
                rowClassName="hover:bg-gray-50/50 transition-colors"
                headerClassName="bg-[#FFF8EA] text-left"
                columnHeaderClassName="py-4 px-6 text-[10px] font-black text-[#D0864B] uppercase tracking-widest border-b border-[#ECA468]/10"
              />
            </div>
          </div>
        </div>
      </div>

      {isCreateOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-2xl bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">Create Subscription Plan</h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">Add a new tier to the platform</p>
                </div>
                <button 
                  onClick={() => setCreateOpen(false)} 
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                >
                  <X className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-white/20 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleCreateChange}
                      placeholder="e.g. Premium"
                      className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${formErrors.name ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 shadow-sm`}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={values.price}
                      onChange={handleCreateChange}
                      placeholder="e.g. 19.99"
                      className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${formErrors.price ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 shadow-sm`}
                    />
                    {formErrors.price && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{formErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={values.duration}
                      onChange={handleCreateChange}
                      className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${formErrors.duration ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm`}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    {formErrors.duration && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{formErrors.duration}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Plan Type
                    </label>
                    <select
                      name="type"
                      value={values.type}
                      onChange={handleCreateChange}
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="normal">Normal Plan</option>
                      <option value="company">Company Plan</option>
                    </select>
                  </div>
                  {values.type === "company" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                        User Seats
                      </label>
                      <input
                        type="number"
                        name="userLimit"
                        value={values.userLimit}
                        onChange={handleCreateChange}
                        placeholder="e.g. 50"
                        className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${formErrors.userLimit ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 shadow-sm`}
                      />
                      {formErrors.userLimit && (
                        <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{formErrors.userLimit}</p>
                      )}
                    </div>
                  )}
                  {values.type === "normal" && (
                    <div className="md:col-span-2">
                      <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                        Select Features
                      </label>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {NORMAL_FEATURES.map((feature) => (
                          <button
                            key={feature}
                            onClick={() => toggleFeature("create", feature)}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all border ${
                              values.features.includes(feature)
                                ? "bg-[#ECA468] text-white border-[#ECA468] shadow-md"
                                : "bg-white text-gray-400 border-gray-100 hover:border-[#ECA468]/30"
                            }`}
                          >
                            {feature}
                          </button>
                        ))}
                      </div>
                      {formErrors.features && (
                        <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-2 px-1">{formErrors.features}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-t border-[#ECA468]/5 bg-white/40 flex flex-row justify-end gap-2 md:gap-4">
                <button
                  onClick={() => setCreateOpen(false)}
                  className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubmit}
                  className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Create
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isEditOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="relative w-full max-w-2xl bg-[#FFF8EA] rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-b border-[#ECA468]/10 bg-white/40 flex justify-between items-center">
                <div>
                  <h2 className="text-lg md:text-2xl font-black text-gray-900 leading-tight">Edit Subscription Plan</h2>
                  <p className="text-[8px] md:text-xs text-[#D0864B] font-bold uppercase tracking-widest mt-0.5">Update plan details and pricing</p>
                </div>
                <button 
                  onClick={() => setEditOpen(false)} 
                  className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all"
                >
                  <X className="w-4 h-4 md:w-6 md:h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-10 bg-white/20 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editValues.name}
                      onChange={handleEditChange}
                      placeholder="e.g. Premium"
                      className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${editFormErrors.name ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 shadow-sm`}
                    />
                    {editFormErrors.name && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{editFormErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editValues.price}
                      onChange={handleEditChange}
                      placeholder="e.g. 19.99"
                      className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${editFormErrors.price ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 shadow-sm`}
                    />
                    {editFormErrors.price && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{editFormErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={editValues.duration}
                      onChange={handleEditChange}
                      className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${editFormErrors.duration ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm`}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    {editFormErrors.duration && (
                      <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{editFormErrors.duration}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                      Plan Type
                    </label>
                    <select
                      name="type"
                      value={editValues.type}
                      onChange={handleEditChange}
                      className="w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 appearance-none cursor-pointer shadow-sm"
                    >
                      <option value="normal">Normal Plan</option>
                      <option value="company">Company Plan</option>
                    </select>
                  </div>
                  {editValues.type === "company" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-1.5 block px-1">
                        User Seats
                      </label>
                      <input
                        type="number"
                        name="userLimit"
                        value={editValues.userLimit}
                        onChange={handleEditChange}
                        placeholder="e.g. 50"
                        className={`w-full px-4 md:px-6 py-2.5 md:py-4 bg-white rounded-xl md:rounded-2xl border ${editFormErrors.userLimit ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-xs md:text-base text-gray-800 shadow-sm`}
                      />
                      {editFormErrors.userLimit && (
                        <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-1 px-1">{editFormErrors.userLimit}</p>
                      )}
                    </div>
                  )}
                  {editValues.type === "normal" && (
                    <div className="md:col-span-2">
                      <label className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                        Select Features
                      </label>
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        {NORMAL_FEATURES.map((feature) => (
                          <button
                            key={feature}
                            onClick={() => toggleFeature("edit", feature)}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all border ${
                              editValues.features.includes(feature)
                                ? "bg-[#ECA468] text-white border-[#ECA468] shadow-md"
                                : "bg-white text-gray-400 border-gray-100 hover:border-[#ECA468]/30"
                            }`}
                          >
                            {feature}
                          </button>
                        ))}
                      </div>
                      {editFormErrors.features && (
                        <p className="text-red-500 text-[8px] md:text-[10px] font-bold mt-2 px-1">{editFormErrors.features}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="px-5 md:px-10 py-4 md:py-8 border-t border-[#ECA468]/5 bg-white/40 flex flex-row justify-end gap-2 md:gap-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-4 md:px-8 py-2 md:py-4 rounded-xl md:rounded-2xl bg-white text-gray-500 font-black text-[8px] md:text-xs uppercase tracking-widest border border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-5 md:px-10 py-2 md:py-4 rounded-xl md:rounded-2xl bg-[#ECA468] text-white font-black text-[8px] md:text-xs uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Update
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {isDeleteOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300 p-4">
            <div className="w-full max-w-sm md:max-w-md bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-300">
              <div className="px-6 md:px-10 py-6 md:py-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 md:mb-6">
                  <AlertCircle className="w-6 h-6 md:w-10 md:h-10" />
                </div>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 leading-tight mb-2">Delete Plan?</h2>
                <p className="text-xs md:text-sm text-gray-500 font-medium px-4">
                  Are you sure you want to delete <span className="text-gray-900 font-black">"{planToDelete?.name}"</span>?
                </p>
              </div>

              <div className="px-6 md:px-10 py-4 md:py-8 bg-gray-50/50 border-t border-gray-100 flex flex-row justify-end gap-2 md:gap-4 shadow-inner">
                <button
                  onClick={() => {
                    setDeleteOpen(false);
                    setPlanToDelete(null);
                  }}
                  className="flex-1 px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[8px] md:text-xs font-black uppercase tracking-widest text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 md:px-10 py-2 md:py-3 rounded-xl md:rounded-2xl bg-red-500 text-white text-[8px] md:text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default SubscriptionPlans;
