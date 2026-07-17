'use client';

import { useEffect } from 'react';

export function Oinu() {
  useEffect(() => {
    // Check for reduced motion preference
    const isReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
    if (isReducedMotion) return;

    // Create the Oinu (dog) elements
    const dogEl = document.createElement('div');
    dogEl.id = 'oinu';
    dogEl.style.width = '32px';
    dogEl.style.height = '32px';
    dogEl.style.position = 'fixed';
    dogEl.style.pointerEvents = 'none';
    dogEl.style.imageRendering = 'pixelated';
    dogEl.style.backgroundImage = "url('/oinu.gif')";
    dogEl.style.zIndex = '9998'; // Render just behind Oneko
    
    // Initial position
    let dogPosX = 64;
    let dogPosY = 64;
    let mousePosX = 64;
    let mousePosY = 64;

    dogEl.style.left = `${dogPosX - 16}px`;
    dogEl.style.top = `${dogPosY - 16}px`;
    document.body.appendChild(dogEl);

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: 'scratchSelf' | 'sleeping' | null = null;
    let idleAnimationFrame = 0;

    const dogSpeed = 10;

    const spriteSets: Record<string, [number, number][]> = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      scratchWallN: [
        [0, 0],
        [0, -1],
      ],
      scratchWallS: [
        [-7, -1],
        [-6, -2],
      ],
      scratchWallE: [
        [-2, -2],
        [-2, -3],
      ],
      scratchWallW: [
        [-4, 0],
        [-4, -1],
      ],
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    };

    function setSprite(name: string, frame: number) {
      const sprite = spriteSets[name][frame % spriteSets[name].length];
      dogEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    const onMouseMove = (event: MouseEvent) => {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    function frame() {
      frameCount++;
      
      // Target is mouse directly
      const targetX = mousePosX;
      const targetY = mousePosY;

      const diffX = dogPosX - targetX;
      const diffY = dogPosY - targetY;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);

      // Check if dog reached target
      if (distance < dogSpeed || distance < 48) {
        idleTime++;

        // Check if dog is at screen edges
        const minX = 32;
        const minY = 32;
        const maxX = window.innerWidth - 32;
        const maxY = window.innerHeight - 32;

        let hitWall: 'N' | 'S' | 'E' | 'W' | null = null;
        if (dogPosX <= minX) hitWall = 'W';
        if (dogPosX >= maxX) hitWall = 'E';
        if (dogPosY <= minY) hitWall = 'N';
        if (dogPosY >= maxY) hitWall = 'S';

        if (idleTime > 10) {
          if (hitWall) {
            setSprite(`scratchWall${hitWall}`, Math.floor(frameCount / 4));
          } else {
            setSprite('alert', 0);
          }
        }
        
        if (idleTime > 30 && idleAnimation === null) {
          idleAnimation = Math.random() < 0.3 ? 'scratchSelf' : 'sleeping';
        }

        if (idleAnimation) {
          if (idleAnimation === 'sleeping') {
            if (idleAnimationFrame < 10) {
              setSprite('tired', 0);
            } else {
              setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
            }
          } else {
            setSprite(idleAnimation, Math.floor(idleAnimationFrame / 4));
          }
          idleAnimationFrame++;
        } else if (idleTime <= 10) {
          setSprite('idle', 0);
        }
      } else {
        // Run towards target
        idleTime = 0;
        resetIdleAnimation();

        let direction = '';
        if (diffY > 12) direction += 'N';
        else if (diffY < -12) direction += 'S';

        if (diffX > 12) direction += 'W';
        else if (diffX < -12) direction += 'E';

        // Update positions
        const angle = Math.atan2(targetY - dogPosY, targetX - dogPosX);
        dogPosX += Math.cos(angle) * dogSpeed;
        dogPosY += Math.sin(angle) * dogSpeed;

        // Keep dog in viewport boundaries
        const minX = 16;
        const minY = 16;
        const maxX = window.innerWidth - 16;
        const maxY = window.innerHeight - 16;

        dogPosX = Math.max(minX, Math.min(maxX, dogPosX));
        dogPosY = Math.max(minY, Math.min(maxY, dogPosY));

        if (direction !== '') {
          setSprite(direction, Math.floor(frameCount / 4));
        } else {
          setSprite('idle', 0);
        }
      }

      dogEl.style.left = `${dogPosX - 16}px`;
      dogEl.style.top = `${dogPosY - 16}px`;
    }

    // Run interval at 150ms for retro jerky look
    const intervalId = setInterval(frame, 150);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', onMouseMove);
      if (dogEl.parentNode) {
        dogEl.parentNode.removeChild(dogEl);
      }
    };
  }, []);

  return null;
}
