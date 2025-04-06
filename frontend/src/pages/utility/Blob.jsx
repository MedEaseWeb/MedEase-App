import React from "react";
import { motion } from "framer-motion";

export default function Blob() {
  return (
    <motion.div
      style={{
        position: "fixed",
        top: "-20%",
        left: "-20%",
        width: "150%",
        height: "150%",
        zIndex: 0,
      }}
    >
      <svg
        viewBox="-90 -10 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%" }}
      >
        {/* Layer 1 */}
        <motion.path
          fill="#0A2A3F"
          initial={{
            d: "M60,60 Q80,80,60,100 Q40,120,20,100 Q0,80,20,60 Q40,40,60,60",
          }}
          animate={{
            d: [
              "M60,60 Q80,80,60,100 Q40,120,20,100 Q0,80,20,60 Q40,40,60,60",
              "M62,65 Q85,85,62,102 Q38,120,18,98 Q-2,75,18,55 Q38,35,62,65",
              "M58,58 Q78,78,58,98 Q38,118,18,95 Q-2,72,18,52 Q38,32,58,58",
            ],
            x: [-15, 10, -15],
            y: [-5, 5, -5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Layer 2 */}
        <motion.path
          fill="#112F45"
          initial={{
            d: "M80,80 Q100,100,80,120 Q60,140,40,120 Q20,100,40,80 Q60,60,80,80",
          }}
          animate={{
            d: [
              "M80,80 Q100,100,80,120 Q60,140,40,120 Q20,100,40,80 Q60,60,80,80",
              "M78,82 Q95,95,78,118 Q60,138,38,118 Q20,98,38,78 Q60,58,78,82",
              "M82,78 Q105,95,82,115 Q58,135,35,112 Q10,90,35,70 Q58,50,82,78",
            ],
            x: [10, -10, 10],
            y: [-8, 8, -8],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Layer 3 */}
        <motion.path
          fill="#1B4965"
          initial={{
            d: "M90,90 Q120,120,90,140 Q60,160,30,140 Q0,120,30,90 Q60,60,90,90",
          }}
          animate={{
            d: [
              "M90,90 Q120,120,90,140 Q60,160,30,140 Q0,120,30,90 Q60,60,90,90",
              "M92,92 Q125,125,92,142 Q58,158,28,135 Q-5,110,28,85 Q58,55,92,92",
              "M88,88 Q118,118,88,138 Q58,158,28,132 Q-2,108,28,80 Q58,52,88,88",
            ],
            x: [-10, 15, -10],
            y: [12, -12, 12],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>
    </motion.div>
  );
}
