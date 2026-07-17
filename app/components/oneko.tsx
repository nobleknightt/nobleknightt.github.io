'use client';

import { useEffect } from 'react';

export function Oneko() {
  useEffect(() => {
    // Check for reduced motion preference
    const isReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
    if (isReducedMotion) return;

    // Create the Neko elements
    const nekoEl = document.createElement('div');
    nekoEl.id = 'oneko';
    nekoEl.style.width = '32px';
    nekoEl.style.height = '32px';
    nekoEl.style.position = 'fixed';
    nekoEl.style.pointerEvents = 'none';
    nekoEl.style.imageRendering = 'pixelated';
    nekoEl.style.backgroundImage = "url('/oneko.gif')";
    nekoEl.style.zIndex = '9999';
    
    // Initial position
    let nekoPosX = 32;
    let nekoPosY = 32;
    let mousePosX = 32;
    let mousePosY = 32;

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    document.body.appendChild(nekoEl);

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: 'scratchSelf' | 'sleeping' | null = null;
    let idleAnimationFrame = 0;

    const nekoSpeed = 10;

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
      nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
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
      const diffX = nekoPosX - mousePosX;
      const diffY = nekoPosY - mousePosY;
      const distance = Math.sqrt(diffX * diffX + diffY * diffY);

      // Check if cat reached mouse or is very close
      if (distance < nekoSpeed || distance < 48) {
        idleTime++;

        // Check if cat is at screen edges
        const minX = 32;
        const minY = 32;
        const maxX = window.innerWidth - 32;
        const maxY = window.innerHeight - 32;

        let hitWall: 'N' | 'S' | 'E' | 'W' | null = null;
        if (nekoPosX <= minX) hitWall = 'W';
        if (nekoPosX >= maxX) hitWall = 'E';
        if (nekoPosY <= minY) hitWall = 'N';
        if (nekoPosY >= maxY) hitWall = 'S';

        if (idleTime > 10) {
          // Play alert or scratching wall if at boundary
          if (hitWall) {
            setSprite(`scratchWall${hitWall}`, Math.floor(frameCount / 4));
          } else {
            setSprite('alert', 0);
          }
        }
        
        if (idleTime > 30 && idleAnimation === null) {
          // Start idle animation
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
        // Run towards mouse
        idleTime = 0;
        resetIdleAnimation();

        let direction = '';
        if (diffY > 12) direction += 'N';
        else if (diffY < -12) direction += 'S';

        if (diffX > 12) direction += 'W';
        else if (diffX < -12) direction += 'E';

        // Update positions
        const angle = Math.atan2(mousePosY - nekoPosY, mousePosX - nekoPosX);
        nekoPosX += Math.cos(angle) * nekoSpeed;
        nekoPosY += Math.sin(angle) * nekoSpeed;

        // Keep cat in viewport boundaries
        const minX = 16;
        const minY = 16;
        const maxX = window.innerWidth - 16;
        const maxY = window.innerHeight - 16;

        nekoPosX = Math.max(minX, Math.min(maxX, nekoPosX));
        nekoPosY = Math.max(minY, Math.min(maxY, nekoPosY));

        if (direction !== '') {
          setSprite(direction, Math.floor(frameCount / 4));
        } else {
          setSprite('idle', 0);
        }
      }

      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;
    }

    // Run interval at 150ms for classic jerky retro look
    const intervalId = setInterval(frame, 150);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('mousemove', onMouseMove);
      if (nekoEl.parentNode) {
        nekoEl.parentNode.removeChild(nekoEl);
      }
    };
  }, []);

  return null;
}
