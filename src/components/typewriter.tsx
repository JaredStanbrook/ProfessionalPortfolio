import { useEffect, useState } from "react";

const words = ["Hi, I'm Jared.", "Looking for my portfolio?", "Tap here!"];

export default function Typewriter() {
  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [forwards, setForwards] = useState(true);
  const [skipCount, setSkipCount] = useState(0);

  const skipDelay = 15;
  const speed = 70;

  useEffect(() => {
    const interval = setInterval(() => {
      const currentWord = words[index];

      // Typing forward
      if (forwards) {
        if (offset >= currentWord.length) {
          setSkipCount((c) => c + 1);
          if (skipCount === skipDelay) {
            setForwards(false);
            setSkipCount(0);
          }
        } else {
          setOffset((o) => o + 1);
        }
      }

      // Deleting backward
      else {
        if (offset === 0) {
          setForwards(true);
          setIndex((i) => (i + 1 >= words.length ? 0 : i + 1));
        } else {
          setOffset((o) => o - 1);
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [index, offset, forwards, skipCount]);

  return (
    <span className="text-3xl">
      {words[index].substring(0, offset)}
      <span className="border-r-2 ml-1 animate-pulse"> </span>
    </span>
  );
}
