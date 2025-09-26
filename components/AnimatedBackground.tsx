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
    const gridSize = 40;
    
    const init = () => {
      particles = [];
      const particleCount = Math.floor((width * height) / (gridSize * gridSize * 1.5));
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const resizeHandler = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', resizeHandler);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
        this.maxLife = this.life = Math.floor(Math.random() * 100) + 50;
        
        const speed = Math.random() * 1.5 + 0.5;
        if (Math.random() > 0.5) {
            this.vx = Math.random() > 0.5 ? speed : -speed;
            this.vy = 0;
        } else {
            this.vx = 0;
            this.vy = Math.random() > 0.5 ? speed : -speed;
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        if (this.life <= 0 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.reset();
        }
      }
      
      reset() {
        this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
        this.maxLife = this.life = Math.floor(Math.random() * 100) + 50;
        
        const speed = Math.random() * 1.5 + 0.5;
        if (Math.random() > 0.5) {
            this.vx = Math.random() > 0.5 ? speed : -speed;
            this.vy = 0;
        } else {
            this.vx = 0;
            this.vy = Math.random() > 0.5 ? speed : -speed;
        }
      }

      draw() {
        const opacity = Math.max(0, this.life / this.maxLife);
        ctx!.fillStyle = `rgba(45, 212, 191, ${opacity * 0.8})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const drawGridDots = () => {
        ctx!.fillStyle = 'rgba(45, 212, 191, 0.1)';
        for (let x = gridSize / 2; x < width; x += gridSize) {
            for (let y = gridSize / 2; y < height; y += gridSize) {
                ctx!.beginPath();
                ctx!.arc(x, y, 0.7, 0, Math.PI * 2);
                ctx!.fill();
            }
        }
    };
    
    let animationFrameId: number;
    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      drawGridDots();

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default AnimatedBackground;
