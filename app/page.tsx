"use client";

import CardDisplay from "@/components/card-display";
import ClosedLetter from "@/components/closed-letter";
import FloatingElements from "@/components/floating-elements";
import { createClient } from "@/lib/supabase/client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BirthdayScroll() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnfurled, setIsUnfurled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [senderName, setSenderName] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  type FocusedSection = "recipient" | "content" | null;
  const [focusedField, setFocusedField] = useState<FocusedSection>("recipient");

  const [isPreviewing, setIsPreviewing] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const supabase = createClient();

  useEffect(() => {
    const musicUrl = "/birthday-music.mov";
    if (musicUrl) {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const isFormValid =
    recipientName.trim() !== "" &&
    message.trim() !== "" &&
    senderName.trim() !== "" &&
    cardDate.trim() !== "";

  const handleCreateCard = async () => {
    if (!isFormValid) return;

    setUploadError(null);
    setGeneratedLink(null);
    let uploadedImageUrl: string | null = null;

    if (imageFile) {
      setIsUploading(true);
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `${Date.now()}-${Math.random()}.${fileExt}`;

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("card-images")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("card-images")
          .getPublicUrl(filePath);

        if (!urlData || !urlData.publicUrl) {
          throw new Error("Could not get public URL after upload.");
        }
        uploadedImageUrl = urlData.publicUrl;
        console.log("Image uploaded successfully:", uploadedImageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        setUploadError(`Image upload failed: ${(error as Error).message}`);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    setIsSaving(true);
    try {
      const cardPayload = {
        recipient_name: recipientName,
        message: message,
        image_url: uploadedImageUrl,
        image_caption: uploadedImageUrl ? caption : null,
        sender_name: senderName,
        card_date: cardDate,
      };
      console.log("Saving card data:", cardPayload);

      const { data, error } = await supabase
        .from("cards")
        .insert([cardPayload])
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const cardId = data.id;
        const link = `${window.location.origin}/card/${cardId}`;
        setGeneratedLink(link);
        console.log("Card saved successfully! Link:", link);
        setImageFile(null);
        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
        setCaption("");
      } else {
        console.error("No data returned after insert.");
        alert("Failed to save card details after potential upload.");
      }
    } catch (error) {
      console.error("Error saving card data:", error);
      alert(`Failed to save card details: ${(error as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPreview = () => {
    if (!audioRef.current) return;
    setIsOpen(true);
    setFocusedField(null);
    audioRef.current.currentTime = 0;
    audioRef.current
      .play()
      .catch((e) => console.error("Audio play failed:", e));
    setTimeout(() => {
      setIsUnfurled(true);
    }, 1000);
  };

  const handleClosePreview = () => {
    setIsUnfurled(false);
    audioRef.current?.pause();
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const togglePreview = () => {
    const nextPreviewState = !isPreviewing;
    setIsPreviewing(nextPreviewState);
    if (!nextPreviewState) {
      setIsOpen(false);
      setIsUnfurled(false);
      audioRef.current?.pause();
    } else {
      setFocusedField(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }

    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setUploadError(null);
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setFocusedField("content");
    } else {
      setImageFile(null);
    }
    event.target.value = "";
  };

  const clearImage = () => {
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
    setCaption("");
    setUploadError(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      <AnimatePresence>
        {!isPreviewing && (
          <motion.div
            key="editor-panel"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white shadow-lg h-screen flex flex-col"
          >
            <div className="flex-grow overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold mb-6 text-gray-700">
                Card Builder
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Card Style
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Birthday Style (Default)</option>
                  {/* TODO: Add more styles later */}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    !recipientName.trim() ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter recipient's name"
                  onFocus={() => setFocusedField("recipient")}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    !message.trim() ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Write your personal message"
                  onFocus={() => setFocusedField("content")}
                  required
                />
              </div>

              <div className="mb-4 space-y-2">
                <Label>Image (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="image-upload"
                    className={`flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                      isUploading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                  >
                    {imageFile ? "Change Image" : "Choose Image"}
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    onFocus={() => setFocusedField("content")}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
                {imageFile && (
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <span>{imageFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearImage}
                      className="text-red-500 hover:text-red-700 h-auto p-1"
                    >
                      X
                    </Button>
                  </div>
                )}
                {uploadError && (
                  <p className="mt-1 text-xs text-red-600">{uploadError}</p>
                )}
                {isUploading && (
                  <p className="mt-1 text-xs text-indigo-600">Uploading...</p>
                )}
              </div>

              {imageFile && (
                <div className="mb-4 space-y-2">
                  <Label htmlFor="caption-input">
                    Image Caption (Optional)
                  </Label>
                  <Input
                    id="caption-input"
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Optional image caption"
                    onFocus={() => setFocusedField("content")}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Sender Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    !senderName.trim() ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter your name or signature"
                  onFocus={() => setFocusedField("content")}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardDate}
                  onChange={(e) => setCardDate(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    !cardDate.trim() ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., June 20, 2024"
                  onFocus={() => setFocusedField("content")}
                  required
                />
              </div>
            </div>

            <div className="mt-auto pt-6">
              <div className="mb-4">
                <Button
                  onClick={handleCreateCard}
                  disabled={isSaving || isUploading || !isFormValid}
                  className="w-full"
                  variant={
                    isSaving || isUploading || !isFormValid
                      ? "secondary"
                      : "default"
                  }
                >
                  {isSaving
                    ? "Saving Card..."
                    : isUploading
                    ? "Uploading Image..."
                    : "Create Card"}
                </Button>
              </div>

              {generatedLink && (
                <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-md text-sm">
                  <p className="font-semibold text-green-800 mb-1">
                    Card created! Share this link:
                  </p>
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 text-xs"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`relative flex-grow h-screen overflow-y-auto transition-all duration-300 ease-easeInOut ${
          isPreviewing ? "w-full" : "w-full md:w-2/3 lg:w-3/4"
        }`}
      >
        <FloatingElements />

        <div className="relative flex flex-col items-center justify-center min-h-full px-4 py-10">
          <AnimatePresence mode="wait">
            {isPreviewing ? (
              <>
                {!isOpen ? (
                  <motion.div
                    key="preview-closed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                  >
                    <ClosedLetter
                      onOpen={handleOpenPreview}
                      recipientName={recipientName || "Recipient Name"}
                    />
                  </motion.div>
                ) : (
                  <>
                    <CardDisplay
                      key="preview-open"
                      isUnfurled={isUnfurled}
                      message={message}
                      imageUrl={imagePreviewUrl}
                      caption={caption || null}
                      senderName={senderName}
                      cardDate={cardDate}
                    />
                    <div className="mt-12 flex justify-center pb-20">
                      <button
                        onClick={handleClosePreview}
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
                      >
                        Close Preview Letter
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {focusedField === "content" ? (
                  <CardDisplay
                    key="editor-open"
                    isUnfurled={true}
                    message={message}
                    imageUrl={imagePreviewUrl}
                    caption={caption || null}
                    senderName={senderName}
                    cardDate={cardDate}
                  />
                ) : (
                  <motion.div
                    key="editor-closed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                  >
                    <ClosedLetter
                      recipientName={recipientName || "Recipient Name"}
                    />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        <Button
          onClick={togglePreview}
          variant="secondary"
          className="fixed bottom-6 right-6 z-50 shadow-lg flex items-center space-x-2"
        >
          <span>{isPreviewing ? "Back to Editor" : "Preview Card"}</span>
        </Button>
      </div>
    </div>
  );
}
