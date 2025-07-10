"use client";
import { cn } from "@/components/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconHome,
  IconNote,
  IconPlus,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CardSpotlightDemo } from "./notes_header_cards";

const PinContainer = dynamic(
  () => import("@/components/ui/3d-pin").then((mod) => mod.PinContainer),
  { ssr: false }
);

const arrCategory = [
  {
    label: "Engineering Student",
    description: "AI-simplified formulas and technical notes.",
  },
  {
    label: "Medical Student",
    description: "Summarized diagnoses and clinical concepts.",
  },
  {
    label: "IT Professional",
    description: "Quick AI code references and system docs.",
  },
  {
    label: "School Student",
    description: "Exam-ready AI summaries and basics.",
  },
  {
    label: "Finance Student",
    description: "Key financial concepts in plain language.",
  },
  {
    label: "Marketing",
    description: "AI-organized campaign briefs and strategies.",
  },
  {
    label: "HR",
    description: "Policy notes and workflow guides, AI-summarized.",
  },
  {
    label: "Business",
    description: "Business plans and ideas, AI-structured.",
  },
  {
    label: "Other",
    description: "General insights powered by AI clarity.",
  },
];

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export function SidebarDemo() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch( `${process.env.NEXT_PUBLIC_API_URL}/Notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Notes fetched:", data);
        setNotes(data);
      })
      .catch((err) => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const links = [
    { label: "Home", href: "/", icon: <IconHome className="h-5 w-5" /> },
    { label: "My Notes", href: "#", icon: <IconNote className="h-5 w-5" /> },
    {
      label: "Add Note",
      href: "/Addnotes",
      icon: <IconPlus className="h-5 w-5" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5" />,
    },
  ];

  return (
    <div
      className={cn(
        "flex h-screen w-screen flex-col md:flex-row overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-gray-100 dark:bg-neutral-800"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Atharva Karemore",
                href: "#",
                icon: (
                  <img
                    src=" "
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard />
    </div>
  );
}

export const Logo = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
  >
    <div className="h-5 w-6 rounded bg-black dark:bg-white" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-medium text-black dark:text-white"
    >
      AI Notes
    </motion.span>
  </a>
);

const Dashboard = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/Notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Notes fetched:", data);
        setNotes(data);
      })
      .catch((err) => console.error("❌ Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 text-white animate-pulse">
        <svg
          className="w-10 h-10 mb-4 animate-spin text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <p className="text-2xl sm:text-3xl font-semibold">Loading...</p>
      </div>
    );

  return (
    <div className="relative flex flex-col flex-1">
      <div className="flex h-full w-full flex-col gap-4 rounded-tl-2xl border border-neutral-200 bg-white p-4 md:p-10 dark:border-neutral-700 dark:bg-neutral-900">
        <button
          onClick={() => setIsFullscreen(true)}
          className="self-end px-4 py-2 text-black rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
        >
          Go Fullscreen
        </button>

        <div className="bg-neutral-900 sm:p-4">
          <div className="grid grid-cols-3 gap-3 w-full -mt-2">
            {arrCategory.map((cat, idx) => (
              <div
                key={idx}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.label)}
              >
                <CardSpotlightDemo
                  category={cat.label}
                  description={cat.description}
                />
              </div>
            ))}
          </div>

          {selectedCategory && (
            <div className="text-center mt-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className="bg-red-600 text-white px-4 py-1 rounded-full text-sm hover:bg-red-700 transition"
              >
                Clear Filter: {selectedCategory}
              </button>
            </div>
          )}
        </div>

        <div
          className={`${
            isFullscreen
              ? "fixed inset-0 z-50 w-full h-full bg-neutral-900 overflow-y-auto overflow-x-hidden px-4 py-6 pt-20"
              : "relative mt-10 px-4 py-6 max-h-screen overflow-y-auto overflow-x-hidden dark:bg-neutral-800"
          } transition-all duration-300 grid justify-center grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-6`}
        >
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-50 px-4 py-2 sm:px-6 sm:py-3 text-black rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200"
            >
              
              Close
            </button>
            
          )
          
          }

          {notes.filter((note) =>
            selectedCategory ? note.category === selectedCategory : true
          ).length === 0 ? (
            <p className="text-white col-span-full text-center">
              Add notes Notes.
            </p>
          ) : (
            notes
              .filter((note) =>
                selectedCategory ? note.category === selectedCategory : true
              )
              .map((note) => (
                <div
                  key={note.id}
                  className="relative group flex items-center justify-center p-2"
                >
                  <a
                    href={`/ViewSingleNote/${note.id}`}
                    className="flex items-center justify-center p-2 no-underline"
                  >
                    <PinContainer
                      title={note.title}
                      content={note.content}
                      category={note.category}
                      createdAt={note.created_at}
                    />
                  </a>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

export default Dashboard;
