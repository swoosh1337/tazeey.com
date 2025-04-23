import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface MouseFollowerProps {
  children: React.ReactNode;
  // Optional offset if needed
  offset?: { x: number; y: number };
}

const MouseFollower: React.FC<MouseFollowerProps> = ({ children, offset = { x: 0, y: 0 } }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (elementRef.current) {
        const x = e.clientX + offset.x;
        const y = e.clientY + offset.y;
        elementRef.current.style.transform = `translate(${x}px, ${y}px)`;
        // Make visible on first move if it was hidden initially
        if (elementRef.current.style.visibility === 'hidden') {
          elementRef.current.style.visibility = 'visible';
        }
      }
    };

    document.addEventListener('mousemove', handler);

    // Cleanup listener on component unmount
    return () => {
      document.removeEventListener('mousemove', handler);
    };
  }, [offset.x, offset.y]); // Rerun effect if offset changes

  // Render into the body using a portal
  // Use fixed positioning, pointer-events none so it doesn't block interactions,
  // and initially hidden until the first mouse move.
  return createPortal(
    <div
      ref={elementRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        visibility: 'hidden', // Start hidden
        zIndex: 9999, // Ensure it's on top
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default MouseFollower; 