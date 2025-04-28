import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulateProgress = () => {
      setProgress(0);
      setIsLoading(true);

      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prevProgress + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    };

    simulateProgress();
  }, []);

  useEffect(() => {
    if (progress === 90) {
      const timeout = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-blood/20 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="h-full bg-blood"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default LoadingProgress; 