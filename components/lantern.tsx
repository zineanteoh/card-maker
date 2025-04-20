"use client"

import { motion } from "framer-motion"

type LanternProps = {
  size: "sm" | "md" | "lg"
  color: "red" | "gold"
}

export default function Lantern({ size, color }: LanternProps) {
  const dimensions = {
    sm: { width: 40, height: 60 },
    md: { width: 60, height: 90 },
    lg: { width: 80, height: 120 },
  }

  const { width, height } = dimensions[size]
  const baseColor = color === "red" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)"
  const glowColor = color === "red" ? "rgba(220, 38, 38, 0.3)" : "rgba(234, 179, 8, 0.3)"

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  const glowAnimation = {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 3,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <motion.div animate={floatAnimation} className="relative" style={{ width, height }}>
      {/* Lantern glow */}
      <motion.div
        animate={glowAnimation}
        className="absolute inset-0 rounded-full blur-xl -z-10"
        style={{
          backgroundColor: glowColor,
          width: width * 1.5,
          height: height * 1.5,
          left: -width * 0.25,
          top: -height * 0.1,
        }}
      />

      {/* Lantern body */}
      <div className="relative h-full w-full">
        {/* Top */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[10%] rounded-t-lg"
          style={{ backgroundColor: baseColor }}
        />

        {/* Body */}
        <div className="absolute top-[10%] left-0 w-full h-[75%] rounded-xl" style={{ backgroundColor: baseColor }}>
          {/* Decorative lines */}
          <div className="absolute top-[20%] w-full h-[1px] bg-amber-200/70"></div>
          <div className="absolute top-[40%] w-full h-[1px] bg-amber-200/70"></div>
          <div className="absolute top-[60%] w-full h-[1px] bg-amber-200/70"></div>
          <div className="absolute top-[80%] w-full h-[1px] bg-amber-200/70"></div>

          {/* Chinese character */}
          <div className="absolute inset-0 flex items-center justify-center text-amber-200 font-calligraphy">
            <span style={{ fontSize: width * 0.4 }}>福</span>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[15%] rounded-b-lg"
          style={{ backgroundColor: baseColor }}
        />

        {/* Tassel */}
        <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[2px] h-[20%] bg-amber-600"></div>
      </div>
    </motion.div>
  )
}
