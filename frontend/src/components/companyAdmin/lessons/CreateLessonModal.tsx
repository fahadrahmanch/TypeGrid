import React, { useState } from 'react';
// import { X } from 'lucide-react';
import { createLesson } from '../../../api/companyAdmin/lessons';
import { titleValidation, LevelValidation, WpmValidation, accuracyValidation, CategoryValidation, textValidation } from '../../../validations/lessonValidation';
import { toast } from 'react-toastify';
interface CreateLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    setLessons: (lessons: any) => any;
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({ isOpen, onClose, setLessons }) => {
    if (!isOpen) return null;
    const [values, setValues] = useState({
        title: "",
        description: "",
        level: "",
        wpm: "",
        text: "",
        accuracy: "",
        category: "",
    })
    const [error, setError] = useState({ title: "", level: "", wpm: "", accuracy: "", category: "", text: "" });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(name=='title'){
            setError({ ...error, title: titleValidation(value) });
            
        }
        // if(name=='description'){
        //     setError({ ...error, description: DescriptionValidation(value) });
        // }
        if(name=='level'){
            setError({ ...error, level: LevelValidation(value) });
        }
        if(name=='wpm'){
            setError({ ...error, wpm: WpmValidation(value) });
        }
        if(name=='accuracy'){
            setError({ ...error, accuracy: accuracyValidation(value) });
        }
        if(name=='category'){
            setError({ ...error, category: CategoryValidation(value) });
        }
        if(name=='text'){
            setError({ ...error, text: textValidation(value) });
        }
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,  
        }));
    };
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
         const titleErr = titleValidation(values.title);
            // const descriptionErr = DescriptionValidation(values.description);
            const levelErr = LevelValidation(values.level);
            const wpmErr = WpmValidation(values.wpm);
            const accuracyErr = accuracyValidation(values.accuracy);
            const categoryErr = CategoryValidation(values.category);
            const textErr = textValidation(values.text);
        
            setError({
              title: titleErr,
              // description: descriptionErr,
              level: levelErr,
              wpm: wpmErr,
              accuracy: accuracyErr,
              category: categoryErr,
              text: textErr,
            });
              if (
    titleErr ||
    // descriptionErr ||
    levelErr ||
    wpmErr ||
    accuracyErr ||
    categoryErr ||
    textErr
  ) {
    return;
  }
        try {
            const response = await createLesson(values);
            if(!response)return toast.error("Something went wrong");
            toast.success("Lesson created successfully");
            setLessons((prevLessons: any) => [...prevLessons, response.data.lesson]);
            onClose();
        }
        catch (error: any) {
            toast.error(error.response.data.message);
            console.log(error);
        }
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Lesson</h2>

                    <div className="space-y-6">
                        {/* Lesson Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Type</label>
                            <button className="w-full md:w-auto px-6 py-2 bg-blue-50 border border-blue-200 text-blue-600 rounded-lg font-medium text-sm">
                                Custom Lesson
                            </button>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={values.title}

                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                            {error.title && <p className="text-red-500 text-sm mt-1">{error.title}</p>}
                        </div>

                        {/* Description */}
                        {/* <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                rows={3}
                                name="description"
                                value={values.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                            />
                            {error.description && <p className="text-red-500 text-sm mt-1">{error.description}</p>}
                        </div> */}

                        {/* Row 1: Level & Duration */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                                <select name="level" value={values.level} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                                    <option value="">Select Level</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                                {error.level && <p className="text-red-500 text-sm mt-1">{error.level}</p>}
                            </div>
                           
                        </div>

                        {/* Row 2: Date, WPM, Accuracy */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">WPM</label>
                                <input
                                    type="number"
                                    name="wpm"
                                    value={values.wpm}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 60"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-[#fffcf4]"
                                />
                                {error.wpm && <p className="text-red-500 text-sm mt-1">{error.wpm}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">accuracy</label>
                                <input
                                    type="number"
                                    name="accuracy"
                                    value={values.accuracy}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 60"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-[#fffcf4]"
                                />
                                {error.accuracy && <p className="text-red-500 text-sm mt-1">{error.accuracy}</p>}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select name="category" value={values.category} onChange={handleInputChange} className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-[#fffcf4]">
                                <option value="">Select category</option>
                                <option value="paragraph">paragraph</option>
                                <option value="sentence">sentences</option>
                            </select>
                            {error.category && <p className="text-red-500 text-sm mt-1">{error.category}</p>}
                        </div>

                        {/* Practice Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Practice Text</label>
                            <textarea
                                rows={6}
                                name="text"
                                value={values.text}
                                onChange={handleInputChange}
                                placeholder="Enter the text students will practice..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                            />
                            {error.text && <p className="text-red-500 text-sm mt-1">{error.text}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                            Create Lesson
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateLessonModal;
