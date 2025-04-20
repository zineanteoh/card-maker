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

  const [recipientName, setRecipientName] = useState("Recipient Name");
  const [message, setMessage] = useState("Wishing you well!");
  const [imageUrl, setImageUrl] = useState("/pic_1.jpeg");
  const [caption, setCaption] = useState("test");
  const [senderName, setSenderName] = useState("Your Name");
  const [cardDate, setCardDate] = useState(new Date().toLocaleDateString());

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

  // TODO: Add function to handle 'Create' button click (generate link, save to DB)
  const handleCreateCard = () => {
    console.log("Creating card with:", {
      recipientName,
      message,
      imageUrl,
      caption,
      senderName,
      cardDate,
    });
    alert("Create button clicked! (Functionality not implemented yet)");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white shadow-lg h-screen overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Card Builder</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Card Style
          </label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option>Birthday Style (Default)</option>
            {/* TODO: Add more styles later */}
          </select>
        </div>

        {/* Recipient Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter recipient's name"
          />
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Write your personal message"
          />
        </div>

        {/* Image Upload Placeholder */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Image
          </label>
          {/* Basic input for now, replace with actual upload later */}
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-2"
            placeholder="Enter image URL"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Image caption"
          />
          {/* <button className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
            Upload Image (Placeholder)
          </button> */}
        </div>

        {/* Sender Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Sender Name
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter your name or signature"
          />
        </div>

        {/* Card Date */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date
          </label>
          <input
            type="text"
            value={cardDate}
            onChange={(e) => setCardDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., June 20, 2024"
          />
        </div>

        {/* Create Button */}
        <div className="mt-8">
          <button
            onClick={handleCreateCard}
            className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Create Card
          </button>
        </div>
      </div>

      <div className="w-full md:w-2/3 lg:w-3/4 relative flex-grow h-screen overflow-y-auto">
        {/* Background elements - Keep them covering the preview area */}
        <FloatingElements />

        {/* Main container for the preview - Adjust padding/centering if needed due to scroll */}
        <div className="relative flex flex-col items-center justify-center min-h-full px-4 py-10">
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
                {/* Pass recipient name to ClosedLetter */}
                <ClosedLetter
                  onOpen={handleOpenLetter}
                  recipientName={recipientName}
                />
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

                        {/* Personal message area - Use state */}
                        <div className="min-h-[150px] p-6 rounded-lg bg-white/70 shadow-inner border border-amber-100 flex flex-col items-center gap-6">
                          <p className="text-gray-500 italic text-center whitespace-pre-wrap">
                            {message || "(Your message will appear here)"}
                          </p>

                          {/* Display image if URL exists */}
                          {imageUrl && (
                            <PolaroidImage
                              src={imageUrl}
                              caption={caption || ""}
                            />
                          )}
                        </div>

                        {/* Playful element */}
                        <div className="relative h-28">
                          <p className="text-center text-gray-500 italic">
                            {senderName
                              ? `From ${senderName}`
                              : "(Sender name)"}
                          </p>
                          <p className="text-center text-gray-500 italic text-sm mt-1">
                            {cardDate}
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
