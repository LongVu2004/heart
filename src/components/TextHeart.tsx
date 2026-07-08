import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    let centerAlpha = 0;
    const text = "i love you";
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 45;

      // Heart equation: 
      // x = 16 sin^3(t)
      // y = -(13 cos(t) - 5 cos(2t) - 2 cos(3t) - cos(4t))
      
      for (let t = 0; t < Math.PI * 2; t += 0.08) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          alpha: 0,
          targetAlpha: 0.9 + Math.random() * 0.1,
          delay: Math.random() * 2000
        });
      }

      // Add sparse inner layer
      for (let t = 0; t < Math.PI * 2; t += 0.12) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        points.push({
          x: centerX + x * scale * 0.6,
          y: centerY + y * scale * 0.6,
          alpha: 0,
          targetAlpha: 0.5 + Math.random() * 0.3,
          delay: Math.random() * 3000
        });
      }
    };

    let start: number | null = null;
    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px "Fira Code", monospace`;
      
      points.forEach(p => {
        if (elapsed > p.delay) {
            p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        ctx.fillStyle = `rgba(255, 77, 109, ${p.alpha})`;
        ctx.fillText(text, p.x - ctx.measureText(text).width / 2, p.y);
      });

      // Center text
      if (elapsed > 3000) {
        centerAlpha += (1 - centerAlpha) * 0.02;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const fontSizeBig = Math.min(canvas.width, canvas.height) / 22;
        
        ctx.save();
        ctx.font = `600 ${fontSizeBig}px "Inter", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Glow effect
        ctx.shadowColor = 'rgba(255, 77, 109, 0.6)';
        ctx.shadowBlur = 30;
        ctx.fillStyle = `rgba(255, 77, 109, ${centerAlpha})`;
        ctx.fillText('iu pé Trân', centerX, centerY);
        
        // Overlay brighter text
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 143, 177, ${centerAlpha})`;
        ctx.fillText('iu pé Trân', centerX, centerY);
        
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
