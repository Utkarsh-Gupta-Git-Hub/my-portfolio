"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeDeveloper3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    const scene = new THREE.Scene();

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.7, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const monitorGlowLight = new THREE.PointLight(0x087f9e, 4, 15);
    monitorGlowLight.position.set(-0.6, 0.8, 1.5);
    scene.add(monitorGlowLight);

    const pcTowerRgb = new THREE.PointLight(0xef5572, 3.5, 12);
    pcTowerRgb.position.set(2.4, 0.4, 0.5);
    scene.add(pcTowerRgb);

    const mainLight = new THREE.DirectionalLight(0xd5ffff, 2.2);
    mainLight.position.set(5, 7, 6);
    scene.add(mainLight);

    const devGroup = new THREE.Group();

    // 2. Desk Base
    const deskGeo = new THREE.BoxGeometry(6.4, 0.16, 3.0);
    const deskMat = new THREE.MeshStandardMaterial({
      color: 0x0c1e29,
      roughness: 0.3,
      metalness: 0.7,
    });
    const deskMesh = new THREE.Mesh(deskGeo, deskMat);
    deskMesh.position.y = -1.4;
    devGroup.add(deskMesh);

    // Desk Mat / Pad
    const padGeo = new THREE.BoxGeometry(4.8, 0.02, 1.6);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x05131c, roughness: 0.8 });
    const padMesh = new THREE.Mesh(padGeo, padMat);
    padMesh.position.set(-0.2, -1.3, 0.3);
    devGroup.add(padMesh);

    // 3. Ultra-Wide Monitor Workstation Setup (Positioned at x = -0.6)
    const monitorGroup = new THREE.Group();
    monitorGroup.position.set(-0.6, 0, 0);

    // Monitor Stand Base
    const standBaseGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.08, 32);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x182d3b, metalness: 0.85, roughness: 0.2 });
    const standBase = new THREE.Mesh(standBaseGeo, standMat);
    standBase.position.set(0, -1.26, -0.4);
    monitorGroup.add(standBase);

    // Monitor Vertical Arm Stem
    const stemGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16);
    const stemMesh = new THREE.Mesh(stemGeo, standMat);
    stemMesh.position.set(0, -0.5, -0.45);
    monitorGroup.add(stemMesh);

    // Monitor Frame (Width: 3.6 - Extends from x = -1.8 to x = +1.8 relative to monitorGroup)
    const frameGeo = new THREE.BoxGeometry(3.6, 2.2, 0.14);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x091c28, metalness: 0.9, roughness: 0.2 });
    const monitorFrame = new THREE.Mesh(frameGeo, frameMat);
    monitorFrame.position.set(0, 0.5, -0.4);
    monitorGroup.add(monitorFrame);

    // Monitor Screen Display
    const screenGeo = new THREE.PlaneGeometry(3.4, 2.0);

    // Canvas Texture for Real Syntax Highlighted Dummy Code
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // IDE Background
      ctx.fillStyle = "#03141f";
      ctx.fillRect(0, 0, 1024, 600);

      // IDE Header Bar
      ctx.fillStyle = "#071e2c";
      ctx.fillRect(0, 0, 1024, 42);

      // Window Action Buttons
      ctx.fillStyle = "#ef5572";
      ctx.beginPath(); ctx.arc(22, 21, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffe66d";
      ctx.beginPath(); ctx.arc(42, 21, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#8ef3a7";
      ctx.beginPath(); ctx.arc(62, 21, 7, 0, Math.PI * 2); ctx.fill();

      // Tab Title
      ctx.fillStyle = "#8ef3a7";
      ctx.font = "bold 18px 'JetBrains Mono', monospace";
      ctx.fillText("ComplaintController.java - Spring Boot", 90, 27);

      // Sidebar File Explorer
      ctx.fillStyle = "#051824";
      ctx.fillRect(0, 42, 230, 558);

      ctx.fillStyle = "#52788a";
      ctx.font = "15px 'JetBrains Mono', monospace";
      ctx.fillText("PROJECT EXPLORER", 16, 75);
      ctx.fillStyle = "#087f9e";
      ctx.fillText("▸ src/main/java", 16, 110);
      ctx.fillText("  ▾ controller", 16, 140);
      ctx.fillStyle = "#ffe66d";
      ctx.fillText("    ComplaintController.java", 16, 170);
      ctx.fillStyle = "#087f9e";
      ctx.fillText("  ▸ service", 16, 200);
      ctx.fillText("  ▸ repository", 16, 230);
      ctx.fillText("  ▸ config/kafka", 16, 260);

      // Code Line Numbers & Syntax Coded Lines
      const lines = [
        { num: "1", kw: "@RestController", code: " @RequestMapping(\"/api/v1/complaints\")" },
        { num: "2", kw: "public class", code: " ComplaintController {" },
        { num: "3", kw: "  @Autowired", code: " private KafkaTemplate<String, Event> kafka;" },
        { num: "4", kw: "  @Autowired", code: " private RedisRateLimiter rateLimiter;" },
        { num: "5", kw: "", code: "" },
        { num: "6", kw: "  @PostMapping", code: "(\"/file\")" },
        { num: "7", kw: "  public", code: " ResponseEntity<Status> fileComplaint(@Valid Complaint c) {" },
        { num: "8", kw: "    if (!", code: "rateLimiter.allowRequest(c.getUserId())) {" },
        { num: "9", kw: "      return", code: " ResponseEntity.status(429).build();" },
        { num: "10", kw: "    }", code: "" },
        { num: "11", kw: "    kafka.", code: "send(\"civic-events\", c.getId(), c.toEvent());" },
        { num: "12", kw: "    return", code: " ResponseEntity.ok(Status.QUEUED);" },
        { num: "13", kw: "  }", code: "" },
        { num: "14", kw: "}", code: "" },
      ];

      ctx.font = "16px 'JetBrains Mono', monospace";

      lines.forEach((item, idx) => {
        const y = 85 + idx * 34;

        ctx.fillStyle = "#3c5e6e";
        ctx.fillText(item.num.padStart(2, " "), 250, y);

        ctx.fillStyle = "#ef5572";
        ctx.fillText(item.kw, 290, y);

        ctx.fillStyle = "#d5ffff";
        ctx.fillText(item.code, 290 + ctx.measureText(item.kw).width, y);
      });
    }

    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.anisotropy = 8;

    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0.5, -0.32);
    monitorGroup.add(screenMesh);

    devGroup.add(monitorGroup);

    // 4. Desktop Computer PC Tower (Positioned at x = +2.4 - Completely clear of monitor)
    const pcTowerGroup = new THREE.Group();
    pcTowerGroup.position.set(2.4, -0.2, -0.3);

    const pcCaseGeo = new THREE.BoxGeometry(0.85, 2.1, 1.7);
    const pcCaseMat = new THREE.MeshStandardMaterial({ color: 0x0a1c27, metalness: 0.9, roughness: 0.2 });
    const pcCase = new THREE.Mesh(pcCaseGeo, pcCaseMat);
    pcTowerGroup.add(pcCase);

    // Glass Side Panel
    const glassGeo = new THREE.PlaneGeometry(1.5, 1.9);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x087f9e,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      metalness: 0.8,
    });
    const glassPanel = new THREE.Mesh(glassGeo, glassMat);
    glassPanel.rotation.y = -Math.PI / 2;
    glassPanel.position.set(-0.44, 0, 0);
    pcTowerGroup.add(glassPanel);

    // Inner RGB Glowing Fan Rings
    const fanCount = 3;
    for (let i = 0; i < fanCount; i++) {
      const ringGeo = new THREE.TorusGeometry(0.22, 0.04, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x087f9e : 0xef5572,
        emissive: i % 2 === 0 ? 0x087f9e : 0xef5572,
        emissiveIntensity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0.44, 0.55 - i * 0.55, 0);
      ringMesh.rotation.y = Math.PI / 2;
      pcTowerGroup.add(ringMesh);
    }

    devGroup.add(pcTowerGroup);

    // 5. Mechanical Keyboard & Precision Mouse (Aligned under monitor)
    const kbGroup = new THREE.Group();
    kbGroup.position.set(-0.7, -1.24, 0.4);

    const keyboardBoardGeo = new THREE.BoxGeometry(2.1, 0.08, 0.65);
    const keyboardBoardMat = new THREE.MeshStandardMaterial({ color: 0x0b202e, metalness: 0.8, roughness: 0.3 });
    const keyboardBoard = new THREE.Mesh(keyboardBoardGeo, keyboardBoardMat);
    kbGroup.add(keyboardBoard);

    // Keycaps RGB Underglow Accent
    const glowKeyGeo = new THREE.BoxGeometry(2.0, 0.02, 0.58);
    const glowKeyMat = new THREE.MeshBasicMaterial({ color: 0x087f9e, transparent: true, opacity: 0.6 });
    const glowKey = new THREE.Mesh(glowKeyGeo, glowKeyMat);
    glowKey.position.y = 0.04;
    kbGroup.add(glowKey);

    devGroup.add(kbGroup);

    // Mouse (Positioned between keyboard and CPU tower)
    const mouseGeo = new THREE.BoxGeometry(0.3, 0.12, 0.5);
    const mouseMat = new THREE.MeshStandardMaterial({ color: 0x122938, roughness: 0.3, metalness: 0.7 });
    const mouseMesh = new THREE.Mesh(mouseGeo, mouseMat);
    mouseMesh.position.set(0.9, -1.24, 0.4);
    devGroup.add(mouseMesh);

    // 6. Orbiting Backend Tech Nodes (Java, Spring, Kafka, Redis)
    const techGroup = new THREE.Group();
    const nodeCount = 4;
    const nodeColors = [0x087f9e, 0x8ef3a7, 0xef5572, 0xffe66d];
    const techNodes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const nodeGeo = new THREE.IcosahedronGeometry(0.26, 0);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: nodeColors[i],
        wireframe: true,
        emissive: nodeColors[i],
        emissiveIntensity: 0.5,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      techGroup.add(nodeMesh);
      techNodes.push(nodeMesh);
    }

    devGroup.add(techGroup);
    scene.add(devGroup);

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

    // IntersectionObserver Optimization
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

      // Smooth workstation rotation with cursor
      devGroup.rotation.y += (mouseX * 0.35 - devGroup.rotation.y) * 0.05;
      devGroup.rotation.x += (-mouseY * 0.2 - devGroup.rotation.x) * 0.05;

      // Subtle float animation
      devGroup.position.y = Math.sin(elapsedTime * 1.4) * 0.08;

      // Rotate floating tech nodes around desktop setup
      techNodes.forEach((node, idx) => {
        const angle = elapsedTime * 0.6 + (idx / nodeCount) * Math.PI * 2;
        const radius = 2.9;
        node.position.set(
          Math.cos(angle) * radius,
          Math.sin(elapsedTime * 2 + idx) * 0.4 + 0.4,
          Math.sin(angle) * 1.2
        );
        node.rotation.x = elapsedTime * 0.8;
        node.rotation.y = elapsedTime * 0.8;
      });

      // Pulse PC RGB lights
      pcTowerRgb.intensity = 2.5 + Math.sin(elapsedTime * 4) * 1.2;

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

      deskGeo.dispose();
      deskMat.dispose();
      padGeo.dispose();
      padMat.dispose();
      standBaseGeo.dispose();
      standMat.dispose();
      stemGeo.dispose();
      frameGeo.dispose();
      frameMat.dispose();
      screenGeo.dispose();
      screenMat.dispose();
      screenTexture.dispose();
      pcCaseGeo.dispose();
      pcCaseMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      kbGroup.clear();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="three-hero-orb-canvas"
      style={{
        width: "100%",
        height: "400px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-label="3D Developer Computer Setup & IDE Terminal Screen"
    />
  );
}
