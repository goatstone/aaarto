"use client";
import React, { useEffect, useState } from "react";

export default function AaartoButton() {
  const [a, setA] = useState<string>();
  useEffect(() => {
    const el = document.getElementById("art");
    setA(el?.outerHTML);
  }, []);
  const abc = () => {
    const req = new Request("http://localhost:8000/addfile", {
      method: "POST",
      body: JSON.stringify({ art: a }),
      headers: { "Content-Type": "application/json" },
    });
    fetch(req);
  };
  return <button onClick={abc}>Add an Aaarto</button>;
}
