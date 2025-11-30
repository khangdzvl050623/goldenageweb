// src/components/effects/FloatingElements.jsx
import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const FloatingElements = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Tạo floating particles
    const particleCount = 25;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 10 + 4;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const opacity = Math.random() * 0.6 + 0.2;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        filter: blur(1px);
        animation: float-particle ${duration}s linear infinite;
        animation-delay: ${delay}s;
        box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.8});
        pointer-events: none;
      `;

      container.appendChild(particle);
      particles.push(particle);
    }

    // Thêm CSS animations
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes float-particle {
        0% {
          transform: translateY(100vh) translateX(0) rotate(0deg) scale(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
          transform: translateY(90vh) translateX(10px) rotate(45deg) scale(1);
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-10vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg) scale(0.5);
          opacity: 0;
        }
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 30px rgba(147, 51, 234, 0.4), 0 0 60px rgba(59, 130, 246, 0.3);
          transform: scale(1);
        }
        50% {
          box-shadow: 0 0 50px rgba(147, 51, 234, 0.6), 0 0 80px rgba(59, 130, 246, 0.5);
          transform: scale(1.05);
        }
      }

      @keyframes float-orb {
        0%, 100% {
          transform: translate(0, 0) scale(1);
        }
        25% {
          transform: translate(20px, -20px) scale(1.1);
        }
        50% {
          transform: translate(-20px, 20px) scale(0.9);
        }
        75% {
          transform: translate(20px, 20px) scale(1.05);
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      particles.forEach((p) => p.remove());
      styleSheet.remove();
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      position="absolute"
      inset="0"
      overflow="hidden"
      pointerEvents="none"
      zIndex={0}
    >
      {/* Glowing orbs với animation */}
      <Box
        position="absolute"
        top="20%"
        left="15%"
        w="400px"
        h="400px"
        bgGradient="radial(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(60px)"
        animation="pulse-glow 4s ease-in-out infinite, float-orb 15s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="15%"
        right="20%"
        w="500px"
        h="500px"
        bgGradient="radial(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(70px)"
        animation="pulse-glow 5s ease-in-out infinite 1s, float-orb 18s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        top="50%"
        right="25%"
        w="350px"
        h="350px"
        bgGradient="radial(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(50px)"
        animation="pulse-glow 6s ease-in-out infinite 2s, float-orb 20s ease-in-out infinite"
      />

      {/* Thêm orb nhỏ hơn để tạo chiều sâu */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        w="250px"
        h="250px"
        bgGradient="radial(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(40px)"
        animation="float-orb 12s ease-in-out infinite"
      />
      <Box
        position="absolute"
        bottom="25%"
        left="25%"
        w="300px"
        h="300px"
        bgGradient="radial(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)"
        borderRadius="full"
        filter="blur(45px)"
        animation="float-orb 16s ease-in-out infinite reverse"
      />
    </Box>
  );
};

export default FloatingElements;
