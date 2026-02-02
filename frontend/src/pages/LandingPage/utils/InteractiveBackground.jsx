import React, { useEffect, useRef } from "react";
import Sketch from "react-p5";
import { Box } from "@mui/material";

// --- CONFIGURATION ---
const PALETTE = {
  bg: [247, 242, 237], // Bone
  orb1: [232, 180, 162], // Warm Clay
  orb2: [220, 197, 186], // Muted Beige
  orb3: [236, 242, 214], // Soft Sage (The "Touch of Green")
};

export default function InteractiveBackground() {
  // Store position AND speed
  const mouseRef = useRef({ x: -1000, y: -1000, speed: 0 });
  const prevMouseRef = useRef({ x: -1000, y: -1000 });
  let blobs = [];

  // GLOBAL MOUSE TRACKING WITH SPEED CALCULATION
  useEffect(() => {
    const handleMove = (e) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      // Calculate speed (distance from last frame)
      const dx = currentX - prevMouseRef.current.x;
      const dy = currentY - prevMouseRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);

      mouseRef.current = { x: currentX, y: currentY, speed: speed };
      prevMouseRef.current = { x: currentX, y: currentY };
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const setup = (p5, canvasParentRef) => {
    const w = window.innerWidth || 1000;
    const h = window.innerHeight || 800;

    p5.createCanvas(w, h).parent(canvasParentRef);
    p5.noStroke();

    blobs = [
      // Blob 1: Warm Clay (Top Left-ish)
      new OrganicBlob(p5, w * 0.3, h * 0.4, PALETTE.orb1, 350, {
        repel: 15.0,
        fric: 0.94,
      }),
      // Blob 2: Muted Beige (Bottom Right-ish)
      new OrganicBlob(p5, w * 0.7, h * 0.6, PALETTE.orb2, 450, {
        repel: 12.0,
        fric: 0.94,
      }),
      // Blob 3: Soft Green (Center/accent)
      // new OrganicBlob(p5, w * 0.5, h * 0.5, PALETTE.orb3, 300, {
      //   repel: 14.0, // Responsive
      //   fric: 0.95, // Slightly lighter/floatier
      // }),
    ];
  };

  const draw = (p5) => {
    p5.background(...PALETTE.bg);

    // Decay mouse speed manually
    mouseRef.current.speed *= 0.8;

    blobs.forEach((blob) => {
      blob.update(
        p5,
        mouseRef.current.x,
        mouseRef.current.y,
        mouseRef.current.speed,
      );
      blob.display(p5);
    });
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          filter: "blur(70px)",
          transform: "scale(1.1)",
          width: "100%",
          height: "100%",
        }}
      >
        <Sketch setup={setup} draw={draw} windowResized={windowResized} />
      </Box>

      {/* Grain Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.08,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </Box>
  );
}

// --- PHYSICS & NOISE LOGIC ---
class OrganicBlob {
  constructor(p5, x, y, color, size, config) {
    this.pos = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0); // Start stationary
    this.acc = p5.createVector(0, 0);

    this.baseSize = size;
    this.color = color;
    this.config = config;

    this.xOff = p5.random(1000);
    this.yOff = p5.random(1000);
    this.rOff = p5.random(1000);
  }

  update(p5, mouseX, mouseY, mouseSpeed) {
    // 1. MOUSE IMPACT (Repulsion based on Speed)
    let mouse = p5.createVector(mouseX, mouseY);
    let dir = this.pos.copy().sub(mouse);
    let dist = dir.mag();

    // Interaction Radius: 450px
    if (dist < 450) {
      dir.normalize();

      let distFactor = p5.map(dist, 0, 450, 1, 0); // 1 at center, 0 at edge
      let pushForce = distFactor * mouseSpeed * 0.15; // Scale down slightly

      // Cap the maximum force so it doesn't teleport
      pushForce = p5.min(pushForce, 5.0);

      dir.mult(pushForce * this.config.repel);
      this.acc.add(dir);
    }

    // 2. SCREEN BOUNDARIES (Rubber Band)
    let margin = 100;
    let returnStrength = 0.8;

    if (this.pos.x < margin) this.acc.add(p5.createVector(returnStrength, 0));
    if (this.pos.x > p5.width - margin)
      this.acc.add(p5.createVector(-returnStrength, 0));
    if (this.pos.y < margin) this.acc.add(p5.createVector(0, returnStrength));
    if (this.pos.y > p5.height - margin)
      this.acc.add(p5.createVector(0, -returnStrength));

    // 3. PHYSICS ENGINE
    this.vel.add(this.acc);
    this.vel.mult(this.config.fric); // Friction
    this.vel.limit(15);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // 4. BREATHING
    this.xOff += 0.003;
    this.yOff += 0.003;
    this.rOff += 0.005;
  }

  display(p5) {
    p5.fill(...this.color);
    p5.beginShape();
    let angleStep = 0.1;

    let pulse = this.vel.mag() * 1.5;

    for (let a = 0; a < p5.TWO_PI; a += angleStep) {
      let xoff = p5.map(p5.cos(a), -1, 1, 0, 2);
      let yoff = p5.map(p5.sin(a), -1, 1, 0, 2);

      let rNoise = p5.noise(xoff + this.rOff, yoff + this.rOff);
      let r = this.baseSize + pulse + p5.map(rNoise, 0, 1, -50, 50);

      let x = this.pos.x + r * p5.cos(a);
      let y = this.pos.y + r * p5.sin(a);
      p5.vertex(x, y);
    }
    p5.endShape(p5.CLOSE);
  }
}
