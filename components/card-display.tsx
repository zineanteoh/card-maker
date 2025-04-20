"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Dumpling from "./dumpling";
import Lantern from "./lantern";

interface CardDisplayProps {
  isUnfurled: boolean;
  message: string;
  imageUrl: string | null;
  caption: string | null;
  senderName: string;
  cardDate: string;
}

interface PolaroidImageProps {
  src: string;
  caption: string;
}
const PolaroidImage: React.FC<PolaroidImageProps> = ({ src, caption }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
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
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div className="relative w-48 h-48">
        {/* Use next/image */}
        <Image
          src={src}
          alt={caption || "Card image"}
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

const CardDisplay: React.FC<CardDisplayProps> = ({
  isUnfurled,
  message,
  imageUrl,
  caption,
  senderName,
  cardDate,
}) => {
  return (
    <motion.div
      key="open-letter"
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Decorative lanterns - TODO: Make these configurable by style */}
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
          {/* Background & Border */}
          <div className="absolute inset-0 bg-white/90"></div>
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
              {/* Birthday message - TODO: Make configurable by style */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-red-700 font-birthday">
                  Happy Birthday
                </h1>
                <h2 className="text-3xl md:text-4xl font-bold text-amber-600 font-calligraphy">
                  生日快乐
                </h2>
              </div>

              {/* Divider - TODO: Make configurable by style */}
              <div className="flex items-center justify-center">
                <div className="h-px w-16 bg-amber-300"></div>
                <div className="mx-4">
                  <span className="inline-block w-3 h-3 bg-amber-500 rounded-full"></span>
                </div>
                <div className="h-px w-16 bg-amber-300"></div>
              </div>

              {/* Personal message area */}
              <div className="min-h-[150px] p-6 rounded-lg bg-white/70 shadow-inner border border-amber-100 flex flex-col items-center gap-6">
                <p className="text-gray-700 text-center whitespace-pre-wrap">
                  {message || "(Your message will appear here)"}
                </p>

                {/* Display image if URL exists */}
                {imageUrl && (
                  <PolaroidImage src={imageUrl} caption={caption || ""} />
                )}
              </div>

              {/* Playful element */}
              <div className="relative h-28">
                {/* Updated: Use senderName and cardDate props */}
                <p className="text-center text-gray-500 italic">
                  <span className="not-italic">❤️❤️</span>{" "}
                  {senderName ? `From ${senderName}` : "(Sender name)"}{" "}
                  <span className="not-italic">❤️❤️</span>
                </p>
                <p className="text-center text-gray-500 italic text-sm mt-1">
                  {cardDate || "(Date)"}
                </p>
                {/* TODO: Make dumpling configurable by style */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-0">
                  <Dumpling />
                </div>
              </div>

              {/* NO Close Button here - belongs in the builder/preview */}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardDisplay;
