"use client";

import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Download,
  Maximize2,
  Minimize2,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ConfirmDialogDelete from "./ConfirmDialogDelete";

type Props = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
};

export default function SingleNoteView({
  id,
  title,
  content,
  category,
  createdAt,
}: Props) {
  const router = useRouter();
  const [selectedCategory] = useState(category);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "warning";
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const triggerToast = (
    message: string,
    type: "success" | "error" | "warning" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEditConfirm = () => {
    setConfirmOpen(false);
    router.push(`/EditNote/${id}`);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        triggerToast("🗑️ Note deleted successfully", "success");
        router.push("/Notes");
      } else {
        throw new Error(data.message || "Failed to delete");
      }
    } catch (error) {
      triggerToast("❌ Failed to delete note", "error");
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

      const lines = doc.splitTextToSize(content, maxLineWidth);
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
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-neutral-950 text-white w-full">
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-white hover:text-indigo-400 hover:underline underline-offset-4 text-sm font-medium"
      >
        <ArrowLeft size={18} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={`${
          isFullscreen
            ? "fixed inset-0 bg-neutral-800 p-6 overflow-y-auto z-50"
            : "max-w-4xl mx-auto"
        } bg-neutral-900 rounded-2xl border border-neutral-800 shadow-2xl p-6 md:p-10 space-y-6`}
      >
        <div className="flex justify-end">
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

        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-indigo-400">{title}</h1>
          <p className="text-sm text-neutral-400">
            {selectedCategory} • {createdAt}
          </p>
        </div>

        <div className="max-h-[500px] overflow-y-auto text-sm md:text-base text-neutral-200 whitespace-pre-wrap leading-relaxed pr-2 prose prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {content}
          </ReactMarkdown>
        </div>

        <div className="flex flex-wrap gap-3 justify-end pt-4">
          <button
            onClick={handleDownloadPDF}
            className="shadow-[inset_0_0_0_2px_#616467] text-white px-4 py-2 rounded-full uppercase text-xs font-bold bg-transparent hover:bg-[#616467] transition duration-200"
          >
            <Download size={14} className="inline mr-1" />
            Download PDF
          </button>

          <button
            onClick={() => setConfirmOpen(true)}
            className="relative inline-flex h-8 sm:h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-4 sm:px-5 text-[10px] sm:text-xs font-semibold uppercase text-white backdrop-blur-3xl gap-1 relative z-10">
              <Pencil size={12} /> Edit Note
            </span>
          </button>

          <button
            onClick={() => setDeleteConfirm(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-full text-xs font-semibold uppercase shadow hover:bg-red-700 transition duration-200"
          >
            <Trash2 className="inline mr-1 w-4 h-4" />
            Delete
          </button>
        </div>
      </motion.div>

      <ConfirmDialog
        isOpen={confirmOpen}
        message="Do you want to edit this note?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleEditConfirm}
      />

      <ConfirmDialogDelete
        isOpen={deleteConfirm}
        message="Are you sure you want to delete this note?"
        onCancel={() => setDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
