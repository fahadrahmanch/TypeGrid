const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF8EA]">
      <div className="w-12 h-12 border-4 border-[#7A6A5D] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-gray-600">Loading, please wait...</p>
    </div>
  );
};

export default LoadingPage;
