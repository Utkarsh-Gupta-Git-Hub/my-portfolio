"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeExperienceCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 240;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x087f9e, 2);
    dirLight.position.set(4, 5, 6);
    scene.add(dirLight);

    const gitTreeGroup = new THREE.Group();

    // 1. Git Branch Lines (Main branch & Feature branch)
    const mainBranchPoints = [
      new THREE.Vector3(-4.5, 0, 0),
      new THREE.Vector3(-2.0, 0, 0),
      new THREE.Vector3(0.5, 0, 0),
      new THREE.Vector3(3.0, 0, 0),
      new THREE.Vector3(4.5, 0, 0),
    ];

    const mainLineGeo = new THREE.BufferGeometry().setFromPoints(mainBranchPoints);
    const mainLineMat = new THREE.LineBasicMaterial({ color: 0x087f9e, linewidth: 3 });
    const mainLine = new THREE.Line(mainLineGeo, mainLineMat);
    gitTreeGroup.add(mainLine);

    // Feature Branch Line (Splits and merges back)
    const featurePoints = [
      new THREE.Vector3(-2.0, 0, 0),
      new THREE.Vector3(-1.0, 1.2, 0),
      new THREE.Vector3(1.2, 1.2, 0),
      new THREE.Vector3(3.0, 0, 0),
    ];

    const featureLineGeo = new THREE.BufferGeometry().setFromPoints(featurePoints);
    const featureLineMat = new THREE.LineBasicMaterial({ color: 0xef5572, linewidth: 2 });
    const featureLine = new THREE.Line(featureLineGeo, featureLineMat);
    gitTreeGroup.add(featureLine);

    // 2. Commit Spheres along branches
    const commitNodes: { mesh: THREE.Mesh; initialY: number }[] = [];
    const commitPositions = [
      { pos: new THREE.Vector3(-4.5, 0, 0), color: 0x087f9e, label: "v1.0" },
      { pos: new THREE.Vector3(-2.0, 0, 0), color: 0x087f9e, label: "branch" },
      { pos: new THREE.Vector3(-1.0, 1.2, 0), color: 0xef5572, label: "feat: kafka" },
      { pos: new THREE.Vector3(1.2, 1.2, 0), color: 0xef5572, label: "feat: redis" },
      { pos: new THREE.Vector3(0.5, 0, 0), color: 0x8ef3a7, label: "fix: api" },
      { pos: new THREE.Vector3(3.0, 0, 0), color: 0xffe66d, label: "merge" },
      { pos: new THREE.Vector3(4.5, 0, 0), color: 0x8ef3a7, label: "deploy" },
    ];

    commitPositions.forEach((cfg) => {
      const commitGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const commitMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8,
      });
      const commitMesh = new THREE.Mesh(commitGeo, commitMat);
      commitMesh.position.copy(cfg.pos);
      gitTreeGroup.add(commitMesh);

      // Outer Pulsing Ring around commit
      const ringGeo = new THREE.RingGeometry(0.42, 0.48, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: cfg.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(cfg.pos);
      gitTreeGroup.add(ringMesh);

      commitNodes.push({ mesh: commitMesh, initialY: cfg.pos.y });
    });

    scene.add(gitTreeGroup);

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

      gitTreeGroup.rotation.y += (mouseX * 0.3 - gitTreeGroup.rotation.y) * 0.05;
      gitTreeGroup.rotation.x += (-mouseY * 0.2 - gitTreeGroup.rotation.x) * 0.05;

      commitNodes.forEach(({ mesh, initialY }, idx) => {
        mesh.rotation.y = elapsedTime * 0.8;
        mesh.position.y = initialY + Math.sin(elapsedTime * 2.5 + idx) * 0.08;
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

      mainLineGeo.dispose();
      mainLineMat.dispose();
      featureLineGeo.dispose();
      featureLineMat.dispose();
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
      aria-label="3D Git Commit Tree & CI/CD Pipeline Model"
    />
  );
}
