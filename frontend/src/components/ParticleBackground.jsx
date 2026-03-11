import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

const getParticleCount = (width) => {
  if (width < 640) return 3000;
  if (width < 1024) return 3800;
  return 4600;
};

function ParticleBackground() {
  const mountRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const createCamera = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const camera = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        -1000,
        1000
      );
      camera.position.z = 300;
      return camera;
    };
    const camera = createCamera();

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(isDark ? '#020617' : '#f3f4f6', 1);
    mount.appendChild(renderer.domElement);

    const lineCount = getParticleCount(window.innerWidth);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(lineCount * 2 * 3);
    const basePositions = new Float32Array(lineCount * 2 * 3);
    const phases = new Float32Array(lineCount);
    const speeds = new Float32Array(lineCount);

    let p = 0;
    const spreadX = window.innerWidth * 1.6;
    const spreadY = window.innerHeight * 1.6;
    const spreadZ = 900;

    for (let i = 0; i < lineCount; i += 1) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      // Medium-size short line length: 3 to 8.
      const length = 3 + Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;

      positions[p] = x;
      positions[p + 1] = y;
      positions[p + 2] = z;
      basePositions[p] = x;
      basePositions[p + 1] = y;
      basePositions[p + 2] = z;
      p += 3;

      positions[p] = x + dx;
      positions[p + 1] = y + dy;
      positions[p + 2] = z;
      basePositions[p] = x + dx;
      basePositions[p + 1] = y + dy;
      basePositions[p + 2] = z;
      p += 3;

      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.18 + Math.random() * 0.34;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: isDark ? 0x22d3ee : 0x2563eb,
      transparent: true,
      opacity: isDark ? 0.8 : 0.62,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(geometry, material);
    scene.add(lines);

    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.left = -width / 2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setClearColor(isDark ? '#020617' : '#f3f4f6', 1);
    };

    window.addEventListener('resize', onResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      for (let i = 0; i < lineCount; i += 1) {
        const startIdx = i * 6;
        const endIdx = startIdx + 3;
        const wave = Math.sin(t * speeds[i] + phases[i]) * 0.9;
        const drift = Math.cos(t * speeds[i] * 0.8 + phases[i]) * 0.7;

        positions[startIdx] = basePositions[startIdx] + wave;
        positions[startIdx + 1] = basePositions[startIdx + 1] + drift;
        positions[startIdx + 2] = basePositions[startIdx + 2];

        positions[endIdx] = basePositions[endIdx] + wave;
        positions[endIdx + 1] = basePositions[endIdx + 1] + drift;
        positions[endIdx + 2] = basePositions[endIdx + 2];
      }

      geometry.attributes.position.needsUpdate = true;
      lines.rotation.y += 0.0006;
      lines.rotation.x += 0.0002;
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}

export default ParticleBackground;
