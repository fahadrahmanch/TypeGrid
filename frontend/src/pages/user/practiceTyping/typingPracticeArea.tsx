import { useEffect, useState } from "react";
import Navbar from "../../../components/user/Navbar";
import { useParams } from "react-router-dom";
import { getTypiingPracticeLessonById } from "../../../api/user/typingPracticeService";
const TypingPracticeArea = () => {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const [Content, setContent] = useState<any>(null);
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [time, setTime] = useState(0);
  const [errors, setErrors] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsfinished] = useState(false);

  useEffect(() => {
    async function fetchLessonById() {
      if (lessonId) {
        const response = await getTypiingPracticeLessonById(lessonId);
        setContent(response.data.lesson);
      }
    }
    fetchLessonById();
  }, []);
  useEffect(() => {
    if (!startTime || isFinished) return;

    const interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setTime(elapsedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isFinished]);

  useEffect(() => {
    if (!Content || !startTime) {
      return;
    }

    const orginalText = Content.text;
    let errorCount = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] != orginalText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    const elaspedTime = (Date.now() - startTime) / 1000;
    const minutes =elaspedTime/60; 
    const correctChars = typedText.length - errorCount;
    const calculatedWpm=minutes>0?Math.round((correctChars/5)/minutes):0;
    setWpm(isFinite(calculatedWpm) ? calculatedWpm : 0);
    const calculatedAccuracy = typedText.length
      ? Math.floor((correctChars / typedText.length) * 100)
      : 100;
    setAccuracy(calculatedAccuracy);
  }, [typedText]);

   
  const renderTextWithHighlight=()=>{
    if(!Content)return null;
    return Content.text.split("").map((char:string,index:number)=>{
      let color="text-gray-400";
      let bg = "";
      if(index<typedText.length){
        if(typedText[index]==char){
          bg = "bg-green-200";
          color = "text-green-600";
          
        }else{
          bg = "bg-red-200";
          color = "text-red-500";
        }
      }
      
        return (
     <span
        key={index}
        className={`
          ${bg} ${color}
          inline-flex items-center justify-center
           h-[24px]
           mx-[1px]
          rounded-sm
          font-mono
        `}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    );
    });
  };



  useEffect(()=>{
    const handleKeyDown=(e:KeyboardEvent)=>{
      e.preventDefault();
      if(!Content||isFinished)return;
      if(!startTime){
        setStartTime(Date.now());
      }
          if (e.key === "Backspace") {
      setTypedText((prev) => prev.slice(0, -1));
      return;
    }

      if(e.key.length===1){
        setTypedText((prev)=>prev+e.key);
        if(typedText.length+1===Content.text.length){
          setIsfinished(true);
        }
      }
  };
    window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);

}, [Content, isFinished, startTime, typedText]);
useEffect(() => {
  if (!Content) return;
  if (typedText.length === Content.text.length) {
    setIsfinished(true);
  }
}, [typedText, Content]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#FFF6E8] flex justify-center py-20">
        <div className="w-full max-w-5xl px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              TypeGrid Practice
            </h1>
            <p className="text-gray-600 mt-2">
              Improve your typing speed and accuracy with our comprehensive
              practice system. Choose your difficulty level and practice
              category to get started.
            </p>
          </div>

          {/* Stats */}

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Time", value: `${time}s` },
              { label: "WPM", value: wpm },
              { label: "Accuracy", value: `${accuracy}%` },
              { label: "Errors", value: errors },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-[#FFF1D8] rounded-lg p-5 text-center shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900">
                  {item.value}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-1 bg-[#7A6A5D] rounded-full mb-6"></div>

     

          {/* Typing Test */}
          <div className="bg-[#FFF1D8] rounded-xl p-6 shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Typing Test
              </h2>

           

            <div className="flex space-x-3 items-center mb-4">
               <p className="px-4 py-1.5 border border-green-500 text-green-600 rounded-md text-sm font-medium bg-green-50">
              {Content?.level === "beginner"
                ? "Easy"
                : Content?.level === "intermediate"
                ? "Medium"
                : Content
                ? "Hard"
                : "Loading..."}
            </p>
            <p className="px-4 py-1.5 border border-gray-300 text-gray-600 rounded-md text-sm">
              {Content?.category}
            </p>
              <button className="text-sm px-3 py-1.5 bg-[#7A6A5D] text-white rounded-md">
                Reset
              </button>

            </div>
            </div>
            

            <div className="bg-[#FFF6E8] p-5 rounded-md text-lg leading-relaxed font-mono text-left">
              {renderTextWithHighlight()}
            </div>

           <p className="text-center text-xs text-gray-500 mt-3">Start typing anywhere on the keyboard</p>

          </div>

          
        </div>
      </div>
    </>
  );
};

export default TypingPracticeArea;
