import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 20;
const CHARS = "!@#$%^&*():{};|,.<>/?";

const ScrambleText = ({ children, className }) => {
  const intervalRef = useRef(null);
  const [text, setText] = useState(children);

  const stopScramble = () => {
    clearInterval(intervalRef.current);
    setText(children);
  };

  const scramble = () => {
    let pos = 0;

    intervalRef.current = setInterval(() => {
      const scrambled = children
        .split("")
        .map((char, index) => {
          if (pos / CYCLES_PER_LETTER > index) {
            return char;
          }

          const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          return randomChar;
        })
        .join("");

      setText(scrambled);
      pos++;

      if (pos >= children.length * CYCLES_PER_LETTER) {
        stopScramble();
      }
    }, SHUFFLE_TIME);
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }} // Optional subtle zoom
      onMouseEnter={scramble}
      onMouseLeave={stopScramble}
      className={className}
      style={{ display: "inline-block", cursor: "default" }}
    >
      {text}
    </motion.span>
  );
};

export default ScrambleText;
