"use client";

import EditableNote from "@/components/EditChageNote";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  aiSource: string;
  created_at: string;
};

export default function EditNotePage() {
  const params = useParams();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/edit/${params.id}`);
        const data = await res.json();
        setNote(data);
      } catch (error) {
        console.error("Error fetching note:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchNote();
  }, [params.id]);

  if (loading) return <div className="flex flex-col items-center justify-center h-screen text-white animate-pulse">
  <svg className="w-8 h-8 mb-4 animate-spin text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
  <p className="text-2xl sm:text-3xl font-semibold">Loading...</p>
</div>


  if (!note) return <p className="text-red-500 text-center p-10">❌ Note not found.</p>;

  return (
    <BackgroundLines className=" rounded-[22px] relative flex items-center justify-center w-full min-h-screen px-4 py-9 ">
    

  <EditableNote
    id={note.id}
    title={note.title}
    content={note.content}
    category={note.category}
    aiSource={note.aiSource}
    created_at={note.created_at}
  />


 </BackgroundLines>

  );
}
