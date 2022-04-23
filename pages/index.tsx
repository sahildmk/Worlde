import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

let grid: Array<string> = [...Array(30)];

const Home: NextPage = () => {

  const wordSize: number = 5;
  const [keyCount, setKeyCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const keyPressHandler = useCallback((event) => {

    if (event.key >= "a" && event.key <= "z") {
      // restrict typing into next guess
      if (keyCount < wordSize * (wordCount + 1)) {
        grid[keyCount] = event.key;
        setKeyCount(keyCount + 1);
        setWordCount(Math.floor(keyCount / wordSize));
      }
    }

    else if (event.key === "Backspace") {
      // restrict backspacing beyond last guess
      if (keyCount != wordSize * wordCount) {
        grid[keyCount - 1] = "";
        grid[keyCount] = "";
        setKeyCount(Math.max(0, keyCount - 1));
        setWordCount(Math.floor(keyCount / wordSize));
      }
    }

    else if (event.key === "Enter") {
      let attempt: string = "";
      if (keyCount % wordSize === 0) {
        for (let i = 0; i < 5; i++) {
          attempt += `${grid[wordCount * wordSize + i]}`;
        }
        console.log(`guess: ${attempt}`);
      }
    }

  }, [keyCount]);

  if (typeof window !== "undefined") {
    useEventListener("keydown", keyPressHandler, window);
  }

  return (
    <div className="flex h-screen flex-col items-center bg-slate-900 text-white">
      <Head>
        <title>Wordle Clone</title>
      </Head>
      <nav>hi</nav>
      <main className="">
        <div className="grid grid-cols-5 grid-rows-6 gap-3">
          {grid.map((value, index) => (
            <div
              id={index.toString()}
              key={index}
              className="grid place-items-center rounded-md border-2 border-solid border-slate-600 text-4xl font-bold uppercase sm:h-24 sm:w-24"
            >
              {value}
            </div>
          ))}
        </div>
      </main>
      <footer>footer</footer>
    </div>
  );
};

const useEventListener = (
  eventName: string,
  handler: Function,
  element: Window
) => {
  const savedHandler = useRef<Function>();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) => savedHandler.current!(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

export default Home;
