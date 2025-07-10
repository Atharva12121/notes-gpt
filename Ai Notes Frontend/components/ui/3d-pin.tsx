"use client";

import { cn } from "@/components/lib/utils";
import { motion } from "framer-motion";
import React, { useState } from "react";

type PinProps = {
  title: string;
  content: string;
  category: string;
  createdAt: string;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
};

export const PinContainer = ({
  title,
  content,
  category,
  createdAt,
  className,
  containerClassName,
  children,
}: PinProps) => {
  const [transform, setTransform] = useState(
    "translate(-50%,-50%) rotateX(0deg)"
  );

  const onMouseEnter = () => {
    setTransform("translate(-50%,-50%) rotateX(40deg) scale(0.9)");
  };
  const onMouseLeave = () => {
    setTransform("translate(-50%,-50%) rotateX(0deg) scale(1)");
  };

  return (
    <div
      className={cn(
        "relative group/pin z-10 w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px]",
        containerClassName
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
 

      <div
        style={{
          perspective: "1000px",
          transform: "rotateX(70deg) translateZ(0deg)",
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          style={{ transform }}
          className="absolute left-1/2 top-1/2 w-[150px] sm:w-[220px] md:w-[240px] lg:w-[260px] h-[260px] p-3 flex justify-start items-start rounded-2xl shadow-[0_8px_16px_rgb(0_0_0/0.4)] bg-black border border-white/[0.1] group-hover/pin:border-white/[0.2] transition duration-700 overflow-hidden"
        >


          <div className={cn("relative z-50", className)}>
            {children ? (
              children
            ) : (
              <div className="flex flex-col w-full h-auto min-h-[9rem] sm:min-h-[10rem] md:min-h-[11rem] lg:min-h-[12rem] p-2 sm:p-3 md:p-4 text-slate-100/50">
                <h3 className="pb-1 m-0 font-bold text-xs sm:text-sm text-slate-100">
                  {title}
                </h3>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mb-1">
                  {category}
                </p>
                <p className="text-[8px] sm:text-[9px] text-slate-500 mb-2">
                  {new Date(createdAt).toLocaleString()}
                </p>
                <div className="text-[10px] sm:text-xs text-slate-300 line-clamp-5">
                  {content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PinPerspective title={title} />
    </div>
  );
};

export const PinPerspective = ({ title }: { title?: string }) => {
  return (
    <motion.div className="pointer-events-none w-64 sm:w-72 h-60 sm:h-64 flex items-center justify-center opacity-0 group-hover/pin:opacity-100 z-[60] transition duration-500">
      <div className="w-full h-full -mt-6 flex-none inset-0">
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-3 ring-1 ring-white/10">
            <span className="relative z-20 text-white text-xs font-bold inline-block py-0.5">
              {title}
            </span>
          </div>
        </div>

        {[0, 2, 4].map((delay) => (
          <motion.div
            key={delay}
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{ opacity: [0, 1, 0.5, 0], scale: 1 }}
            transition={{ duration: 6, repeat: Infinity, delay }}
            className="absolute left-1/2 top-1/2 h-[9rem] w-[9rem] rounded-full bg-sky-500/[0.08] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
          />
        ))}

        <>
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-16 group-hover/pin:h-32 blur-[2px]" />
          <motion.div className="absolute right-1/2 bottom-1/2 bg-gradient-to-b from-transparent to-cyan-500 translate-y-[14px] w-px h-16 group-hover/pin:h-32" />
          <motion.div className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 bg-cyan-600 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]" />
          <motion.div className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 bg-cyan-300 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40" />
        </>
      </div>
    </motion.div>
  );
};
