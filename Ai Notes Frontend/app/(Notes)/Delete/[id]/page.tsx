// app/(Notes)/Delete/[id]/page.tsx

import SingleNoteView from "@/components/SingleNoteView";

// Define type for route params
type PageProps = {
  params: {
    id: string;
  };
};

async function getNote(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/show/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch note");
  }

  return res.json();
}

export default async function Page({ params }: any) {
  const note = await getNote(params.id);

  return (
    <SingleNoteView
      id={Number(note.id)}
      title={note.title}
      content={note.content}
      category={note.category}
      createdAt={note.created_at}
    />
  );
} 
