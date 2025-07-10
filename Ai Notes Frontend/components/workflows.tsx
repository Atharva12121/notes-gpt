import Spotlight from "@/components/spotlight";
import WorflowImg01 from "@/public/images/workflow-01.png";
import WorflowImg02 from "@/public/images/workflow-02.png";
import WorflowImg03 from "@/public/images/workflow-03.png";
import Image from "next/image";

export default function Workflows() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
             <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
  Smarter Productivity
</span>
</div>
<h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
  Your Ideas, Structured by AI
</h2>
<p className="text-lg text-indigo-200/65">
  Write freely, and let AI handle the rest — summaries, categorization, and task assignment happen automatically. Whether you're learning, building, or planning, this is your central hub for organized thinking.
</p>

          </div>
          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
  {/* Card 1 */}
  <a className="group/card relative overflow-hidden rounded-2xl bg-gray-800 p-px" href="#0">
    <div className="relative z-20 overflow-hidden rounded-[inherit] bg-gray-950">
      <Image
        className="w-full h-48 object-cover"
        src={WorflowImg01}
        alt="Smart Note Categorization"
      />
      <div className="p-6">
        <div className="mb-3">
          <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-medium">
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
              Auto-Categorization
            </span>
          </span>
        </div>
        <p className="text-indigo-200/80 text-sm leading-relaxed">
          Let AI automatically categorize your notes into meaningful topics like “Machine Learning”, “Frontend Tasks”, or “Meeting Summaries”. 
          It uses semantic understanding to sort entries without manual tags.
        </p>
        <p className="text-indigo-200/70 text-sm leading-relaxed mt-2">
          This is especially useful for students or teams working across multiple domains, allowing them to keep everything organized and searchable.
        </p>
      </div>
    </div>
  </a>

  {/* Card 2 */}
  <a className="group/card relative overflow-hidden rounded-2xl bg-gray-800 p-px" href="#0">
    <div className="relative z-20 overflow-hidden rounded-[inherit] bg-gray-950">
      <Image
        className="w-full h-48 object-cover"
        src={WorflowImg02}
        alt="Real-time Collaboration"
      />
      <div className="p-6">
        <div className="mb-3">
          <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-medium">
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
              Take Action
            </span>
          </span>
        </div>
       <p className="text-indigo-200/80 text-sm leading-relaxed">
  Turn your notes into action by assigning tasks directly from any section. Highlight key points and instantly convert them into to-dos with deadlines and priority levels.
</p>
<p className="text-indigo-200/70 text-sm leading-relaxed mt-2">
  Add tags, set reminders, and track progress — all within the same workspace. AI intelligently organizes and prioritizes your tasks, helping you stay focused and on schedule.
</p>

<br />
      </div>
    </div>
  </a>

  {/* Card 3 */}
  <a className="group/card relative overflow-hidden rounded-2xl bg-gray-800 p-px" href="#0">
    <div className="relative z-20 overflow-hidden rounded-[inherit] bg-gray-950">
      <Image
        className="w-full h-48 object-cover"
        src={WorflowImg03}
        alt="AI Summarization"
      />
      <div className="p-6">
        <div className="mb-3">
          <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-medium">
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
              AI Summaries
            </span>
          </span>
        </div>
       <p className="text-indigo-200/80 text-sm leading-relaxed">
  Upload long-form content — whether it’s articles, research papers, lecture notes, or PDFs — and get AI-powered summaries in seconds. Our system identifies key takeaways, simplifies complex language, and auto-structures the output into clean, easy-to-read.
      </p>
     <p className="text-indigo-200/70 text-sm leading-relaxed mt-2">
  Perfect for fast revision, deep content comprehension, or turning scattered information into  formatted documentation. </p>
        
      </div>
    </div>
  </a>
</Spotlight>

        </div>
      </div>
    </section>
  );
}
