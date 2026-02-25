import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { X, Calendar, Clock, Trash, Plus, Users, Globe } from "lucide-react";
import { getCompanyGroups } from "../../../api/companyAdmin/companyGroup";
import { createCompanyContest } from "../../../api/companyAdmin/companyContextAPI";
interface CreateContestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface RewardRank {
    rank: number;
    place: string;
    type: string;
    prize: string;
}

const CreateContestModal: React.FC<CreateContestModalProps> = ({ isOpen, onClose }) => {
    const [contestMode, setContestMode] = useState<"group" | "open">("group");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetGroup, setTargetGroup] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [textSource, setTextSource] = useState<"manual" | "random">("manual");
    const [contestText, setContestText] = useState("");
    const [date, setDate] = useState("");
    const [duration, setDuration] = useState("30"); // minutes
    const [maxParticipants, setMaxParticipants] = useState("10");
    const [companyGroups, setCompanyGroups] = useState([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [startTime,setStartTime]=useState("");
    // Reward Management State
    const [rewards, setRewards] = useState<RewardRank[]>([
        { rank: 1, place: "1st Place", type: "Money ($)", prize: "" },
        { rank: 2, place: "2nd Place", type: "Money ($)", prize: "" },
        { rank: 3, place: "3rd Place", type: "Money ($)", prize: "" },
    ]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!title.trim() || title.length < 3) {
            newErrors.title = "Contest name must be at least 3 characters.";
        }
        if (!description.trim() || description.length < 10) {
            newErrors.description = "Description must be at least 10 characters.";
        }
        if (contestMode === "group" && !targetGroup) {
            newErrors.targetGroup = "Please select a target group.";
        }
        if (textSource === "manual" && (!contestText.trim() || contestText.length < 10)) {
            newErrors.contestText = "Contest text must be at least 10 characters.";
        }
        if (!date) {
            newErrors.date = "Please select a date.";
        } else {
            const selectedDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
            if (selectedDate < today) {
                newErrors.date = "Date cannot be in the past.";
            }
        }
        if (!duration || parseInt(duration) <= 0) {
            newErrors.duration = "Duration must be a positive number.";
        }
        if (!maxParticipants || parseInt(maxParticipants) <= 0) {
            newErrors.maxParticipants = "Participants must be a positive number.";
        }

        // validate rewards
        const rewardErrors: string[] = [];
        rewards.forEach((reward) => {
            if (!reward.prize.trim()) {
                rewardErrors.push(`Reward for ${reward.place} is required.`);
            }
        });
        if (rewardErrors.length > 0) {
            newErrors.rewards = "All reward values must be filled.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateContest = async () => {
        if (validateForm()) {
            let data;
            if (contestMode === "group" && !contestText) {

                data = {
                    contestMode,
                    title,
                    description,
                    targetGroup,
                    difficulty,
                    textSource,
                    startTime,
                    date,
                    duration,
                    maxParticipants,
                    rewards
                };
            } else if (contestMode === "open" && !contestText) {
                data = {
                    contestMode,
                    title,
                    description,
                    difficulty,
                    textSource,
                    startTime,
                    // endTime,
                    date,
                    duration,
                    maxParticipants,
                    rewards
                };
            } else if (contestMode === "open" && contestText) {
                data = {
                    contestMode,
                    title,
                    description,
                    difficulty,
                    textSource,
                    contestText,
                    startTime,
                    // endTime,
                    date,
                    duration,
                    maxParticipants,
                    rewards
                };
            } else if (contestMode === "group" && contestText) {
                data = {
                    contestMode,
                    title,
                    description,
                    targetGroup,
                    difficulty,
                    textSource,
                    contestText,
                    date,
                    duration,
                    maxParticipants,
                    rewards
                };
            }
            const response = await createCompanyContest(data);
            if (response) {
                toast.success("Contest created successfully");
                setTextSource("manual");
                setTitle("");
                setDescription("");
                setDifficulty("");
                setContestText("");
                setDate("");
                setDuration("");
                setMaxParticipants("");
                setRewards([
                    { rank: 1, place: "1st Place", type: "Money ($)", prize: "" },
                    { rank: 2, place: "2nd Place", type: "Money ($)", prize: "" },
                    { rank: 3, place: "3rd Place", type: "Money ($)", prize: "" },
                ]);
            } else {
                toast.error("Failed to create contest");
            }
            onClose(); // Or keep open based on logic
        } else {
            toast.error("Form has errors");
        }
    };

    const handleAddReward = () => {
        const nextId = rewards.length + 1;
        setRewards([
            ...rewards,
            { rank: Date.now(), place: `${nextId}th Place`, type: "Money ($)", prize: "" }
        ]);
    };

    const handleRemoveReward = (rank: number) => {
        setRewards(rewards.filter(r => r.rank !== rank));
    };

    const handleRewardChange = (rank: number, field: keyof RewardRank, value: string) => {
        setRewards(rewards.map(r => r.rank === rank ? { ...r, [field]: value } : r));
    };

    useEffect(() => {
        async function fetchGroups() {
            try {
                const response = await getCompanyGroups();
                const groups = response.data.groups;
                if (!groups) return;
                setCompanyGroups(groups);
            } catch (error) {
                console.error("Failed to fetch groups", error);
            }
        }
        fetchGroups();
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto pt-10 pb-10">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl scale-100 transition-all my-auto relative flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Contest</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">

                    {/* Contest Mode Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700 block">Contest Mode</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setContestMode("group")}
                                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${contestMode === "group"
                                    ? "border-blue-600 bg-blue-50/50"
                                    : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className={`w-5 h-5 ${contestMode === "group" ? "text-blue-600" : "text-gray-500"}`} />
                                    <span className={`font-bold ${contestMode === "group" ? "text-blue-900" : "text-gray-700"}`}>Group Contest</span>
                                </div>
                                <p className="text-xs text-gray-500 text-left">Only selected groups can participate</p>
                            </button>

                            <button
                                onClick={() => setContestMode("open")}
                                className={`flex flex-col items-start p-4 rounded-xl border-2 transition-all ${contestMode === "open"
                                    ? "border-blue-600 bg-blue-50/50"
                                    : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className={`w-5 h-5 ${contestMode === "open" ? "text-blue-600" : "text-gray-500"}`} />
                                    <span className={`font-bold ${contestMode === "open" ? "text-blue-900" : "text-gray-700"}`}>Open Contest</span>
                                </div>
                                <p className="text-xs text-gray-500 text-left">First users to book can join</p>
                            </button>
                        </div>
                    </div>

                    {/* Contest Name */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Contest Name</label>
                            <input
                                type="text"
                                placeholder="Enter contest name"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    if (errors.title) setErrors({ ...errors, title: "" });
                                }}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm ${errors.title ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        {/* Templates */}
                        <div className="flex flex-wrap gap-2">
                            {["Speed Typing Championship", "Accuracy Challenge", "Beginner Bootcamp", "Advanced Masters", "Weekly Sprint"].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setTitle(tag);
                                        if (errors.title) setErrors({ ...errors, title: "" });
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            placeholder="Describe the contest..."
                            rows={3}
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors({ ...errors, description: "" });
                            }}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm resize-none ${errors.description ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Target Group (Only for Group Contest) */}
                    {contestMode === "group" && (
                        <div className="space-y-2 animate-fadeIn">
                            <label className="text-sm font-semibold text-gray-700">Target Group</label>
                            <div className="relative">
                                <select
                                    value={targetGroup}
                                    onChange={(e) => {
                                        setTargetGroup(e.target.value);
                                        if (errors.targetGroup) setErrors({ ...errors, targetGroup: "" });
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm appearance-none cursor-pointer ${errors.targetGroup ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                                >
                                    <option value="" disabled>Select a group</option>
                                    {companyGroups.map((group: any) => (
                                        <option key={group._id} value={group._id}>
                                            {group.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                            {errors.targetGroup && <p className="text-red-500 text-xs mt-1">{errors.targetGroup}</p>}
                        </div>
                    )}

                    {/* Difficulty Level */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
                        <div className="grid grid-cols-3 gap-3">
                            {["easy", "medium", "hard"].map(level => (
                                <button
                                    key={level}
                                    onClick={() => setDifficulty(level)}
                                    className={`py-2.5 text-sm font-medium rounded-xl border transition-all ${difficulty === level
                                        ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Text Source */}
                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-gray-700">Text Source</label>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${textSource === "manual" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                                    {textSource === "manual" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <input
                                    type="radio"
                                    name="textSource"
                                    value="manual"
                                    checked={textSource === "manual"}
                                    onChange={() => setTextSource("manual")}
                                    className="hidden"
                                />
                                <span className="text-sm text-gray-700">Manual Entry</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${textSource === "random" ? "border-blue-600" : "border-gray-300 group-hover:border-blue-400"}`}>
                                    {textSource === "random" && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <input
                                    type="radio"
                                    name="textSource"
                                    value="random"
                                    checked={textSource === "random"}
                                    onChange={() => { setTextSource("random"); setContestText(""); }}
                                    className="hidden"
                                />
                                <span className="text-sm text-gray-700">Random pick</span>
                            </label>
                        </div>
                    </div>

                    {/* Contest Text (If Manual) */}
                    {textSource === "manual" && (
                        <div className="space-y-2 animate-fadeIn">
                            <label className="text-sm font-semibold text-gray-700">Contest Text</label>
                            <textarea
                                placeholder="Enter the text that participants will type..."
                                rows={4}
                                value={contestText}
                                onChange={(e) => {
                                    setContestText(e.target.value);
                                    if (errors.contestText) setErrors({ ...errors, contestText: "" });
                                }}
                                className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm resize-none font-mono ${errors.contestText ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                            />
                            {errors.contestText && <p className="text-red-500 text-xs mt-1">{errors.contestText}</p>}
                        </div>
                    )}

                    {/* Date & Duration */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        if (errors.date) setErrors({ ...errors, date: "" });
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm ${errors.date ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                                />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Duration (minutes)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={duration}
                                    onChange={(e) => {
                                        setDuration(e.target.value);
                                        if (errors.duration) setErrors({ ...errors, duration: "" });
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm ${errors.duration ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                                />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                        </div>
                    </div>

                    {/* Start Time & End Time (Placeholders for now, can be computed or inputs) */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => {
                                    setStartTime(e.target.value);
                                    if (errors.startTime) setErrors({ ...errors, startTime: "" });
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                        {/* <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => {
                                    setEndTime(e.target.value);
                                    if (errors.endTime) setErrors({ ...errors, endTime: "" });
                                }}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div> */}
                    </div>

                    {/* Max Participants */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Maximum Participants</label>
                        <input
                            type="number"
                            value={maxParticipants}
                            onChange={(e) => {
                                setMaxParticipants(e.target.value);
                                if (errors.maxParticipants) setErrors({ ...errors, maxParticipants: "" });
                            }}
                            className={`w-full px-4 py-3 rounded-xl bg-gray-50 border focus:outline-none focus:ring-2 transition-all text-sm ${errors.maxParticipants ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-gray-200 focus:ring-blue-500/20 focus:border-blue-500"}`}
                        />
                        {errors.maxParticipants && <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>}
                    </div>

                    {/* Reward/Point Management */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-md font-bold text-gray-900">Reward /Point Management</h3>
                            <button
                                onClick={handleAddReward}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add Custom Rank
                            </button>
                        </div>
                        {errors.rewards && <p className="text-red-500 text-xs">{errors.rewards}</p>}

                        <div className="space-y-3">
                            {rewards.map((reward) => (
                                <div key={reward.rank} className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 group hover:border-blue-200 transition-colors">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={reward.place}
                                            onChange={(e) => handleRewardChange(reward.rank, "place", e.target.value)}
                                            className="w-full bg-transparent text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
                                            placeholder="Rank (e.g., 1st Place)"
                                        />
                                    </div>
                                    <div className="w-px h-6 bg-gray-200" />
                                    <div className="w-32">
                                        <select
                                            value={reward.type}
                                            onChange={(e) => handleRewardChange(reward.rank, "type", e.target.value)}
                                            className="w-full bg-transparent text-sm text-gray-600 focus:outline-none cursor-pointer"
                                        >
                                            <option>Money ($)</option>

                                        </select>
                                    </div>
                                    <div className="w-px h-6 bg-gray-200" />
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={reward.prize}
                                            onChange={(e) => {
                                                handleRewardChange(reward.rank, "prize", e.target.value);
                                                if (errors.rewards) setErrors({ ...errors, rewards: "" });
                                            }}
                                            className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none text-right"
                                            placeholder="Value"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveReward(reward.rank)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50/50 sticky bottom-0 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateContest}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:translate-y-px transition-all">
                        Create Contest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateContestModal;
