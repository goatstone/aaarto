"use client";
import React, { useEffect, useState } from "react";

export default function AaartoButton() {
  const handleClick = () => {
    const el = document.getElementById("art");
    const req = new Request("http://localhost:8000/mintart", {
      method: "POST",
      body: JSON.stringify({ art: el?.outerHTML }),
      headers: { "Content-Type": "application/json" },
    });
    fetch(req);
  };
  return <button onClick={handleClick}>Add an Aaarto</button>;
}
