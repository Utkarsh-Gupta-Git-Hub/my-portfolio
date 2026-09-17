"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeHeroOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 360;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 7;

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

    const mainLight = new THREE.DirectionalLight(0xd5ffff, 2.5);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const pointLight = new THREE.PointLight(0xffe66d, 3, 20);
    pointLight.position.set(-4, -4, 4);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xef5572, 3, 20);
    rimLight.position.set(0, 5, -5);
    scene.add(rimLight);

    const mainGroup = new THREE.Group();

    const innerGeo = new THREE.TorusKnotGeometry(1.25, 0.38, 128, 32, 2, 3);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x087f9e,
      emissive: 0x044658,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    const outerGeo = new THREE.TorusKnotGeometry(1.29, 0.39, 64, 16, 2, 3);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0xffe66d,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    const ringParticleCount = 140;
    const ringPositions = new Float32Array(ringParticleCount * 3);
    const ringRadius = 2.4;

    for (let i = 0; i < ringParticleCount; i++) {
      const angle = (i / ringParticleCount) * Math.PI * 2;
      const radiusOffset = (Math.random() - 0.5) * 0.3;
      ringPositions[i * 3] = Math.cos(angle) * (ringRadius + radiusOffset);
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
      ringPositions[i * 3 + 2] = Math.sin(angle) * (ringRadius + radiusOffset);
    }

    const ringGeometry = new THREE.BufferGeometry();
    ringGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(ringPositions, 3)
    );

    const ringMaterial = new THREE.PointsMaterial({
      color: 0x8ef3a7,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const ringParticles = new THREE.Points(ringGeometry, ringMaterial);
    ringParticles.rotation.x = Math.PI / 4;
    mainGroup.add(ringParticles);

    const satGroup = new THREE.Group();
    const satGeo = new THREE.SphereGeometry(0.16, 16, 16);
    const satMat1 = new THREE.MeshStandardMaterial({
      color: 0xef5572,
      emissive: 0xef5572,
      emissiveIntensity: 0.5,
    });
    const satMat2 = new THREE.MeshStandardMaterial({
      color: 0xffe66d,
      emissive: 0xffe66d,
      emissiveIntensity: 0.5,
    });

    const sat1 = new THREE.Mesh(satGeo, satMat1);
    sat1.position.set(2.5, 0, 0);
    satGroup.add(sat1);

    const sat2 = new THREE.Mesh(satGeo, satMat2);
    sat2.position.set(-2.5, 0, 0);
    satGroup.add(sat2);

    mainGroup.add(satGroup);
    scene.add(mainGroup);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

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
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Pause render when scrolled off screen

      const elapsedTime = clock.getElapsedTime();

      targetRotationY = mouseX * 0.8;
      targetRotationX = mouseY * 0.8;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.08;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.08;

      innerMesh.rotation.y = elapsedTime * 0.4;
      outerMesh.rotation.y = elapsedTime * 0.4;
      outerMesh.rotation.z = elapsedTime * 0.2;

      ringParticles.rotation.z = elapsedTime * 0.25;
      satGroup.rotation.y = elapsedTime * 0.8;
      satGroup.rotation.z = Math.sin(elapsedTime) * 0.3;

      mainGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.15;

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

      innerGeo.dispose();
      innerMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      satGeo.dispose();
      satMat1.dispose();
      satMat2.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-hero-orb-canvas"
      style={{
        width: "100%",
        height: "360px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "grab",
      }}
      aria-label="Interactive 3D Core"
    />
  );
}
