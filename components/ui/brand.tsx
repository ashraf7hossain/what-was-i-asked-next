"use client";
import { useEffect, useState } from 'react';

export default function Brand() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // Ensure the component is hydrated before applying animations
  }, []);

  if (!hydrated) {
    return null; // Avoid rendering mismatched content during hydration
  }

  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 50" style={{ width: '100%', height: '100%' }}>
        <style>
          {`
            .text {
              font-family: monospace;
              font-size: 24px;
              fill: none;
              stroke: black;
              stroke-width: 1;
              stroke-dasharray: 140;
              stroke-dashoffset: 140;
              opacity: 0;
              animation: writeText 3s linear forwards infinite, fadeInOut 3s linear infinite;
            }

            @keyframes writeText {
              0%, 100% { 
                stroke-dashoffset: 140;
                opacity: 0;
              }
              10%, 90% {
                opacity: 1;
              }
              50% { 
                stroke-dashoffset: 0;
                opacity: 1;
              }
            }

            @keyframes fadeInOut {
              0%, 100% { 
                opacity: 0;
              }
              10%, 90% {
                opacity: 1;
              }
            }
          `}
        </style>
        <text x="50" y="25" className="text">
          What was I asked?
        </text>
      </svg>
    </div>
  );
}
