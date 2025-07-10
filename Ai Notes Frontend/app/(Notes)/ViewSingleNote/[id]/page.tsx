"use client";

import SingleNoteView from "@/components/SingleNoteView";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export default function ViewSingleNote() {
  const params = useParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/show/${params.id}`);
      const data = await res.json();
      setNote(data);
    };

    if (params.id) fetchNote();
  }, [params.id]);

  if (!note) return <div className="flex flex-col items-center justify-center h-screen text-white animate-pulse">
  <svg className="w-8 h-8 mb-4 animate-spin text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
  <p className="text-2xl sm:text-3xl font-semibold">Loading...</p>
</div>


  return (
   
<main className="min-h-screen bg-neutral-950 flex flex-col !p-0 !m-0 w-full" >
  <BackgroundBeamsWithCollision className="flex-grow flex items-center justify-center !p-0 !m-0">
      <SingleNoteView
       id={note.id}
        title={note.title}
        content={note.content}
        category={note.category}
        createdAt={note.created_at}
      />
   
  </BackgroundBeamsWithCollision>
  </main>


  );
}
