import React, { useEffect, useRef } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';

interface MatrixRainProps {
  active: boolean;
  color?: string;
  onClose?: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ active, color = '#22c55e', onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useModalA11y({
    isOpen: active,
    onClose,
    dialogRef,
    initialFocusRef: closeButtonRef,
  });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンSSFUDEV<>{}[]!@#$%^&*()_+=~';
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = new Array(columns).fill(1).map(() => Math.floor(Math.random() * -50));

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw character
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [active, color]);

  if (!active) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Matrix stream"
      className="fixed inset-0 z-40 bg-black/90 pointer-events-auto flex flex-col items-center justify-center"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-50 text-center px-4 py-3 bg-black/80 border border-emerald-500/50 rounded-lg shadow-2xl backdrop-blur-md max-w-sm mx-auto">
        <p className="text-emerald-400 font-bold mb-2 tracking-wide text-sm">MATRIX STREAM ACTIVE</p>
        <p className="text-xs text-neutral-400 mb-3">Press Escape, click below, or type 'matrix' to toggle off</p>
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="px-4 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs border border-emerald-500/50 rounded transition-colors cursor-pointer"
        >
          Exit Matrix (Escape)
        </button>
      </div>
    </div>
  );
};
