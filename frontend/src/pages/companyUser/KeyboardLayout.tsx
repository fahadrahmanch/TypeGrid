import React, { useState } from "react";
import CompanyUserNavbar from "../../components/companyUser/layout/companyUserNavbar";
import { 
  Keyboard as KeyboardIcon, 
  Info, 
  CheckCircle2, 
  X, 
  Save, 
  Eye,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setKeyboardLayout as updateLayoutState } from "../../store/slices/auth/authSlice";
import { setKeyboardLayout } from "../../api/companyUser/keyboard";
import { RootState } from "../../store/store";
import { useEffect } from "react";

type LayoutType = "qwerty" | "azerty" | "dvorak";

interface LayoutInfo {
  id: LayoutType;
  title: string;
  keys: string[];
  description: string;
  details: string;
  fullLayout: string[][];
}

const layouts: LayoutInfo[] = [
  {
    id: "qwerty",
    title: "QWERTY Layout",
    keys: ["Q", "W", "E", "R", "T", "Y"],
    description: "Default layout used worldwide.",
    details: "Most common keyboard layout, ideal for beginners and standard typing.",
    fullLayout: [
      ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
      ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"]
    ]
  },
  {
    id: "azerty",
    title: "AZERTY Layout",
    keys: ["A", "Z", "E", "R", "T", "Y"],
    description: "Common in France and Belgium.",
    details: "Designed for French language typing with optimized symbol placement.",
    fullLayout: [
      ["²", "&", "é", "\"", "'", "(", "-", "è", "_", "ç", "à", ")", "="],
      ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P", "^", "$"],
      ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M", "ù", "*"],
      ["W", "X", "C", "V", "B", "N", ",", ";", ":", "!"]
    ]
  },
  {
    id: "dvorak",
    title: "DVORAK Layout",
    keys: ["'", ",", ".", "P", "Y", "F"],
    description: "Optimized for faster typing and comfort.",
    details: "Reduces finger movement and strain, potentially increasing typing speed.",
    fullLayout: [
      ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]"],
      ["'", ",", ".", "P", "Y", "F", "G", "C", "R", "L", "/", "=", "\\"],
      ["A", "O", "E", "U", "I", "D", "H", "T", "N", "S", "-"],
      [";", "Q", "J", "K", "X", "B", "M", "W", "V", "Z"]
    ]
  }
];

const KeyboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const currentLayout = useSelector((state: RootState) => state.auth.keyboardLayout) as LayoutType;
  const [tempSelected, setTempSelected] = useState<LayoutType>(currentLayout);
  const [isDefault, setIsDefault] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewId, setPreviewId] = useState<LayoutType>(tempSelected);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTempSelected(currentLayout);
  }, [currentLayout]);

  const activeLayout = layouts.find(l => l.id === previewId) || layouts[0];

  const handleSave = async (layoutId?: LayoutType) => {
    const finalLayout = layoutId || tempSelected;
    setIsSaving(true);
    
    try {
      await setKeyboardLayout(finalLayout);
      dispatch(updateLayoutState(finalLayout));
      if (layoutId) setTempSelected(layoutId);
      toast.success(`${finalLayout.toUpperCase()} layout applied successfully!`);
    } catch (error) {
      console.error("Error saving keyboard layout:", error);
      toast.error("Failed to save keyboard layout");
    } finally {
      setIsSaving(false);
    }
  };

  const openPreview = (e: React.MouseEvent, id: LayoutType) => {
    e.stopPropagation();
    setPreviewId(id);
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] pt-24 pb-12 px-8">
      <CompanyUserNavbar />
      
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight font-jaini">
            Choose Your Keyboard Layout
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Select the keyboard layout you're most comfortable with for typing practice and competitions.
          </p>
        </div>

        {/* Layout Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {layouts.map((layout) => (
            <div key={layout.id} className="relative flex flex-col items-center">
              {/* Tooltip-like label above card */}
              <div className="mb-6 h-12 flex items-center justify-center">
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center opacity-0 hover:opacity-100 transition-opacity">
                  {layout.details}
                </p>
              </div>

              <div 
                onClick={() => handleSave(layout.id as LayoutType)}
                className={`w-full bg-white rounded-3xl p-8 border-2 transition-all duration-500 relative flex flex-col gap-6 cursor-pointer
                  ${tempSelected === layout.id 
                    ? "border-[#2563EB] shadow-2xl shadow-blue-100/50 scale-[1.02]" 
                    : "border-transparent shadow-lg hover:shadow-xl hover:-translate-y-1 group"}`}
              >
                {tempSelected === layout.id && (
                  <div className="absolute -top-3 -right-3 bg-[#2563EB] text-white p-2 rounded-full shadow-lg z-10 animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{layout.title}</h3>
                  <button 
                    onClick={(e) => openPreview(e, layout.id as KeyboardLayoutType)}
                    className="text-gray-400 hover:text-[#2563EB] transition-colors"
                  >
                    <Info className="w-5 h-5" />
                  </button>
                </div>

                {/* Key Visualization */}
                <div className="flex gap-2 justify-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 group-hover:bg-blue-50/30 transition-colors">
                  {layout.keys.map((key, idx) => (
                    <div key={idx} className={`w-10 h-10 bg-white border rounded-lg flex items-center justify-center text-sm font-bold shadow-sm transition-all
                      ${tempSelected === layout.id ? "border-blue-200 text-blue-600" : "border-gray-200 text-gray-700"}`}>
                      {key}
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-500 font-medium">
                  {layout.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(layout.id as LayoutType);
                  }}
                  disabled={isSaving && tempSelected === layout.id}
                  className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2
                    ${tempSelected === layout.id 
                      ? "bg-[#2563EB] text-white shadow-lg shadow-blue-500/30" 
                      : "bg-[#F3F4F6] text-gray-600 group-hover:bg-gray-200"}`}
                >
                  {isSaving && tempSelected === layout.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : tempSelected === layout.id ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Selected
                    </>
                  ) : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Options */}
        <div className="flex flex-col items-center gap-8 py-8 border-t border-gray-100">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={isDefault}
                onChange={() => setIsDefault(!isDefault)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#2563EB] peer-checked:border-[#2563EB] transition-all"></div>
              {isDefault && <CheckCircle2 className="absolute inset-0 w-3.5 h-3.5 text-white m-auto" />}
            </div>
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
              Set as default layout for all sessions
            </span>
          </label>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleSave()}
              disabled={isSaving}
              className="px-10 py-4 bg-[#2563EB] hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              {isSaving ? "Saving..." : "Save & Continue"}
            </button>
            <button
              onClick={(e) => openPreview(e, tempSelected)}
              className="text-[#2563EB] font-bold text-sm hover:underline flex items-center gap-1 group"
            >
              Preview Layout
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-5xl overflow-hidden shadow-3xl animate-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-6 right-8 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-12 space-y-12">
              <h2 className="text-2xl font-extrabold text-[#111827] flex items-center gap-3 uppercase tracking-tight">
                {activeLayout.title.split(' ')[0]} <span className="text-gray-400 font-medium">Keyboard Layout</span>
              </h2>

              <div className="bg-[#F8FAFC] p-10 rounded-[28px] space-y-3 shadow-inner">
                {activeLayout.fullLayout.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2.5 justify-center">
                    {row.map((key, keyIdx) => (
                      <div 
                        key={keyIdx} 
                        className={`min-w-[52px] h-[52px] bg-white border border-gray-200 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm transition-transform hover:scale-110
                          ${key === "^" || key === "$" ? "text-gray-400" : "text-[#1F2937]"}`}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                ))}
                {/* Space bar row */}
                <div className="flex justify-center pt-2">
                  <div className="w-[380px] h-[52px] bg-white border border-gray-200 rounded-xl flex items-center justify-center text-[10px] font-bold text-gray-300 tracking-[0.2em] shadow-sm uppercase">
                    Space
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsPreviewOpen(false)}
                className="w-full py-5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-500/20"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyboardLayout;
