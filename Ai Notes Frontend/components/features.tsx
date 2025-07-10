"use client";
// ✅ Add this line
import BlurredShapeGray from "@/public/images/blurred-shape-gray.svg";
import BlurredShape from "@/public/images/blurred-shape.svg";
import FeaturesImage from "@/public/images/T2.png";
import Image from "next/image";

export default function Features() {
  return (
    <>
  
      <section className="relative">
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 -mt-20 -translate-x-1/2"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={BlurredShapeGray}
            width={760}
            height={668}
            alt="Blurred shape"
          />
        </div>
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 -mb-80 -translate-x-[120%] opacity-50"
          aria-hidden="true"
        >
          <Image
            className="max-w-none"
            src={BlurredShape}
            width={760}
            height={668}
            alt="Blurred shape"
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
            {/* Section header */}
            <div className="mx-auto max-w-3xl pb-4 text-center md:pb-12">
              <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
                <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                 . 🧠 Smart & Personal
                </span>
              </div>
             <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
                Think. Write. Remember. Smarter.
              </h2>
              <p className="text-lg text-indigo-200/65">
                    Effortlessly organize your thoughts, auto-generate structured notes from any input, and keep everything in one intelligent, beautifully simple place—just like AI Note Books, but with your own AI twist.
              </p>

            </div>
            <div
              className="flex justify-center pb-4 md:pb-12"
              data-aos="fade-up"
            >
              <Image
                className="max-w-none"
                src={FeaturesImage}
                width={600}
                height={384}
                alt="Features"
              />
            </div>

            {/* Features grid... (unchanged) */}
            {/* Keep all article blocks as is */}
          </div>
        </div>
      </section>
    </>
  );
}
