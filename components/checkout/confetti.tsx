'use client';

import { useEffect } from 'react';

const ConfettiGenerator = require('confetti-js').default;

export default function Confetti() {
  useEffect(() => {
    var shopConfetti = {
      target: 'confetti-canvas',
      max: '120',
      size: '3',
      animate: true,
      props: ['circle', 'square', 'triangle'],
      colors: [
        [212, 175, 55],
        [232, 185, 35],
        [193, 152, 20],
        [218, 165, 32]
      ],
      clock: '70',
      rotate: true,
      start_from_edge: false,
      respawn: true
    };
    var confetti = new ConfettiGenerator(shopConfetti);
    confetti.render();
  }, []);

  return (
    <canvas
      id="confetti-canvas"
      className="pointer-events-none absolute left-0 top-0 z-50 h-full w-full motion-reduce:hidden"
    ></canvas>
  );
}
