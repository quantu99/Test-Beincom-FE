/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => Promise.resolve(ThreeSceneComponent), {
  ssr: false,
});

function ThreeSceneComponent({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const sceneRef = useRef<any>();
  const rendererRef = useRef<any>();
  const cameraRef = useRef<any>();
  const animationRef = useRef<number>();
  const textMeshesRef = useRef<any[]>([]);
  const particlesRef = useRef<any>();

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    import('three').then((THREE) => {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current!.clientWidth / containerRef.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.z = 8;
      cameraRef.current = camera;

      const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      renderer.setSize(
        containerRef.current!.clientWidth,
        containerRef.current!.clientHeight
      );
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      containerRef.current!.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      const meshColors = [0x6F32BB, 0x8043CC, 0x5F2BA0];
      const letters = ['B', 'I', 'C'];
      const meshPositions = [-2, 0, 2];
      
      letters.forEach((letter, index) => {
        const geometry = new THREE.BoxGeometry(1, 1.5, 0.2);
        const material = new THREE.MeshPhongMaterial({ 
          color: meshColors[index],
          shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = meshPositions[index];
        mesh.userData = { 
          originalY: 0,
          originalX: meshPositions[index],
          index: index
        };
        
        scene.add(mesh);
        textMeshesRef.current.push(mesh);
      });

      const particleCount = 200;
      const particlePositions = new Float32Array(particleCount * 3);
      const particleColors = new Float32Array(particleCount * 3);
      
      const purpleColors = [
        new THREE.Color(0x6F32BB),
        new THREE.Color(0x5F2BA0),
        new THREE.Color(0xB3B9DA),
        new THREE.Color(0x8043CC),
        new THREE.Color(0xDAC9F0)
      ];

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 20;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        
        const color = purpleColors[Math.floor(Math.random() * purpleColors.length)];
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

      const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);
      particlesRef.current = particles;

      const animate = (time: number) => {
        animationRef.current = requestAnimationFrame(animate);
        
        const t = time * 0.001;

        textMeshesRef.current.forEach((mesh, index) => {
          if (mesh) {
            mesh.rotation.y = Math.sin(t * 0.5 + index) * 0.3;
            mesh.position.y = mesh.userData.originalY + Math.sin(t + index * 1.2) * 0.3;
            mesh.position.z = Math.sin(t * 0.3 + index * 0.8) * 0.5;
          }
        });

        if (particlesRef.current) {
          particlesRef.current.rotation.x = t * 0.05;
          particlesRef.current.rotation.y = t * 0.1;
          
          const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(t + i) * 0.01;
          }
          particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        const radius = 8;
        camera.position.x = Math.cos(t * 0.1) * radius;
        camera.position.z = Math.sin(t * 0.1) * radius;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      animate(0);

      const handleResize = () => {
        if (!containerRef.current || !camera || !renderer) return;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        if (containerRef.current && rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
      };
    }).catch((error) => {
      console.error('Failed to load Three.js:', error);
    });
  }, []);

  return null;
}

export function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at center, 
          #8043CC 0%, 
          #6F32BB 30%, 
          #5F2BA0 60%, 
          #4A1A85 100%
        )`
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10 border border-white"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              left: `${20 + (i * 10)}%`,
              top: `${10 + (i * 8)}%`,
              background: `linear-gradient(45deg, transparent, ${['#6F32BB', '#5F2BA0', '#B3B9DA', '#8043CC', '#DAC9F0'][i % 5]}40)`
            }}
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3
            }}
          />
        ))}
      </div>

      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${10 + Math.random() * 20}px`,
            height: `${10 + Math.random() * 20}px`,
            background: ['#6F32BB', '#5F2BA0', '#B3B9DA', '#8043CC', '#DAC9F0'][i % 5],
            borderRadius: i % 2 === 0 ? '50%' : '0%',
            opacity: 0.6
          }}
          animate={{
            y: [0, -50 - Math.random() * 100, 0],
            x: [0, Math.random() * 60 - 30, 0],
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <motion.h1
          className="text-8xl font-bold text-white relative"
          style={{
            textShadow: `
              0 0 10px #8043CC,
              0 0 20px #8043CC,
              0 0 40px #6F32BB,
              0 0 80px #6F32BB
            `,
            letterSpacing: '0.3em'
          }}
          animate={{
            opacity: [0.7, 1, 0.7],
            scale: [0.98, 1.02, 0.98]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          BIC
        </motion.h1>
      </motion.div>

      {/* Three.js 3D scene container - only render on client */}
      {typeof window !== 'undefined' && (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none opacity-30" />
      )}

      <motion.div
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="w-64 h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          />
        </div>

        <motion.p
          className="text-white/80 text-lg font-medium tracking-wider"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading Experience...
        </motion.p>

        {/* Dots animation */}
        <div className="flex justify-center mt-2 space-x-1">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>

      <div className="absolute top-4 left-4">
        <motion.div
          className="w-16 h-16 border-2 border-white/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="absolute bottom-4 right-4">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Only render ThreeScene on client side */}
      {typeof window !== 'undefined' && <ThreeScene containerRef={containerRef} />}
    </motion.div>
  );
}