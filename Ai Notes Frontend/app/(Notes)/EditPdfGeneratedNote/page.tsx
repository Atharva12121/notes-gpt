"use client";

import Toast from "@/components/Toast";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function EditGeneratedNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [aiCategory, setAiCategory] = useState("ChatGPT");
  const [prompt, setPrompt] = useState("");
  const [generatedOutput, setGeneratedOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
const selectedAI = aiCategory || "ChatGPT";
  useEffect(() => {
    setTitle(sessionStorage.getItem("title") || "");
    setContent(sessionStorage.getItem("content") || "");
    setCategory(sessionStorage.getItem("category") || "");
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim() || !content.trim()) {
      return showToast("❌ Prompt and content required", "error");
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          note: content,
          category,
          ai_category:  selectedAI,
          prompt: prompt,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setGeneratedOutput(data.generated_content);
        showToast("✅ AI responded", "success");
      } else {
        showToast("❌ Failed to generate output", "error");
      }
    } catch (err) {
      showToast("❌ Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Addnotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: generatedOutput || content,
          category,
          store: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("✅ Note saved successfully!");
        setTimeout(() => router.push("/Notes"), 1000);
      } else {
        showToast("❌ Save failed: " + data.error, "error");
      }
    } catch (err) {
      showToast("❌ Server error", "error");
    }
  };

  return (
    <div className="p-6 space-y-4 text-white bg-neutral-900 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/Addnotes")}
          className="inline-flex items-center gap-2 text-sm text-white hover:text-indigo-400 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleSaveNote}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium"
        >
          <Save size={16} />
          Save
        </button>
      </div>

      <h1 className="text-3xl font-bold">Edit AI Generated Note</h1>

      <input
        className="w-full p-3 rounded bg-neutral-800 text-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
      />

      <textarea
        className="w-full max-h-64 overflow-y-auto p-3 rounded bg-neutral-800 text-base"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste content here..."
        rows={8}
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className="flex-1 p-3 rounded bg-neutral-800 text-base"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask AI to enhance / update..."
        />
        <button
          onClick={handlePromptSubmit}
          className="px-6 py-2 bg-indigo-600 rounded hover:bg-indigo-700 text-sm font-medium"
        >
          ✨ Run Prompt
        </button>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 text-blue-400 animate-pulse"
        >
          ⏳ AI is thinking...
        </motion.div>
      )}

      {generatedOutput && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold mb-2">📄 Output Preview</h2>
          <div className="prose prose-invert max-h-[400px] overflow-y-auto bg-neutral-800 p-4 rounded border border-neutral-700">
            <ReactMarkdown>{generatedOutput}</ReactMarkdown>
          </div>
        </motion.div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
