import { useEffect, useState } from "react";

export default function useCounter() {
  const [counter, setCounter] = useState(0);
  const [startCounter, setStartCounter] = useState(false);

  useEffect(() => {
    let interval: number;

    if (startCounter) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter + 1);
      }, 1000);
    }

    return () => clearInterval(interval);

  }, [startCounter]);

  return { counter, setCounter, setStartCounter };
}
