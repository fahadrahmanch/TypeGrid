const CompanyVerificationFormDiv: React.FC = () => {
    return (
        <>
            <div className="min-h-screen  flex items-center justify-center p-4">
                {/* Main Card Container */}
                <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Details</h1>
                        <p className="text-gray-500 text-sm">Submit your information for verification</p>
                    </div>
                    {/* Form Fields */}
                    <form className="space-y-5">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Your company name"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
                            />
                        </div>
                        {/* Address */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                                Address *
                            </label>
                            <input
                                type="text"
                                placeholder="Street address, city, state, zip"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
                            />
                        </div>
                        {/* Contact Person Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                                Contact Person Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Full name"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
                            />
                        </div>
                        {/* Contact Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                                Contact Email *
                            </label>
                            <input
                                type="email"
                                placeholder="email@company.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
                            />
                        </div>
                        {/* Contact Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-900 mb-2 text-start">
                                Contact Phone *
                            </label>
                            <input
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all placeholder-gray-400 text-gray-700"
                            />
                        </div>
                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="button"
                                className="w-full bg-[#1C5CE5] hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                Submit for Verification
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}
export default CompanyVerificationFormDiv