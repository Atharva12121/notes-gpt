"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning";

type ToastProps = {
  message: string;
  type?: ToastType;
};

export default function Toast({ message, type = "success" }: ToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 transition duration-300 text-white
              ${
                type === "success"
                  ? "bg-green-600"
                  : type === "error"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }
            `}
          >
            {type === "success" && <Check className="w-5 h-5" />}
            {type === "error" && <X className="w-5 h-5" />}
            {type === "warning" && <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
