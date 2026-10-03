"use client";

import { CountUp } from "countup.js";
import { useEffect, useRef } from "react";

type countProps = {
  total: number;
};

export default function Counter({ total }: countProps) {
  const counterRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!counterRef.current) return;

    const counter = new CountUp(counterRef.current, total, {
      duration: 2,
      useEasing: true,
      separator: "",
    });

    counter.start();
  }, [total]);

  return (
    <>
           <h1 ref={counterRef} className="md:text-2xl text-xl font-bold">-</h1>
    </>
  )
}
