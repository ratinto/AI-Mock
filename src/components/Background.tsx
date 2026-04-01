import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Star properties
    const STAR_COUNT = 150; // Fewer, cleaner stars
    const stars: { x: number; y: number; s: number; o: number; vx: number; vy: number }[] = [];

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          s: Math.random() * 1.5 + 0.5, // Size
          o: Math.random(), // Opacity
          vx: (Math.random() - 0.5) * 0.2, // Velocity X (very slow)
          vy: (Math.random() - 0.5) * 0.2, // Velocity Y
        });
      }
    };

    const update = () => {
      ctx.fillStyle = '#050505'; // Match --bg-dark
      ctx.fillRect(0, 0, width, height);

      // Subtle mouse influence
      const mx = (mouseRef.current.x - width / 2) * 0.01;
      const my = (mouseRef.current.y - height / 2) * 0.01;

      for (let i = 0; i < STAR_COUNT; i++) {
        const star = stars[i];
        
        // Update position with drift and subtle mouse follow
        star.x += star.vx + mx * (star.s * 0.5);
        star.y += star.vy + my * (star.s * 0.5);

        // Twinkle (opacity oscillation)
        star.o += (Math.random() - 0.5) * 0.02;
        if (star.o < 0) star.o = 0;
        if (star.o > 1) star.o = 1;

        // Wrap around screen
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        // Draw Star
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.o * 0.8})`;
        ctx.arc(star.x, star.y, star.s, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a very subtle glow to brighter stars
        if (star.s > 1.2) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 255, 255, ${star.o * 0.1})`;
          ctx.arc(star.x, star.y, star.s * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    const handleResize = () => {
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    init();
    update();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: '#000',
        pointerEvents: 'none'
      }}
    />
  );
};

export default Background;
