"use client"

import { motion } from "framer-motion"

export default function Dumpling() {
  return (
    <div className="relative w-16 h-16">
      {/* Dumpling body */}
      <motion.div
        className="absolute w-16 h-12 bg-amber-100 rounded-full bottom-0 shadow-md"
        animate={{
          y: [0, -5, 0],
          scaleX: [1, 1.05, 1],
          scaleY: [1, 0.95, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Dumpling pleats */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[1px] bg-amber-300"></div>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-amber-300"
          style={{ transform: "translateX(-50%) rotate(10deg)" }}
        ></div>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-amber-300"
          style={{ transform: "translateX(-50%) rotate(-10deg)" }}
        ></div>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-amber-300"
          style={{ transform: "translateX(-50%) rotate(20deg)" }}
        ></div>
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-amber-300"
          style={{ transform: "translateX(-50%) rotate(-20deg)" }}
        ></div>
      </motion.div>

      {/* Face */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-10 flex justify-center">
        {/* Eyes */}
        <motion.div
          className="flex space-x-4"
          animate={{
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.1,
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-800"></div>
        </motion.div>
      </div>

      {/* Blush */}
      <div className="absolute bottom-2 left-3 w-2 h-1 rounded-full bg-pink-300 opacity-60"></div>
      <div className="absolute bottom-2 right-3 w-2 h-1 rounded-full bg-pink-300 opacity-60"></div>

      {/* Smile */}
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 border-b-2 border-gray-800 rounded-full"
        animate={{
          width: [16, 14, 16],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      ></motion.div>
    </div>
  )
}
