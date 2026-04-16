import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import {
  createSubscriptionPlan,
  getSubscriptionPlans,
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
  const [newFeature, setNewFeature] = useState("");

  const [normalPlans, setNormalPlans] = useState<ISubscriptionPlan[]>([]);
  const [companyPlans, setCompanyPlans] = useState<ISubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const [normalRes, companyRes] = await Promise.all([getSubscriptionNormalPlans(), getSubscriptionCompanyPlans()]);

      const normalData = normalRes.data.subscriptionPlans || [];
      const companyData = companyRes.data.subscriptionPlans || [];

      setNormalPlans(normalData);
      setCompanyPlans(companyData);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
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
        const response = await createSubscriptionPlan(values);
        console.log("Creating Plan:", response);
        setCreateOpen(false);
        fetchPlans(); // Refresh the list
      } catch (error) {
        console.error("Error creating plan:", error);
      }
    }
  };

  const handleEditSubmit = async () => {
    if (validateAll(editValues, setEditFormErrors)) {
      try {
        await updateSubscriptionPlan(editValues.id, editValues);
        setEditOpen(false);
        fetchPlans(); // Refresh the list
      } catch (error) {
        console.error("Error updating plan:", error);
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
      } catch (error) {
        console.error("Error deleting plan:", error);
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

      <div className="flex min-h-screen bg-[#FFF8EA]">
        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Subscription Plans</h1>
                <p className="text-gray-500 font-medium">Manage your platform's subscription tiers and pricing</p>
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
                className="flex items-center gap-2 bg-[#B99F8D] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#B99F8D]/20 hover:bg-[#a68c7a] transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                Create Plan
              </button>
            </div>

            {/* Normal Plan Section */}
            <div className="bg-[#FEF9F0] rounded-[2rem] p-8 shadow-sm border border-[#ECA468]/10 mb-8">
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-1">normal plan</h2>
                <p className="text-sm text-gray-400 font-medium">
                  Quick Play Solo is always free. Manage premium plans below.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FEF3C7] text-left">
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Name</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Price</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Duration</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Features</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {normalPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{plan.name}</td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">${plan.price}</td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-700 capitalize">
                          {plan.duration === 30
                            ? "Monthly"
                            : plan.duration === 365
                              ? "Yearly"
                              : `${plan.duration} Days`}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-wrap gap-2">
                            {plan.features.map((feature, fIndex) => (
                              <span
                                key={fIndex}
                                className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => openEdit(plan)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(plan.id, plan.name)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {/* <div className="mt-6 flex justify-center items-center gap-2">
                <button className="px-3 py-1 text-sm font-bold text-gray-400 hover:text-gray-600">Prev</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-900">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-400">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-400">3</button>
                <span className="text-gray-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-400">10</button>
                <button className="px-3 py-1 text-sm font-bold text-gray-400 hover:text-gray-600">Next</button>
              </div> */}
            </div>

            {/* Company Plan Section */}
            <div className="bg-[#FEF9F0] rounded-[2rem] p-8 shadow-sm border border-[#ECA468]/10">
              <div className="mb-6">
                <h2 className="text-xl font-black text-gray-900 mb-1">company-plan</h2>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FEF3C7] text-left">
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Name</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Price</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Duration</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700">Limit</th>
                      <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-gray-700 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-50">
                    {companyPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{plan.name}</td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">${plan.price}</td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-700 capitalize">
                          {plan.duration === 30
                            ? "Monthly"
                            : plan.duration === 365
                              ? "Yearly"
                              : `${plan.duration} Days`}
                        </td>
                        <td className="py-5 px-6 text-sm font-bold text-gray-700">{plan.userLimit} users</td>
                        <td className="py-5 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => openEdit(plan)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(plan.id, plan.name)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {/* <div className="mt-6 flex justify-center items-center gap-2">
                <button className="px-3 py-1 text-sm font-bold text-gray-400 hover:text-gray-600">Prev</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-400">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-400">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-900">3</button>
                <span className="text-gray-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 text-sm font-bold text-gray-400">10</button>
                <button className="px-3 py-1 text-sm font-bold text-gray-400 hover:text-gray-600">Next</button>
              </div> */}
            </div>
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {isCreateOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-200">
              <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">Create Subscription Plan</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">Add a new tier to the platform</p>
                </div>
                <button onClick={() => setCreateOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-[#FDFBF7] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleCreateChange}
                      placeholder="e.g. Premium"
                      className={`w-full px-6 py-4 bg-white rounded-2xl border ${formErrors.name ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800`}
                    />
                    {formErrors.name && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={values.price}
                      onChange={handleCreateChange}
                      placeholder="e.g. 19.99"
                      className={`w-full px-6 py-4 bg-white rounded-2xl border ${formErrors.price ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800`}
                    />
                    {formErrors.price && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">{formErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={values.duration}
                      onChange={handleCreateChange}
                      className={`w-full px-6 py-4 bg-white rounded-2xl border ${formErrors.duration ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer`}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    {formErrors.duration && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">{formErrors.duration}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Plan Type
                    </label>
                    <select
                      name="type"
                      value={values.type}
                      onChange={handleCreateChange}
                      className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="normal">Normal Plan</option>
                      <option value="company">Company Plan</option>
                    </select>
                  </div>
                  {values.type === "company" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                        Number of Users
                      </label>
                      <input
                        type="number"
                        name="userLimit"
                        value={values.userLimit}
                        onChange={handleCreateChange}
                        placeholder="e.g. 50"
                        className={`w-full px-6 py-4 bg-white rounded-2xl border ${formErrors.userLimit ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800`}
                      />
                      {formErrors.userLimit && (
                        <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">{formErrors.userLimit}</p>
                      )}
                    </div>
                  )}
                  {values.type === "normal" && (
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                        Select Features
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {NORMAL_FEATURES.map((feature) => (
                          <button
                            key={feature}
                            onClick={() => toggleFeature("create", feature)}
                            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all border ${
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
                        <p className="text-red-400 text-[10px] font-bold mt-3 px-1 uppercase">{formErrors.features}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setCreateOpen(false)}
                  className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubmit}
                  className="px-10 py-3 rounded-2xl bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Create Plan
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Edit Modal */}
      {isEditOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-[#ECA468]/10 animate-in zoom-in-95 duration-200">
              <div className="px-10 py-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">Edit Subscription Plan</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">Update plan details and pricing</p>
                </div>
                <button onClick={() => setEditOpen(false)} className="p-2 text-gray-400 hover:text-gray-700">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-[#FDFBF7] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Plan Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editValues.name}
                      onChange={handleEditChange}
                      placeholder="e.g. Premium"
                      className={`w-full px-6 py-4 bg-white rounded-2xl border ${editFormErrors.name ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800`}
                    />
                    {editFormErrors.name && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">{editFormErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editValues.price}
                      onChange={handleEditChange}
                      placeholder="e.g. 19.99"
                      className={`w-full px-6 py-4 bg-white rounded-2xl border ${editFormErrors.price ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800`}
                    />
                    {editFormErrors.price && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">{editFormErrors.price}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={editValues.duration}
                      onChange={handleEditChange}
                      className={`w-full px-6 py-4 bg-white rounded-2xl border ${editFormErrors.duration ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer`}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                    {editFormErrors.duration && (
                      <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">
                        {editFormErrors.duration}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                      Plan Type
                    </label>
                    <select
                      name="type"
                      value={editValues.type}
                      onChange={handleEditChange}
                      className="w-full px-6 py-4 bg-white rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800 appearance-none cursor-pointer"
                    >
                      <option value="normal">Normal Plan</option>
                      <option value="company">Company Plan</option>
                    </select>
                  </div>
                  {editValues.type === "company" && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                        Number of Users
                      </label>
                      <input
                        type="number"
                        name="userLimit"
                        value={editValues.userLimit}
                        onChange={handleEditChange}
                        placeholder="e.g. 50"
                        className={`w-full px-6 py-4 bg-white rounded-2xl border ${editFormErrors.userLimit ? "border-red-400" : "border-gray-100"} outline-none focus:ring-2 focus:ring-[#ECA468]/20 focus:border-[#ECA468] transition-all font-bold text-gray-800`}
                      />
                      {editFormErrors.userLimit && (
                        <p className="text-red-400 text-[10px] font-bold mt-2 px-1 uppercase">
                          {editFormErrors.userLimit}
                        </p>
                      )}
                    </div>
                  )}
                  {editValues.type === "normal" && (
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[#D0864B] mb-2 block px-1">
                        Select Features
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {NORMAL_FEATURES.map((feature) => (
                          <button
                            key={feature}
                            onClick={() => toggleFeature("edit", feature)}
                            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all border ${
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
                        <p className="text-red-400 text-[10px] font-bold mt-3 px-1 uppercase">
                          {editFormErrors.features}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-4">
                <button
                  onClick={() => setEditOpen(false)}
                  className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubmit}
                  className="px-10 py-3 rounded-2xl bg-[#ECA468] text-white text-xs font-black uppercase tracking-widest hover:bg-[#D0864B] shadow-lg shadow-[#ECA468]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Update Plan
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-red-100 animate-in zoom-in-95 duration-200">
              <div className="px-10 py-10 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2">Delete Plan?</h2>
                <p className="text-gray-500 font-medium px-4">
                  Are you sure you want to delete{" "}
                  <span className="text-gray-900 font-black">"{planToDelete?.name}"</span>? This action cannot be
                  undone.
                </p>
              </div>

              <div className="px-10 py-8 bg-gray-50/50 border-t border-gray-100 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setDeleteOpen(false);
                    setPlanToDelete(null);
                  }}
                  className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-10 py-3 rounded-2xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Delete Plan
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
