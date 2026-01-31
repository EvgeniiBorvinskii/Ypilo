'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export function SmokeCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('smokeCursorEnabled');
    if (saved !== null) {
      setIsEnabled(saved === 'true');
    } else {
      // Enable smoke cursor by default on first visit
      setIsEnabled(true);
      localStorage.setItem('smokeCursorEnabled', 'true');
      localStorage.setItem('customCursorEnabled', 'false');
    }

    const handleStorageChange = () => {
      const saved = localStorage.getItem('smokeCursorEnabled');
      setIsEnabled(saved === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { 
      alpha: true,
      desynchronized: true
    });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let hue = 0;

    // Auto-scroll variables
    let scrollSpeed = 0;
    const scrollZone = 100; // pixels from edge to trigger scroll
    const maxScrollSpeed = 20;

    const updateMousePosition = (eX: number, eY: number) => {
      mouse.x = eX;
      mouse.y = eY;

      // Auto-scroll logic
      const windowHeight = window.innerHeight;
      const distanceFromTop = eY;
      const distanceFromBottom = windowHeight - eY;

      if (distanceFromTop < scrollZone) {
        // Near top - scroll up
        scrollSpeed = -((scrollZone - distanceFromTop) / scrollZone) * maxScrollSpeed;
      } else if (distanceFromBottom < scrollZone) {
        // Near bottom - scroll down
        scrollSpeed = ((scrollZone - distanceFromBottom) / scrollZone) * maxScrollSpeed;
      } else {
        scrollSpeed = 0;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateMousePosition(e.clientX, e.clientY);
      
      // Create particles on mouse move
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: 1,
          size: Math.random() * 20 + 10,
          hue: hue
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: 1,
          size: Math.random() * 20 + 10,
          hue: hue
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const animate = () => {
      if (!ctx || !canvas) return;

      // Fade effect instead of clear
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply auto-scroll
      if (scrollSpeed !== 0) {
        window.scrollBy(0, scrollSpeed);
      }

      // Update hue
      hue += 0.5;
      if (hue > 360) hue = 0;

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.life -= 0.01;
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 1.02; // Grow
        p.vx *= 0.99; // Slow down
        p.vy *= 0.99;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const opacity = p.life * 0.3; // Reduced from 0.5 to 0.3 for more transparency
        ctx.beginPath();
        
        // Create gradient for glow effect with more transparency
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, ${opacity * 0.8})`);
        gradient.addColorStop(0.5, `hsla(${p.hue}, 100%, 50%, ${opacity * 0.4})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 100%, 30%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', setupCanvas, { passive: true });

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', setupCanvas);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="smoke-cursor-wrapper">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
        style={{ mixBlendMode: 'screen' }}
      />
    </div>
  );
}
