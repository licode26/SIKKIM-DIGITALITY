import React, { useRef, useEffect } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles: Particle[] = [];

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeHandler);

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.y -= this.speedY;
        if (this.y < 0) {
          this.y = height;
          this.x = Math.random() * width;
        }
      }

      draw() {
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(45, 212, 191, ${this.opacity})`;
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
      const particleCount = Math.floor((width * height) / 10000);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx!.clearRect(0, 0, width, height);
      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;