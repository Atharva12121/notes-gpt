"use client"
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { useState } from "react";

const testimonials = [
  {
    content:
      "As an engineering student, staying organized and efficient is key. This AI-powered note tool has completely changed how I capture and structure technical concepts and project details.",
    link: "Engineering Student",
    categories: [1, 3, 5],
  },
  {
    content:
      "Medical school is intense, but this AI note system helps me distill complex topics into manageable, structured notes. It's like a study partner that never gets tired.",
    link: "Medical Student",
    categories: [1, 2, 4],
  },
  {
    content:
      "As a developer juggling tasks, meetings, and ideas, this tool helps me keep everything in sync. It's intuitive, fast, and feels like an extension of my thought process.",
    link: "IT Professional",
    categories: [1, 2, 5],
  },
  {
    content:
      "This AI tool has made studying so much easier! I can turn class notes into organized summaries in seconds. It’s like having my own tutor.",
    link: "School Student",
    categories: [1, 4],
  },
  {
    content:
      "This AI note system helps me break down complex financial data into digestible chunks. It’s my go-to tool for both studying and quick revisions.",
    link: "Finance Student",
    categories: [1, 3, 5],
  },
  {
    content:
      "I use this AI tool daily to brainstorm campaigns, organize briefs, and generate pitch-ready content. It’s fast, smart, and always on-brand.",
    link: "Marketing",
    categories: [1, 3],
  },
  {
    content:
      "This tool helps me keep interview notes, onboarding plans, and employee feedback neatly structured. It’s like having an AI assistant in HR!",
    link: "HR",
    categories: [1, 2, 5],
  },
  {
    content:
      "Running a startup is chaotic, but this AI notebook brings clarity. It helps me track meetings, strategy notes, and market research all in one place.",
    link: "Business",
    categories: [1, 4],
  },
  {
    content:
      "I just needed a simple, smart space to store my ideas, thoughts, and creative writing—and this tool delivers. It's beautiful, fast, and easy to use.",
    link: "Other",
    categories: [1, 2],
  },
];

export default function Testimonials() {
  const [category] = useState(1);

  const filtered = testimonials.filter((t) => t.categories.includes(category));

  const hoverCards = filtered.map((t) => ({
    title: t.link,
    description: t.content,
    link: `#${t.link.toLowerCase().replace(/\s+/g, '-')}`,
  }));

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white">What our users say</h2>
        <p className="text-indigo-200/70 mt-4">
          Real experiences from different backgrounds using our AI note tool.
        </p>
      </div>

      <HoverEffect items={hoverCards} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 px-6 [&>*]:aspect-square [&>*]:w-full [&>*]:h-60"></HoverEffect> 
    </section>
  );
}
