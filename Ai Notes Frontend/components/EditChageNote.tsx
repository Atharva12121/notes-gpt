"use client";
import { motion } from "framer-motion";
import { Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import type { ToastType } from "@/components/Toast";
import Toast from "@/components/Toast";
import { BackgroundGradient } from "@/components/ui/background-gradient";

type EditableNoteProps = {
  id: number;
  title: string;
  content: string;
  category: string;
  aiSource: string;
  created_at: string;
};

export default function EditableNote({
  id,
  title: initialTitle,
  content: initialContent,
  category: initialCategory,
  aiSource: initialAiSource,
  created_at,
}: EditableNoteProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState(initialCategory);
  const [aiSource, setAiSource] = useState(initialAiSource);
  const [lastUpdated, setLastUpdated] = useState(created_at);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [toast, setToast] = useState<{ message: string; success: boolean } | null>(null);
  const [toastType, setToastType] = useState<ToastType>("success");
  const [Aicategory, setAicategory] = useState("");

  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; note?: string }>({});

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, success: type === "success" });
    setToastType(type);
    setTimeout(() => setToast(null), 5000);
  };

  const validateForm = () => {
    if (!title.trim()) {
      showToast("❌ Title cannot be empty.", "error");
      return false;
    }
    if (!content.trim()) {
      showToast("❌ Content cannot be empty.", "error");
      return false;
    }
    return true;
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      setShowConfirm(true);
    }
  };

  const confirmSave = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/edit/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, category, aiSource }),
      });

      const data = await res.json();

      if (data.created_at) {
        setLastUpdated(data.created_at);
        showToast("✅ Note updated successfully!", "success");

        setShowConfirm(false);
        setTimeout(() => {
          setIsFullscreen(false);
          setTimeout(() => {
            router.push(`/ViewSingleNote/${id}`);
          }, 300);
        }, 800);
      } else {
        showToast("❌ Failed to update note.", "error");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      showToast("⚠️ Server error. Try again later.", "warning");
    }
  };

  const handleGenerate = async () => {
    const newErrors: { title?: string; note?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!content.trim()) newErrors.note = "Note content is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("❌ Please fill the form.", "error");
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          note: content,
          category,
          ai_category: aiSource,
        }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();

      sessionStorage.setItem("title", title);
      sessionStorage.setItem("category", category);
      sessionStorage.setItem("note", content);
      sessionStorage.setItem("generated", data.generated_content);

      router.push("/EditGeneratedNote");
    } catch (err) {
      showToast("❌ Failed to generate note", "error");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <BackgroundGradient
      className={`relative ${
        isFullscreen
          ? "fixed inset-0 z-50 w-full h-full overflow-y-auto p-6 bg-neutral-950 m-0"
          : "max-w-4xl mx-auto mt-1 p-6"
      } rounded-xl bg-neutral-900 text-white shadow-lg border border-neutral-700`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
          {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 p-6 bg-neutral-900 rounded-xl shadow-xl border border-blue-600">
              <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
              <p className="text-lg text-blue-300 font-semibold">Generating note...</p>
            </div>
          </motion.div>
        )}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => (isFullscreen ? setIsFullscreen(false) : router.back())}
            className="flex items-center gap-2 text-white hover:text-indigo-400 hover:underline underline-offset-4 text-sm font-medium"
          >
            {!isFullscreen && "← Back"}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-sm flex items-center gap-1 text-white hover:text-indigo-300 transition"
          >
            {isFullscreen ? (
              <>
                <Minimize2 size={16} /> Exit Fullscreen
              </>
            ) : (
              <>
                <Maximize2 size={16} /> Fullscreen
              </>
            )}
          </button>
        </div>

        {toast && <Toast message={toast.message} type={toastType} />}

        <ConfirmDialog
          isOpen={showConfirm}
          message="Do you want to update this note?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={confirmSave}
        />

        <h1 className="text-2xl font-bold text-indigo-400 mb-4">Edit Note</h1>
        <p className="text-sm text-neutral-400 mb-6">
          🕒 Last Updated: {new Date(lastUpdated).toLocaleString()}
        </p>

        <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          className={`w-full p-3 mb-4 bg-neutral-800 rounded-md border transition focus:outline-none ${
            !title.trim() && toast?.message.includes("Title")
              ? "border-red-500 focus:border-red-500"
              : "border-transparent focus:border-indigo-500"
          }`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <label className="text-sm font-medium text-white mb-1 flex items-center gap-1">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`w-full h-60 p-3 mb-6 bg-neutral-800 rounded-md border transition focus:outline-none ${
            !content.trim() && toast?.message.includes("Content")
              ? "border-red-500 focus:border-red-500"
              : "border-transparent focus:border-indigo-500"
          }`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
          <select
            className="p-2 text-sm bg-neutral-800 rounded-md border border-neutral-600 focus:border-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Engineering Student">Engineering Student</option>
            <option value="Medical Student">Medical Student</option>
            <option value="IT Professional">IT Professional</option>
            <option value="School Student">School Student</option>
            <option value="Finance Student">Finance Student</option>
            <option value="Marketing">Marketing</option>
            <option value="HR">HR</option>
            <option value="Business">Business</option>
            <option value="Other">Other</option>
          </select>

          <select
            className="p-2 text-sm bg-neutral-800 rounded-md border border-neutral-600 focus:border-indigo-500"
            value={aiSource}
            onChange={(e) => setAiSource(e.target.value)}
          >
            <option value="ChatGPT">ChatGPT</option>
            <option value="Groq">Groq</option> 
            <option value="LLaMA">LLaMA</option>
            <option value="Google Gemini">Google Gemini</option>
            <option value="DeepSeek">DeepSeek</option>
            
            
          </select>

          <button className="p-[3px] relative" onClick={handleGenerate}>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent">
              {generating ? "Generating..." : "Generate"}
            </div>
          </button>

          <button
            onClick={handleSaveClick}
            className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              💾 Save
            </span>
          </button>
        </div>
      </motion.div>
    </BackgroundGradient>
  );
}
