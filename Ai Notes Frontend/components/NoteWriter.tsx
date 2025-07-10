"use client";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import {
  ArrowLeft, Check, ChevronDown,
  FileImage,
  FileText, Loader2, Plus,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";



const words = [
  { text: "✨", className: "!bg-gradient-to-r !from-purple-500 !via-violet-500 !to-pink-500 !bg-clip-text !text-transparent" },
  { text: "Build", className: "!bg-gradient-to-r !from-purple-500 !via-violet-500 !to-pink-500 !bg-clip-text !text-transparent" },
  { text: "Smarts", className: "!bg-gradient-to-r !from-purple-500 !via-violet-500 !to-pink-500 !bg-clip-text !text-transparent" },
  { text: "Ai", className: "!bg-gradient-to-r !from-purple-500 !via-violet-500 !to-pink-500 !bg-clip-text !text-transparent" },
  { text: "Notes", className: "!bg-gradient-to-r !from-purple-500 !via-violet-500 !to-pink-500 !bg-clip-text !text-transparent" },
];

export default function NoteWriter() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Other");
  const [Aicategory, setAicategory] = useState("ChatGPT");
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "image" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
const [generating, setGenerating] = useState(false);


const [aiCategory, setAiCategory] = useState("ChatGPT");


  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const [errors, setErrors] = useState<{ title?: string; note?: string }>({});

  const triggerToast = (message: string, type: "success" | "error" | "warning" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectFile = (type: "pdf" | "image") => {
  setFileType(type);
  setMenuOpen(false);
  setTimeout(() => fileInputRef.current?.click(), 100);
};

const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return triggerToast("❌ Failed to upload file", "error");

  const isPDF = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  if ((fileType === "pdf" && isPDF) || (fileType === "image" && isImage)) {
    setUploadedFile(file);
    triggerToast(`📄 ${fileType?.toUpperCase()} uploaded: ${file.name}`);

    // ✅ Automatically trigger generation if it's a PDF
    if (fileType === "pdf" && isPDF) {
      setTimeout(() => {
        handleGenerateFromPDF();
      }, 300); // small delay to ensure state update
    }
  } else {
    alert(`Invalid file. Expected a ${fileType?.toUpperCase()} file.`);
  }

  e.target.value = "";
};

const handleGenerateFromPDF = async () => {
  if (!uploadedFile) {
    triggerToast("Please upload a file and fill category", "error");
    return;
  }

  const selectedAI = Aicategory || "ChatGPT";
 const categorys = category || "Other";
  const formData = new FormData();
  formData.append("file", uploadedFile);
  formData.append("category", categorys);
  formData.append("ai_category", selectedAI);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-pdf`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      sessionStorage.setItem("title", uploadedFile.name.replace(".pdf", ""));
      sessionStorage.setItem("content", data.output);
      sessionStorage.setItem("category", category);
      sessionStorage.setItem("ai_category", selectedAI);

      triggerToast("✅ AI generation successful", "success");
      router.push("EditPdfGeneratedNote");
    } else {
      triggerToast("❌ AI generation failed", "error");
    }
  } catch (error) {
    console.error("Upload error:", error);
    triggerToast("❌ Server error", "error");
  }
};





 const handleDownloadPDF = () => {
  try {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginTop = 20;
    const marginLeft = 10;
    const lineHeight = 7;
    const maxLineWidth = 180;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    const pageWidth = doc.internal.pageSize.getWidth();
    const titleWidth = doc.getTextWidth(title);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, marginTop);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const lines = doc.splitTextToSize(note, maxLineWidth); // ✅ FIXED HERE

    let cursorY = marginTop + 15;

    for (let i = 0; i < lines.length; i++) {
      if (cursorY + lineHeight > pageHeight - 10) {
        doc.addPage();
        cursorY = 20;
      }
      doc.text(lines[i], marginLeft, cursorY);
      cursorY += lineHeight;
    }

    doc.save(`${title}.pdf`);
    triggerToast("✅ PDF downloaded successfully!", "success");
  } catch (err) {
    console.error(err);
    triggerToast("❌ Failed to generate PDF.", "error");
  }
}
  const handleSubmit = async () => {
    const newErrors: { title?: string; note?: string } = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!note.trim()) newErrors.note = "Note content is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      triggerToast("❌ Please fill the form .", "error");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("https://ai-notes-backend-ghj3.onrender.com/Addnotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: note,
          category,
          Aicategory,
          store: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to save note");

      const data = await response.json();
      triggerToast("✅ Note saved successfully!", "success");

      setTitle("");
      setNote("");
      setAicategory("");
    } catch (error) {
      console.error("Error saving note:", error);
      triggerToast("❌ Failed to save note.", "error");
    } finally {
      setLoading(false);
    }
  };




  // Generate button 

const handleGenerate = async () => {
  const newErrors: { title?: string; note?: string } = {};
  if (!title.trim()) newErrors.title = "Title is required.";
  if (!note.trim()) newErrors.note = "Note content is required.";

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    triggerToast("❌ Please fill the form.", "error");
    return;
  }

  setGenerating(true); // show message
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        note,
        category,
        ai_category: Aicategory,
      }),
    });

    if (!response.ok) throw new Error("Generation failed");

    const data = await response.json();

    sessionStorage.setItem("title", title);
    sessionStorage.setItem("category", category);
    sessionStorage.setItem("note", note);
    sessionStorage.setItem("generated", data.generated_content);

    router.push("/EditGeneratedNote");
  } catch (err) {
    triggerToast("❌ Failed to generate note", "error");
    console.error(err);
  } finally {
    setGenerating(false); // hide message
  }
};



  return (
    <>
      {loading && <LoadingOverlay message="Saving..." />}
     
      <div className="relative z-10 px-4 pt-2 w-full">
        <div className="max-w-5xl w-full mx-auto px-2 sm:px-4">
          <div className="text-center">
            <TypewriterEffectSmooth className="text-2xl md:text-3xl font-bold text-center" words={words} />
          </div>
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
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
           onClick={() => router.push("/")}
            className="mt-1 mb-2 flex items-center gap-2 text-white hover:text-indigo-400 hover:underline underline-offset-4 transition-all duration-200 text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Back
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
            className="w-full p-10 md:p-12 bg-neutral-900 border dark:border-neutral-700 rounded-2xl shadow-xl text-white space-y-6"
          >
            {/* Title */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your note..."
                className={`w-full text-base md:text-lg bg-neutral-800 border rounded-lg p-4 placeholder:text-neutral-400 focus:outline-none transition-all duration-200 ${
                  errors.title
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-neutral-700 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Note */}
            <div>
              <label className="block mb-1 text-sm font-medium text-white">
                Note <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Start typing your note..."
                rows={1}
                onInput={(e) => {
                  const el = e.target as HTMLTextAreaElement;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
                }}
                className={`w-full min-h-[100px] max-h-[300px] p-4 text-lg bg-neutral-800 border rounded-lg placeholder:text-neutral-400 focus:outline-none resize-none overflow-auto transition-all duration-200 ${
                  errors.note
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-neutral-700 focus:ring-2 focus:ring-indigo-500"
                }`}
              />
              {errors.note && (
                <p className="text-red-500 text-sm mt-1">{errors.note}</p>
              )}
            </div>

            <div className="flex justify-between items-center flex-wrap gap-4 relative">
              {/* File Upload */}
              <div className="flex items-center gap-2 relative">
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="w-9 h-9 flex items-center justify-center bg-neutral-700 hover:bg-neutral-600 rounded-full transition"
                    title="Upload File"
                  >
                    <Plus size={18} />
                  </button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-2 w-40 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20"
                      >
                        <button
                          onClick={() => handleSelectFile("pdf")}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-neutral-700 transition"
                        >
                          <FileText size={16} />
                          Upload PDF
                        </button>
                        <button
                          onClick={() => handleSelectFile("image")}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-neutral-700 transition"
                        >
                          <FileImage size={16} />
                          Upload Image
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={fileType === "pdf" ? "application/pdf" : fileType === "image" ? "image/*" : ""}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <span className="text-sm text-neutral-400 truncate max-w-[150px]">
                  {uploadedFile ? uploadedFile.name : "Upload File"}
                </span>
              </div>

              {/* Dropdowns and Actions */}
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 items-center">
                <div className="relative w-44">
                  <select
                    value={Aicategory}
                    onChange={(e) => setAicategory(e.target.value)}
                    className="text-xs px-2 py-1 pr-6 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none w-full"
                  > 
                    {/* <option value="Write Yourself">Write Yourself</option> */}
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Groq">Groq</option>
                     <option value="LLaMA">LLaMA</option>
                     <option value="Google Gemini">Google Gemini</option>
                      <option value="DeepSeek">DeepSeek</option>

                     
                    
                   
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={12} />
                </div>

                <div className="relative w-44">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="text-xs px-2 py-1 pr-6 rounded bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none w-full"
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
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={12} />
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  className="shadow-[inset_0_0_0_2px_#616467] text-black px-4 py-2 rounded-full tracking-wide uppercase text-xs font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
                  onClick={handleDownloadPDF}
                >
                  ⬇️ Download
                </button>

                <button onClick={handleGenerate} className="p-[3px] relative rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="px-8 py-2 bg-black rounded-[6px] relative flex items-center gap-1 text-xs font-semibold uppercase text-white hover:bg-transparent transition duration-200">
                    <Sparkles size={14} />
                    {generating ? "Generating..." : "Generate"}
                  </div>
                </button>


                <ConfirmDialog
                  isOpen={confirmOpen}
                  message="Do you want to submit this note?"
                  onCancel={() => setConfirmOpen(false)}
                  onConfirm={() => {
                    setConfirmOpen(false);
                    handleSubmit();
                  }}
                />

                <button
                  onClick={() => setConfirmOpen(true)}
                  className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase text-white backdrop-blur-3xl gap-1">
                    <Check size={14} />
                    Submit
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>


      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}
