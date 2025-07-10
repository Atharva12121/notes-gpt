"use client";

import { useEffect, useState } from "react";
import SingleNoteView from "./SingleNoteView";

type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

export default function SingleNoteViewWrapper({ id }: { id: number }) {
  const [note, setNote] = useState<Note | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/show/${id}`);
        const data = await res.json();
        setNote(data);
      } catch (err) {
        setError("❌ Failed to load note");
      }
    };

    fetchNote();
  }, [id]);

  if (error) return <div className="text-red-500 px-4 py-6">{error}</div>;
  if (!note) return <div className="text-white px-4 py-6">Loading...</div>;

  return (
    <SingleNoteView
      id={note.id}
      title={note.title}
      content={note.content}
      category={note.category}
      createdAt={note.created_at}
    />
  );
}
