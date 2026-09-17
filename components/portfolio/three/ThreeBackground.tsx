"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xeffcff, 0.015);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x087f9e, 3, 50);
    pointLight1.position.set(10, 15, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xef5572, 3, 50);
    pointLight2.position.set(-15, -10, -5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x7d69d8, 2.5, 50);
    pointLight3.position.set(0, -20, 10);
    scene.add(pointLight3);

    const particleCount = 220;
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    const fieldSize = 40;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * fieldSize;
      positions[i * 3 + 1] = (Math.random() - 0.5) * fieldSize;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.008
        )
      );
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x087f9e,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    linesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3)
    );

    const linesMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });

    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    const shapesGroup = new THREE.Group();

    const icoGeo = new THREE.IcosahedronGeometry(1.6, 0);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x087f9e,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.45,
    });
    const icoMesh1 = new THREE.Mesh(icoGeo, icoMat);
    icoMesh1.position.set(-14, 8, -6);
    shapesGroup.add(icoMesh1);

    const icoMesh2 = new THREE.Mesh(
      icoGeo,
      new THREE.MeshStandardMaterial({
        color: 0xef5572,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      })
    );
    icoMesh2.position.set(15, -10, -8);
    shapesGroup.add(icoMesh2);

    const octGeo = new THREE.OctahedronGeometry(1.2, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x7d69d8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.position.set(12, 10, -4);
    shapesGroup.add(octMesh);

    const torusKnotGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 64, 16);
    const torusKnotMat = new THREE.MeshStandardMaterial({
      color: 0xffd166,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const torusKnotMesh = new THREE.Mesh(torusKnotGeo, torusKnotMat);
    torusKnotMesh.position.set(-12, -12, -7);
    shapesGroup.add(torusKnotMesh);

    const cubesCount = 8;
    const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const cubes: { mesh: THREE.Mesh; rotSpeed: THREE.Vector3; initialY: number }[] = [];

    for (let i = 0; i < cubesCount; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x087f9e : 0xef5572,
        roughness: 0.3,
        metalness: 0.7,
        transparent: true,
        opacity: 0.35,
      });
      const mesh = new THREE.Mesh(cubeGeo, mat);
      const posX = (Math.random() - 0.5) * 36;
      const posY = (Math.random() - 0.5) * 30;
      const posZ = (Math.random() - 0.5) * 15 - 5;
      mesh.position.set(posX, posY, posZ);

      shapesGroup.add(mesh);
      cubes.push({
        mesh,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        initialY: posY,
      });
    }

    scene.add(shapesGroup);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // IntersectionObserver for canvas visibility optimization
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Skip WebGL render loop if canvas is hidden

      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX * 2.5 - targetX) * 0.05;
      targetY += (-mouseY * 2.5 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        let px = posArray[i * 3];
        let py = posArray[i * 3 + 1];
        let pz = posArray[i * 3 + 2];

        px += velocities[i].x;
        py += velocities[i].y;
        pz += velocities[i].z;

        if (Math.abs(px) > fieldSize / 2) velocities[i].x *= -1;
        if (Math.abs(py) > fieldSize / 2) velocities[i].y *= -1;
        if (Math.abs(pz) > 15) velocities[i].z *= -1;

        posArray[i * 3] = px;
        posArray[i * 3 + 1] = py;
        posArray[i * 3 + 2] = pz;
      }
      posAttr.needsUpdate = true;

      let lineVertexIdx = 0;
      let lineColorIdx = 0;
      const connectDist = 4.8;
      const connectDistSq = connectDist * connectDist;

      for (let i = 0; i < particleCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < connectDistSq) {
            const alpha = 1.0 - Math.sqrt(distSq) / connectDist;

            linePositions[lineVertexIdx++] = x1;
            linePositions[lineVertexIdx++] = y1;
            linePositions[lineVertexIdx++] = z1;
            linePositions[lineVertexIdx++] = x2;
            linePositions[lineVertexIdx++] = y2;
            linePositions[lineVertexIdx++] = z2;

            lineColors[lineColorIdx++] = 0.03 * alpha;
            lineColors[lineColorIdx++] = 0.5 * alpha;
            lineColors[lineColorIdx++] = 0.62 * alpha;

            lineColors[lineColorIdx++] = 0.93 * alpha;
            lineColors[lineColorIdx++] = 0.33 * alpha;
            lineColors[lineColorIdx++] = 0.45 * alpha;
          }
        }
      }

      linesGeometry.setDrawRange(0, lineVertexIdx / 3);
      (linesGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (linesGeometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      icoMesh1.rotation.x = elapsedTime * 0.12;
      icoMesh1.rotation.y = elapsedTime * 0.18;

      icoMesh2.rotation.x = elapsedTime * -0.15;
      icoMesh2.rotation.z = elapsedTime * 0.1;

      octMesh.rotation.y = elapsedTime * 0.2;
      octMesh.rotation.z = elapsedTime * 0.15;

      torusKnotMesh.rotation.x = elapsedTime * 0.25;
      torusKnotMesh.rotation.y = elapsedTime * 0.3;

      cubes.forEach(({ mesh, rotSpeed, initialY }, idx) => {
        mesh.rotation.x += rotSpeed.x;
        mesh.rotation.y += rotSpeed.y;
        mesh.rotation.z += rotSpeed.z;
        mesh.position.y = initialY + Math.sin(elapsedTime * 1.5 + idx) * 0.6;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      octGeo.dispose();
      octMat.dispose();
      torusKnotGeo.dispose();
      torusKnotMat.dispose();
      cubeGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-bg-canvas"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    />
  );
}
