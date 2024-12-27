import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterEffectProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  typingSpeed = 500, 
  deletingSpeed = 50,  
  pauseDuration = 1500  
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const currentWord = words[currentWordIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      // Typing
      if (text.length < currentWord.length) {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1));
        }, typingSpeed + Math.random() * 50); // Add slight randomness
      } else {
        setIsPaused(true);
      }
    } else {
      // Deleting
      if (text.length > 0) {
        timer = setTimeout(() => {
          setText(text.slice(0, -1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, currentWordIndex, words, isPaused, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="inline-flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.span
          key={text}
          className="inline-block min-w-[20px]"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
        >
          {text}
        </motion.span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: "linear",
            repeatType: "reverse"
          }}
          className="ml-1 inline-block w-[2px] h-5 bg-primary"
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Example usage component
const Example = () => {
  return (
    <div className="p-4">
      <TypewriterEffect 
        words={[
          "Developer",
          "Designer",
          "Creator"
        ]}
        typingSpeed={100}
        deletingSpeed={50}
        pauseDuration={1500}
      />
    </div>
  );
};

export default Example;