import React, { useEffect, useState } from "react";
import SideNavbar from "../../components/admin/layout/Navbar/SideNabar";
import { toast } from "react-toastify";
import {
  titleValidation,
  LevelValidation,
  WpmValidation,
  accuracyValidation,
  CategoryValidation,
  textValidation,
} from "../../validations/lessonValidation";
import {
  createLesson,
  getAllLessons,
  fetchLesson,
  updateLesson,
  deleteLesson,
} from "../../api/admin/lessons";
const Lessons: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [values, setValues] = useState({
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });
  const [editValues, setEditValues] = useState({
    id: "",
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });

  const [formErrors, setFormErrors] = useState({
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({
    title: "",
    level: "",
    category: "",
    wpm: "",
    accuracy: "",
    text: "",
  });

  const [lessons, setLessons] = useState<any[]>([]);
  const [isEditOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await getAllLessons();
        if (response && response.data.lessons) {
          setLessons(response.data.lessons);
        }
      } catch (err) {
        console.log("Error fetching lessons:", err);
      }
    };
    fetchLessons();
  }, []);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    let err = "";
    if (name === "title") err = titleValidation(value);
    if (name === "level") err = LevelValidation(value);
    if (name === "category") err = CategoryValidation(value);
    if (name === "wpm") err = WpmValidation(value);
    if (name === "accuracy") err = accuracyValidation(value);
    if (name === "text") err = textValidation(value);

    setFormErrors((prev) => ({ ...prev, [name]: err }));
  }

  function handleEdiChange(e: any) {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    let err = "";
    if (name === "title") err = titleValidation(value);
    if (name === "level") err = LevelValidation(value);
    if (name === "category") err = CategoryValidation(value);
    if (name === "wpm") err = WpmValidation(value);
    if (name === "accuracy") err = accuracyValidation(value);
    if (name === "text") err = textValidation(value);

    setEditFormErrors((prev) => ({ ...prev, [name]: err }));
  }

  async function handleSubmit() {
    const titleError = titleValidation(String(values.title || ""));
    const levelError = LevelValidation(String(values.level || ""));
    const categoryError = CategoryValidation(String(values.category || ""));
    const wpmError = WpmValidation(String(values.wpm || ""));
    const accuracyError = accuracyValidation(String(values.accuracy || ""));
    const textError = textValidation(String(values.text || ""));

    setFormErrors({
      title: titleError,
      level: levelError,
      category: categoryError,
      wpm: wpmError,
      accuracy: accuracyError,
      text: textError,
    });

    if (titleError || levelError || categoryError || wpmError || accuracyError || textError) {
      return;
    }

    try {
      await createLesson(values);
      setOpen(false);
      setValues({
        title: "",
        level: "",
        category: "",
        wpm: "",
        accuracy: "",
        text: "",
      });
      setFormErrors({
        title: "",
        level: "",
        category: "",
        wpm: "",
        accuracy: "",
        text: "",
      });
      toast.success("Lesson created successfully");

      const fetchResponse = await getAllLessons();
      if (fetchResponse && fetchResponse.data.lessons) {
        setLessons(fetchResponse.data.lessons);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error creating lesson");
      console.log("Error creating lesson:", err);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }
    try {
      const response = await deleteLesson(lessonId);
      if (!response) return;
      setLessons((prev) => prev.filter((lesson) => lesson.id !== lessonId));
      toast.success("Lesson deleted successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting lesson");
      console.log(error);
    }
  }

  async function fetch(lessonId: string) {
    try {
      const response = await fetchLesson(lessonId);
      if (!response) return;
      console.log("response",response.data.data)
      const data=response.data.data
      setEditValues({id:data.id,title:data.title,level:data.level,category:data.category,wpm:data.targetWpm,accuracy:data.targetAccuracy,text:data.text});
      setEditOpen(true);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error fetching lesson details");
      console.log(error);
    }
  }
  console.log(editValues)

  async function handleEditSubmit(lessonId: string) {
    const titleError = titleValidation(String(editValues.title || ""));
    const levelError = LevelValidation(String(editValues.level || ""));
    const categoryError = CategoryValidation(String(editValues.category || ""));
    const wpmError = WpmValidation(String(editValues.wpm || ""));
    const accuracyError = accuracyValidation(String(editValues.accuracy || ""));
    const textError = textValidation(String(editValues.text || ""));

    setEditFormErrors({
      title: titleError,
      level: levelError,
      category: categoryError,
      wpm: wpmError,
      accuracy: accuracyError,
      text: textError,
    });

    if (titleError || levelError || categoryError || wpmError || accuracyError || textError) {
      return;
    }

    try {
      const response = await updateLesson(lessonId, editValues);
      if (response?.data?.data) {
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.id === lessonId ? response.data.data : lesson,
          ),
        );
      }
      setEditOpen(false);
      toast.success("Lesson updated successfully");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error updating lesson");
      console.log(error);
    }
  }

  return (
    <>
      <SideNavbar />

      <div className="flex min-h-screen bg-[#FBF7EF]">
        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Lesson Management</h2>
            <p className="text-gray-600 text-sm">
              Manage typing content for Practice, Solo Play, Quick Play, and
              Group Play modes.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Search texts..."
              className="flex-1 px-4 py-2 rounded-md border outline-none focus:ring-2 focus:ring-[#D6B98C]"
            />

            <select className="px-3 py-2 rounded-md border text-sm">
              <option>All Modes</option>
            </select>

            <select className="px-3 py-2 rounded-md border text-sm">
              <option>All Categories</option>
            </select>

            <button
              onClick={() => setOpen(true)}
              className="bg-[#E5B56E] px-4 py-2 rounded-md font-medium"
            >
              + Add Text
            </button>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-[#FFF1D6] p-5 rounded-lg">
                <p className="text-sm text-gray-600">Total Texts</p>
                <h3 className="text-2xl font-bold">4</h3>
              </div>

              <div className="bg-[#FFF1D6] p-5 rounded-lg">
                <p className="text-sm text-gray-600">Sentences</p>
                <h3 className="text-2xl font-bold">1</h3>
              </div>

              <div className="bg-[#FFF1D6] p-5 rounded-lg">
                <p className="text-sm text-gray-600">Paragraphs</p>
                <h3 className="text-2xl font-bold">1</h3>
              </div>
            </div> */}

          {/* Table */}
          <div className="bg-[#FFF1D6] rounded-lg p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Lessons</h3>
              <p className="text-sm text-gray-600">4 of 4 texts</p>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 border-b">
                  {/* <th className="pb-2">ID</th> */}
                  <th>Difficulty</th>
                  <th>Category</th>
                  <th>Preview</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-800">
                {lessons &&
                  lessons.map((lesson) => (
                    <tr key={lesson.id} className="border-b text-start">
                      <td>
                        <span className="px-2 py-1 bg-blue-100 rounded text-xs">
                          {lesson.level}
                        </span>
                      </td>
                      <td>
                        <span className="px-2 py-1 bg-yellow-100 rounded text-xs">
                          {lesson.category}
                        </span>
                      </td>
                      <td>{lesson.text.slice(0, 10)}...</td>
                      <td>{new Date(lesson.createdAt).toLocaleDateString()}</td>
                      <td className="flex gap-3 py-3">
                        <button
                          onClick={() => fetch(lesson.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Modal Container */}
          <div className="w-full max-w-3xl bg-[#FBF7EF] rounded-xl shadow-xl p-8">
            {/* Header */}
            <h2 className="text-xl font-bold mb-6">Create New Lesson</h2>
            {/* Title */}
            <div className="mb-5">
              <label className="text-sm font-medium block mb-2">Title</label>
              <input
                type="text"
                value={values.title}
                name="title"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md border outline-none focus:ring-2 focus:ring-[#D6B98C]"
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            {/* <div className="mb-5">
                <label className="text-sm font-medium block mb-2">
                  Description
                </label>
                <textarea
                  value={values.Description}
                  rows={3}
                  name="Description"
                    onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border outline-none resize-none focus:ring-2 focus:ring-[#D6B98C]"
                />
              </div> */}

            {/* Level & Category */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium block mb-2">Level</label>
                <select
                  value={values.level}
                  onChange={handleChange}
                  name="level"
                  className="w-full px-4 py-2 rounded-md border outline-none bg-white"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {formErrors.level && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Category
                </label>
                <select
                  value={values.category}
                  name="category"
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border outline-none bg-[#FFF3DB] text-gray-600"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="sentence">Sentence</option>
                  <option value="paragraph">Paragraph</option>
                </select>
                {formErrors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>
            </div>

            {/* WPM & Accuracy */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium block mb-2">WPM</label>
                <input
                  type="number"
                  value={values.wpm}
                  name="wpm"
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  className="w-full px-4 py-2 rounded-md border bg-[#FFF3DB] outline-none"
                />
                {formErrors.wpm && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.wpm}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Accuracy
                </label>
                <input
                  type="number"
                  name="accuracy"
                  onChange={handleChange}
                  value={values.accuracy}
                  placeholder="e.g. 90"
                  className="w-full px-4 py-2 rounded-md border bg-[#FFF3DB] outline-none"
                />
                {formErrors.accuracy && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.accuracy}
                  </p>
                )}
              </div>
            </div>

            {/* Practice Text */}
            <div className="mb-8">
              <label className="text-sm font-medium block mb-2">
                Practice Text
              </label>
              <textarea
                rows={5}
                value={values.text}
                name="text"
                onChange={handleChange}
                placeholder="Enter the text students will practice..."
                className="w-full px-4 py-3 rounded-md border outline-none resize-none focus:ring-2 focus:ring-[#D6B98C]"
              />
              {formErrors.text && (
                <p className="text-red-500 text-xs mt-1">{formErrors.text}</p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 rounded-md text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Create Lesson
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit lesson */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* Modal Container */}
          <div className="w-full max-w-3xl bg-[#FBF7EF] rounded-xl shadow-xl p-8">
            {/* Header */}
            <h2 className="text-xl font-bold mb-6">Edit Lesson</h2>
            {/* Title */}
            <div className="mb-5">
              <label className="text-sm font-medium block mb-2">Title</label>
              <input
                type="text"
                value={editValues.title}
                name="title"
                onChange={handleEdiChange}
                className="w-full px-4 py-2 rounded-md border outline-none focus:ring-2 focus:ring-[#D6B98C]"
              />
              {editFormErrors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {editFormErrors.title}
                </p>
              )}
            </div>

            {/* Description */}
            {/* <div className="mb-5">
                <label className="text-sm font-medium block mb-2">
                  Description
                </label>
                <textarea
                  value={values.Description}
                  rows={3}
                  name="Description"
                    onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border outline-none resize-none focus:ring-2 focus:ring-[#D6B98C]"
                />
              </div> */}

            {/* Level & Category */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium block mb-2">Level</label>
                <select
                  value={editValues.level}
                  onChange={handleEdiChange}
                  name="level"
                  className="w-full px-4 py-2 rounded-md border outline-none bg-white"
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                {editFormErrors.level && (
                  <p className="text-red-500 text-xs mt-1">
                    {editFormErrors.level}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Category
                </label>
                <select
                  value={editValues.category}
                  name="category"
                  onChange={handleEdiChange}
                  className="w-full px-4 py-2 rounded-md border outline-none bg-[#FFF3DB] text-gray-600"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="sentence">Sentence</option>
                  <option value="paragraph">Paragraph</option>
                </select>
                {editFormErrors.category && (
                  <p className="text-red-500 text-xs mt-1">
                    {editFormErrors.category}
                  </p>
                )}
              </div>
            </div>

            {/* WPM & Accuracy */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-medium block mb-2">WPM</label>
                <input
                  type="number"
                  value={editValues.wpm}
                  name="wpm"
                  onChange={handleEdiChange}
                  placeholder="e.g. 60"
                  className="w-full px-4 py-2 rounded-md border bg-[#FFF3DB] outline-none"
                />
                {editFormErrors.wpm && (
                  <p className="text-red-500 text-xs mt-1">
                    {editFormErrors.wpm}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">
                  Accuracy
                </label>
                <input
                  type="number"
                  name="accuracy"
                  onChange={handleEdiChange}
                  value={editValues.accuracy}
                  placeholder="e.g. 90"
                  className="w-full px-4 py-2 rounded-md border bg-[#FFF3DB] outline-none"
                />
                {editFormErrors.accuracy && (
                  <p className="text-red-500 text-xs mt-1">
                    {editFormErrors.accuracy}
                  </p>
                )}
              </div>
            </div>

            {/* Practice Text */}
            <div className="mb-8">
              <label className="text-sm font-medium block mb-2">
                Practice Text
              </label>
              <textarea
                rows={5}
                value={editValues.text}
                name="text"
                onChange={handleEdiChange}
                placeholder="Enter the text students will practice..."
                className="w-full px-4 py-3 rounded-md border outline-none resize-none focus:ring-2 focus:ring-[#D6B98C]"
              />
              {editFormErrors.text && (
                <p className="text-red-500 text-xs mt-1">
                  {editFormErrors.text}
                </p>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setEditOpen(false)}
                className="px-6 py-2 rounded-md text-gray-600 hover:text-black"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditSubmit(editValues.id)}
                className="px-8 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Edit Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default Lessons;
