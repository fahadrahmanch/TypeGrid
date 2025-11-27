interface CompanyDetailsModalProps {
  //   isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  //   company: any;
}
const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  setOpen,
}) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Company Details
          </h2>
          {/* Company Info */}
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-semibold">Name:</span> Brottpe
            </p>
            <p>
              <span className="font-semibold">Email:</span> ff^4@gmail.com
            </p>
            <p>
              <span className="font-semibold">Phone:</span>812968992
            </p>
            <p>
              <span className="font-semibold">Address:</span> wandoor
            </p>

            <p>
              <span className="font-semibold">Registered On:</span> 10
            </p>

            <p className="font-semibold">Documents:</p>
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-sm">
                Doc 1
              </div>
              <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-sm">
                Doc 2
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              // onClick={}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
            <button
              // onClick={}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CompanyDetailsModal;
