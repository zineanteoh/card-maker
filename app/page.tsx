"use client";

import ClosedLetter from "@/components/closed-letter";
import Dumpling from "@/components/dumpling";
import FloatingElements from "@/components/floating-elements";
import Lantern from "@/components/lantern";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function BirthdayScroll() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnfurled, setIsUnfurled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    // TODO: replace with selected music
    audioRef.current = new Audio("/birthday-music.mov");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleOpenLetter = () => {
    setIsOpen(true);
    // Reset audio to the beginning before playing
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    // Play music when the letter is opened
    audioRef.current
      ?.play()
      .catch((e) => console.error("Error playing audio:", e));
    // Start the unfurling animation after the letter opens
    setTimeout(() => {
      setIsUnfurled(true);
    }, 1000);
  };

  const handleCloseLetter = () => {
    setIsUnfurled(false);
    audioRef.current?.pause();
    // Wait for unfurl animation to mostly complete before closing
    setTimeout(() => {
      setIsOpen(false);
    }, 1000); // Match the unfurl delay + some buffer
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      {/* Background elements */}
      <FloatingElements />

      {/* Main container */}
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed-letter"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <ClosedLetter onOpen={handleOpenLetter} />
            </motion.div>
          ) : (
            <motion.div
              key="open-letter"
              className="relative w-full max-w-2xl mx-auto"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Decorative lanterns */}
              <div className="absolute top-10 left-4 z-10 opacity-90">
                <Lantern size="lg" color="red" />
              </div>
              <div className="absolute top-20 right-10 z-10 opacity-80">
                <Lantern size="md" color="gold" />
              </div>

              {/* Scroll */}
              <motion.div
                className="relative w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isUnfurled ? 1 : 0.8,
                  opacity: isUnfurled ? 1 : 0,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                <div className="relative rounded-lg shadow-2xl">
                  <div className="absolute inset-0 bg-white/90"></div>

                  {/* Gold border */}
                  <div className="absolute inset-0 border-8 border-amber-500/30 rounded-lg pointer-events-none"></div>

                  {/* Content */}
                  <div className="relative px-6 py-12 md:px-12 md:py-16">
                    <motion.div
                      className="space-y-8 text-center"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{
                        opacity: isUnfurled ? 1 : 0,
                        y: isUnfurled ? 0 : 50,
                      }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {/* Birthday message */}
                      <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-red-700 font-birthday">
                          Happy Birthday
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-bold text-amber-600 font-calligraphy">
                          生日快乐
                        </h2>
                      </div>

                      {/* Divider with gold accents */}
                      <div className="flex items-center justify-center">
                        <div className="h-px w-16 bg-amber-300"></div>
                        <div className="mx-4">
                          <span className="inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
                        </div>
                        <div className="h-px w-16 bg-amber-300"></div>
                      </div>

                      {/* Personal message area */}
                      <div className="min-h-[150px] p-6 rounded-lg bg-white/70 shadow-inner border border-amber-100 flex flex-col items-center gap-6">
                        {/* TODO: add text and images here */}
                        <p className="text-gray-500 italic text-center">
                          Wishing you well!
                        </p>

                        <PolaroidImage src="/pic_1.jpeg" caption="test" />
                      </div>

                      {/* Playful element */}
                      <div className="relative h-28">
                        <p className="text-center text-gray-500 italic">
                          <span className="not-italic">❤️❤️</span>{" "}
                          来自你亲爱的弟弟 nean{" "}
                          <span className="not-italic">❤️❤️</span>
                        </p>
                        <p className="text-center text-gray-500 italic text-sm mt-1">
                          April 15, 2025
                        </p>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                          <Dumpling />
                        </div>
                      </div>

                      {/* Close Button */}
                      <div className="mt-12 flex justify-center">
                        <button
                          onClick={handleCloseLetter}
                          className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                        >
                          Close Letter
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// New PolaroidImage Component
interface PolaroidImageProps {
  src: string;
  caption: string;
}

const PolaroidImage: React.FC<PolaroidImageProps> = ({ src, caption }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Generate a random rotation between -4 and 4 degrees
    const randomRotation = Math.random() * 8 - 4;
    setRotation(randomRotation);
  }, []);

  return (
    <motion.div
      className="bg-white p-3 pb-10 rounded-sm shadow-lg relative my-4"
      style={{ rotate: `${rotation}deg` }}
      whileHover={{
        scale: 1.05,
        rotate: `${rotation + (Math.random() > 0.5 ? 1 : -1)}deg`,
      }} // Slight rotation change on hover
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className="relative w-48 h-48">
        <Image
          src={src}
          alt={caption}
          layout="fill"
          objectFit="cover"
          className=""
        />
      </div>
      <p className="text-center text-gray-500 mt-3 font-mono text-sm absolute bottom-3 left-0 right-0">
        {caption}
      </p>
    </motion.div>
  );
};
