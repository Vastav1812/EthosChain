import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const PARTICLE_COUNT = 60;
const CONNECTION_DISTANCE = 100;
const MOUSE_INFLUENCE_DISTANCE = 120;

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const [mousePosition, setMousePosition] = useState<{ x: number, y: number } | null>(null);
  
  // Neon colors for the particles
  const particleColors = [
    'rgba(67, 97, 238, 0.3)',
    'rgba(76, 201, 240, 0.3)',
    'rgba(16, 185, 129, 0.3)',
    'rgba(247, 37, 133, 0.3)',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-create particles when canvas resizes
      initParticles();
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      opacity: Math.random() * 0.4 + 0.2,
      pulse: 0,
      pulseSpeed: Math.random() * 0.01 + 0.005,
    });

    const initParticles = () => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, createParticle);
    };

    const drawConnection = (particle1: Particle, particle2: Particle, distance: number) => {
      if (!ctx) return;
      
      const opacity = 1 - distance / CONNECTION_DISTANCE;
      const gradient = ctx.createLinearGradient(
        particle1.x, particle1.y, 
        particle2.x, particle2.y
      );
      
      gradient.addColorStop(0, particle1.color.replace('0.8', `${opacity * 0.4}`));
      gradient.addColorStop(1, particle2.color.replace('0.8', `${opacity * 0.4}`));
      
      ctx.beginPath();
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 0.5;
      ctx.moveTo(particle1.x, particle1.y);
      ctx.lineTo(particle2.x, particle2.y);
      ctx.stroke();
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Pulse effect
        particle.pulse += particle.pulseSpeed;
        if (particle.pulse > 1 || particle.pulse < 0) {
          particle.pulseSpeed *= -1;
        }
        
        // Move particle
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Mouse influence
        if (mousePosition) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < MOUSE_INFLUENCE_DISTANCE) {
            const forceX = dx / distance * 0.2;
            const forceY = dy / distance * 0.2;
            particle.speedX = (particle.speedX - forceX) * 0.98;
            particle.speedY = (particle.speedY - forceY) * 0.98;
          }
        }

        // Draw particle
        const size = particle.size * (1 + particle.pulse * 0.3);
        ctx.beginPath();
        ctx.fillStyle = particle.color.replace('0.8', `${particle.opacity}`);
        
        // Glow effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = particle.color.replace('0.8', '0.6');
        
        ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Reset shadow settings for connections
        ctx.shadowBlur = 0;
        
        // Draw connections to nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const otherParticle = particlesRef.current[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < CONNECTION_DISTANCE) {
            drawConnection(particle, otherParticle, distance);
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseLeave = () => {
      setMousePosition(null);
    };

    // Setup
    resizeCanvas();
    animate();
    
    // Event listeners
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-[var(--z-particles)] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
};

export default ParticleBackground; 