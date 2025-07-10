"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-neutral-900 text-white w-full max-w-md p-6 rounded-xl shadow-lg border border-neutral-700"
          >
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <p className="text-sm text-neutral-300 mb-6">{message}</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm rounded-md bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white transition font-semibold"
              >
               &nbsp; Yes &nbsp;
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
