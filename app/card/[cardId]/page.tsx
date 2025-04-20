"use client";

import CardDisplay from "@/components/card-display";
import ClosedLetter from "@/components/closed-letter";
import FloatingElements from "@/components/floating-elements";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { notFound, redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface CardData {
  id: string;
  recipient_name: string | null;
  message: string | null;
  image_url: string | null;
  image_caption: string | null;
  sender_name: string | null;
  card_date: string | null;
  style: string | null;
}

// No revalidate for client components
// export const revalidate = 60;

export default function CardViewerPage() {
  const params = useParams();
  const cardId = params.cardId as string;

  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUnfurled, setIsUnfurled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const supabase = createClient();

  useEffect(() => {
    if (!cardId) return;

    const fetchCard = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("cards")
        .select("*" as const)
        .eq("id", cardId)
        .single();

      if (fetchError) {
        console.error("Error fetching card:", fetchError);
        setError("Could not load card details.");
      } else if (data) {
        setCardData(data);
      } else {
        setError("Card not found.");
      }
      setLoading(false);
    };

    fetchCard();

    // --- Setup Audio ---
    // TODO: Determine music based on cardData.style later
    const musicUrl = "/birthday-music.mov";
    if (musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }

    // Cleanup function
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [cardId, supabase]);

  const handleOpenLetter = () => {
    if (!audioRef.current) return;
    setIsOpen(true);
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .catch((e) => console.error("Audio play failed:", e));
    setTimeout(() => {
      setIsUnfurled(true);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-pink-50 to-white">
        <p className="text-xl text-gray-600">Loading Card...</p>
      </div>
    );
  }

  if (error) {
    redirect("/");
  }

  if (!cardData) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      <FloatingElements />

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
              <ClosedLetter
                onOpen={handleOpenLetter}
                recipientName={cardData.recipient_name || ""}
              />
            </motion.div>
          ) : (
            <CardDisplay
              isUnfurled={isUnfurled}
              message={cardData.message || ""}
              imageUrl={cardData.image_url}
              caption={cardData.image_caption}
              senderName={cardData.sender_name || ""}
              cardDate={cardData.card_date || ""}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
