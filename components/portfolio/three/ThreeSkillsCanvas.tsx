"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeSkillsCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 300;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x087f9e, 2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xef5572, 2);
    dirLight2.position.set(-5, -10, -7);
    scene.add(dirLight2);

    const nodesGroup = new THREE.Group();

    const geometries = [
      new THREE.IcosahedronGeometry(1.1, 0),
      new THREE.OctahedronGeometry(1.2, 0),
      new THREE.DodecahedronGeometry(1.0, 0),
      new THREE.TorusGeometry(0.9, 0.3, 16, 32),
      new THREE.TetrahedronGeometry(1.3, 0),
    ];

    const colors = [0x087f9e, 0x4d9cff, 0x9d74e8, 0xf5bc3e, 0xef5572];

    const nodes: { mesh: THREE.Mesh; rotSpeed: THREE.Vector3; initialPos: THREE.Vector3; phase: number }[] = [];

    const spacing = 4.2;
    const startX = -((geometries.length - 1) * spacing) / 2;

    geometries.forEach((geo, idx) => {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[idx % colors.length],
        roughness: 0.2,
        metalness: 0.8,
        wireframe: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      const posX = startX + idx * spacing;
      const posY = Math.sin(idx * 1.2) * 0.8;
      const posZ = (Math.random() - 0.5) * 1.5;

      mesh.position.set(posX, posY, posZ);
      nodesGroup.add(mesh);

      nodes.push({
        mesh,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        initialPos: new THREE.Vector3(posX, posY, posZ),
        phase: Math.random() * Math.PI * 2,
      });
    });

    scene.add(nodesGroup);

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

    // IntersectionObserver visibility check
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause render when off screen

      const elapsedTime = clock.getElapsedTime();

      nodesGroup.rotation.y += (mouseX * 0.3 - nodesGroup.rotation.y) * 0.05;
      nodesGroup.rotation.x += (-mouseY * 0.2 - nodesGroup.rotation.x) * 0.05;

      nodes.forEach(({ mesh, rotSpeed, initialPos, phase }) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.rotation.z += rotSpeed.z;

        mesh.position.y = initialPos.y + Math.sin(elapsedTime * 1.8 + phase) * 0.4;
      });

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

      geometries.forEach((g) => g.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-skills-canvas"
      style={{
        width: "100%",
        height: "220px",
        position: "relative",
        margin: "0 auto 24px",
      }}
      aria-hidden="true"
    />
  );
}
