'use client';

import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Check if cursor is enabled
    const saved = localStorage.getItem('customCursorEnabled');
    if (saved !== null) {
      setIsEnabled(saved === 'true');
    }

    // Listen for changes
    const handleStorageChange = () => {
      const saved = localStorage.getItem('customCursorEnabled');
      setIsEnabled(saved !== 'false');
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (fallback)
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
      desynchronized: true // Better performance
    });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };

    // Reduced params for better performance
    const params = {
      pointsNumber: 25, // Reduced from 40
      widthFactor: 0.25, // Reduced from 0.3
      spring: 0.2, // Reduced from 0.35 - slower, more stable
      friction: 0.8, // Increased from 0.6 - faster settling, less fly-away
    };

    const trail: Array<{ x: number; y: number; dx: number; dy: number }> = [];
    for (let i = 0; i < params.pointsNumber; i++) {
      trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
      };
    }

    let lastUpdateTime = 0;
    const updateInterval = 1000 / 60; // 60 FPS cap

    // Auto-scroll variables
    let scrollSpeed = 0;
    const scrollZone = 100; // pixels from edge to trigger scroll
    const maxScrollSpeed = 20;

    const updateMousePosition = (eX: number, eY: number) => {
      pointer.x = eX;
      pointer.y = eY;

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
    };

    const handleTouchMove = (e: TouchEvent) => {
      updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    const update = (currentTime: number) => {
      if (!ctx || !canvas) return;

      // Throttle updates for better performance
      if (currentTime - lastUpdateTime < updateInterval) {
        rafIdRef.current = requestAnimationFrame(update);
        return;
      }
      lastUpdateTime = currentTime;

      // Apply auto-scroll
      if (scrollSpeed !== 0) {
        window.scrollBy(0, scrollSpeed);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.2 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      rafIdRef.current = requestAnimationFrame(update);
    };

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', setupCanvas, { passive: true });

    rafIdRef.current = requestAnimationFrame(update);

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
    <div className="custom-cursor-wrapper">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
      />
    </div>
  );
}
