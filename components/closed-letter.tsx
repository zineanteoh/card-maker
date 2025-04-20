"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

type ClosedLetterProps = {
  recipientName: string;
  onOpen?: () => void;
};

export default function ClosedLetter({
  recipientName,
  onOpen,
}: ClosedLetterProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (!onOpen || isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Envelope/Letter */}
      <motion.div
        className="relative w-full max-w-md aspect-[4/3] mb-8 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={handleOpenClick}
      >
        {/* Letter background */}
        <div className="absolute inset-0 bg-gradient-to-b from-red-600 to-red-700 rounded-lg shadow-xl overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full opacity-30"></div>
          </div>

          {/* Gold border */}
          <div className="absolute inset-2 border-4 border-amber-500/50 rounded-md"></div>

          {/* Seal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="absolute inset-1 bg-amber-500 rounded-full"></div>
            <div className="absolute inset-3 border-2 border-amber-700/30 rounded-full"></div>
            <div className="text-3xl font-calligraphy text-amber-900">福</div>
          </div>

          {/* Ribbon */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-amber-600"
            animate={{ opacity: isOpening ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1 bg-amber-600"
            animate={{ opacity: isOpening ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500/50 rounded-tl-md"></div>
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500/50 rounded-tr-md"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500/50 rounded-bl-md"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500/50 rounded-br-md"></div>
        </div>

        {/* Recipient name */}
        <div className="absolute bottom-6 left-0 w-full text-center px-4">
          <div className="text-amber-200 font-birthday text-xl truncate">
            For: {recipientName}
          </div>
        </div>
      </motion.div>

      {/* Open button - Conditionally render/enable */}
      {onOpen && (
        <motion.button
          onClick={handleOpenClick}
          className="group relative px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Button background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Button content */}
          <div className="relative flex items-center space-x-2">
            <span>Open Letter</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          {/* Sparkle effects */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 delay-100"></div>
            <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 delay-200"></div>
            <div className="absolute top-2/3 left-3/4 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-70 transition-opacity duration-300 delay-150"></div>
          </div>
        </motion.button>
      )}
    </div>
  );
}
