// /app/notes/page.tsx or /pages/notes.tsx
import NoteWriter from "@/components/NoteWriter";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function NotesPage() {
  return (
<main className="min-h-screen bg-neutral-950 flex flex-col !p-0 !m-0">
  <BackgroundBeamsWithCollision className="flex-grow flex items-center justify-center !p-0 !m-0">
    <NoteWriter />
  </BackgroundBeamsWithCollision>
</main>


  );
}
