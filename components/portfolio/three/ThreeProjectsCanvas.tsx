"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeProjectsCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 260;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

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

    const pointLight = new THREE.PointLight(0x087f9e, 3, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const mainGroup = new THREE.Group();

    // 1. Central Event Bus Node (Kafka / Message Broker)
    const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xef5572,
      emissive: 0xef5572,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 2. Microservice Satellite Nodes (API Gateway, Redis, DB, Ollama AI)
    const serviceConfigs = [
      { name: "API Gateway", color: 0x087f9e, pos: new THREE.Vector3(-3.4, 1.2, 0) },
      { name: "Redis Cache", color: 0xffe66d, pos: new THREE.Vector3(3.4, 1.2, 0) },
      { name: "Postgres DB", color: 0x7d69d8, pos: new THREE.Vector3(-2.8, -1.4, 0) },
      { name: "Spring AI / Ollama", color: 0x8ef3a7, pos: new THREE.Vector3(2.8, -1.4, 0) },
    ];

    const serviceNodes: THREE.Mesh[] = [];
    const pipelineLines: THREE.Line[] = [];
    const packetSystems: { points: THREE.Points; curve: THREE.CatmullRomCurve3 }[] = [];

    serviceConfigs.forEach((cfg) => {
      const nodeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: true,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(cfg.pos);
      mainGroup.add(nodeMesh);
      serviceNodes.push(nodeMesh);

      // Connecting Pipeline Line
      const curve = new THREE.CatmullRomCurve3([
        cfg.pos,
        new THREE.Vector3(cfg.pos.x * 0.5, cfg.pos.y * 0.5, 0.5),
        new THREE.Vector3(0, 0, 0),
      ]);

      const points = curve.getPoints(30);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      mainGroup.add(line);
      pipelineLines.push(line);

      // Packet Stream along Pipeline
      const pktGeo = new THREE.BufferGeometry();
      const pktPos = new Float32Array(6 * 3);
      pktGeo.setAttribute("position", new THREE.BufferAttribute(pktPos, 3));
      const pktMat = new THREE.PointsMaterial({
        color: cfg.color,
        size: 0.16,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
      });
      const pktSystem = new THREE.Points(pktGeo, pktMat);
      mainGroup.add(pktSystem);

      packetSystems.push({ points: pktSystem, curve });
    });

    scene.add(mainGroup);

    // Mouse Parallax Interaction
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

      mainGroup.rotation.y += (mouseX * 0.3 - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (-mouseY * 0.2 - mainGroup.rotation.x) * 0.05;

      // Rotate core event bus
      coreMesh.rotation.y = elapsedTime * 0.5;
      coreMesh.rotation.z = elapsedTime * 0.3;

      // Rotate service nodes
      serviceNodes.forEach((node, idx) => {
        node.rotation.x = elapsedTime * 0.4;
        node.rotation.y = elapsedTime * 0.5;
        node.position.y = serviceConfigs[idx].pos.y + Math.sin(elapsedTime * 2 + idx) * 0.15;
      });

      // Animate request packets flowing along pipelines
      packetSystems.forEach(({ points, curve }, sysIdx) => {
        const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
        const arr = posAttr.array as Float32Array;

        for (let i = 0; i < 6; i++) {
          const t = (elapsedTime * 0.4 + i * 0.15 + sysIdx * 0.2) % 1;
          const pt = curve.getPoint(t);
          arr[i * 3] = pt.x;
          arr[i * 3 + 1] = pt.y;
          arr[i * 3 + 2] = pt.z;
        }
        posAttr.needsUpdate = true;
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

      coreGeo.dispose();
      coreMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-section-canvas"
      style={{
        width: "100%",
        height: "220px",
        position: "relative",
        margin: "0 auto 16px",
      }}
      aria-label="3D Microservice Architecture & Event Bus Scene"
    />
  );
}
