"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeDeepDiveCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 240;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffe66d, 2.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const mainGroup = new THREE.Group();

    // 1. Central Holographic Algorithm Matrix Cube Assembly (3x3 grid of glowing mini-cubes)
    const matrixGroup = new THREE.Group();
    const cubeGeo = new THREE.BoxGeometry(0.55, 0.55, 0.55);

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isCore = x === 0 && y === 0 && z === 0;
          const mat = new THREE.MeshStandardMaterial({
            color: isCore ? 0xef5572 : (x + y + z) % 2 === 0 ? 0x087f9e : 0x8ef3a7,
            wireframe: true,
            roughness: 0.2,
            metalness: 0.8,
            transparent: true,
            opacity: 0.75,
          });
          const mesh = new THREE.Mesh(cubeGeo, mat);
          mesh.position.set(x * 0.65, y * 0.65, z * 0.65);
          matrixGroup.add(mesh);
        }
      }
    }

    mainGroup.add(matrixGroup);

    // 2. Revolving Data Ring Particles (Binary Streams)
    const ringCount = 120;
    const ringGeo = new THREE.BufferGeometry();
    const ringPos = new Float32Array(ringCount * 3);

    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 2.6 + (Math.random() - 0.5) * 0.4;
      ringPos[i * 3] = Math.cos(angle) * radius;
      ringPos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      ringPos[i * 3 + 2] = Math.sin(angle) * radius;
    }

    ringGeo.setAttribute("position", new THREE.BufferAttribute(ringPos, 3));
    const ringMat = new THREE.PointsMaterial({
      color: 0xffe66d,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const ringParticles = new THREE.Points(ringGeo, ringMat);
    ringParticles.rotation.x = Math.PI / 6;
    mainGroup.add(ringParticles);

    // 3. Orbiting Problem Solver Badges
    const satGroup = new THREE.Group();
    const satGeo = new THREE.OctahedronGeometry(0.26, 0);

    const sat1 = new THREE.Mesh(satGeo, new THREE.MeshStandardMaterial({ color: 0x8ef3a7, wireframe: true }));
    sat1.position.set(2.4, 0, 0);
    satGroup.add(sat1);

    const sat2 = new THREE.Mesh(satGeo, new THREE.MeshStandardMaterial({ color: 0xef5572, wireframe: true }));
    sat2.position.set(-2.4, 0, 0);
    satGroup.add(sat2);

    mainGroup.add(satGroup);
    scene.add(mainGroup);

    // Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      mainGroup.rotation.y += (mouseX * 0.35 - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (-mouseY * 0.2 - mainGroup.rotation.x) * 0.05;

      // Rotate matrix cube
      matrixGroup.rotation.x = elapsedTime * 0.3;
      matrixGroup.rotation.y = elapsedTime * 0.4;

      ringParticles.rotation.z = elapsedTime * 0.25;
      satGroup.rotation.y = elapsedTime * 0.7;

      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      cubeGeo.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      satGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-section-canvas"
      style={{
        width: "100%",
        height: "200px",
        position: "relative",
        margin: "0 auto 16px",
      }}
      aria-label="3D Holographic Code Cube & Data Matrix Scene"
    />
  );
}
