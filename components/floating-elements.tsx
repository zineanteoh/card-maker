"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type FloatingElement = {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  duration: number;
  type: "petal" | "sparkle";
};

export default function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    // Generate random elements
    const newElements: FloatingElement[] = [];

    // Generate petals
    for (let i = 0; i < 15; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 15,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        duration: Math.random() * 8 + 12,
        type: "petal",
      });
    }

    // Generate sparkles
    for (let i = 15; i < 30; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        duration: Math.random() * 5 + 3,
        type: "sparkle",
      });
    }

    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            width: element.size,
            height:
              element.type === "petal" ? element.size * 0.8 : element.size,
          }}
          initial={{
            opacity: 0,
            rotate: element.rotation,
            scale: element.type === "sparkle" ? 0 : 1,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: element.type === "petal" ? [0, 100] : [0, -20, 0],
            x:
              element.type === "petal"
                ? [0, element.x > 50 ? 50 : -50]
                : [0, 0],
            rotate:
              element.type === "petal"
                ? [element.rotation, element.rotation + 360]
                : [0, 360],
            scale: element.type === "sparkle" ? [0, 1, 0] : [1, 1, 0.8],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {element.type === "petal" ? (
            <div
              className="w-full h-full rounded-full bg-pink-200 opacity-90"
              style={{
                borderRadius: "100% 0 100% 0",
                boxShadow: "0 0 5px rgba(244, 114, 182, 0.3)",
              }}
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(251,191,36,0) 70%)",
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
