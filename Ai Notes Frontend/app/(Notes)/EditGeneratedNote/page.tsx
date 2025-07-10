"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

export default function EditGeneratedNote() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [originalNote, setOriginalNote] = useState("");
  const [aiRefinePrompt, setAiRefinePrompt] = useState("");

  useEffect(() => {
    const storedTitle = sessionStorage.getItem("title") || "";
    const storedCategory = sessionStorage.getItem("category") || "";
    const generated = sessionStorage.getItem("generated") || "";
    setTitle(storedTitle);
    setCategory(storedCategory);
    setNote(generated);
    setOriginalNote(generated);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Addnote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content: note, category, store: true }),
      });
      const data = await response.json();
      router.push(`/Notes`);
    } catch {
      alert("❌ Failed to save note");
    } finally {
      setLoading(false);
    }
  };

  const handlePromptGenerate = async (customPrompt: string) => {
    if (!customPrompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          note: customPrompt,
          category,
          ai_category: "Google Gemini",
        }),
      });
      const data = await response.json();
      setNote(data.generated_content);
    } catch {
      alert("❌ Failed to generate from prompt");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    sessionStorage.setItem("generated", originalNote);
    router.push("/Addnotes");
  };

  return (
    <motion.div
      className="w-full min-h-screen mx-auto p-6 text-white space-y-8 bg-gradient-to-tr from-black via-neutral-950 to-black"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2
        className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        🧠 Edit Your AI Generated Note
      </motion.h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm mb-1 text-neutral-400">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title for your note"
            className="w-full p-3 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-sm mb-1 text-neutral-400">Modify with Prompt</label>
          <div className="flex items-center gap-2">
            <textarea
              value={aiRefinePrompt}
              onChange={(e) => setAiRefinePrompt(e.target.value)}
              rows={2}
              placeholder="e.g. Simplify, translate, or add example..."
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded resize-y"
            />
      
              <button  onClick={() => handlePromptGenerate(aiRefinePrompt)} className="p-[3px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
        <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
           🔄 Regenerate
        </div>
      </button>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm mb-1 text-neutral-400">
          AI Generated Note (Markdown Supported)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={12}
          className="w-full p-4 rounded-lg bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y overflow-auto"
        />
      </div>

      <div className="mt-2 p-4 bg-neutral-900 border border-neutral-700 rounded-lg overflow-auto max-h-[400px]">
        <h3 className="text-sm text-neutral-400 mb-2">📄 Markdown Preview:</h3>
        <div className="prose prose-invert max-w-none whitespace-pre-wrap break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {note}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-between pt-6">
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          ⬅ Back to /Addnotes
        </button>

      
          <button   onClick={handleSave} className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          {loading && <Loader2 className="animate-spin w-4 h-4" />} Save Note
        </span>
      </button>
      </div>
    </motion.div>
  );
}
