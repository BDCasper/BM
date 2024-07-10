import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const TARGET_POSITION = new THREE.Vector3(15, 10, 0);

const ICONS = [
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
    '/assets/images/asyk-win.svg?', 
];

interface ThreeSceneProps {
    startAnimation: boolean;
    handleAnimation: (check: boolean) => any;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ startAnimation, handleAnimation }) => {
    const [isVisible, setIsVisible] = useState(true);
    const mountRef = useRef<HTMLDivElement | null>(null);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        const mount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount?.appendChild(renderer.domElement);

        camera.position.z = 10;

        const textureLoader = new THREE.TextureLoader();
        const icons: THREE.Sprite[] = [];

        ICONS.forEach((iconPath) => {
            const texture = textureLoader.load(iconPath);
            const material = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(material);
            sprite.position.set(0, 0, 0); // Start at the center
            scene.add(sprite);
            icons.push(sprite);
        });

        const duration = 800; // Duration for each icon's animation
        const delay = 200; // Delay between each icon's animation

        const getCurvedPath = (start: THREE.Vector3, end: THREE.Vector3, progress: number) => {
            const curve = new THREE.CubicBezierCurve3(
                start,
                new THREE.Vector3((start.x + end.x) / 4, (start.y + end.y) / 2 + 1, 0), // First control point for the curve
                new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2 + 1, 0), // Second control point for the curve
                end
            );
            return curve.getPoint(progress);
        };

        const animate = () => {
            requestAnimationFrame(animate);

            if (startAnimation) {
                const currentTime = Date.now();
                icons.forEach((icon, index) => {
                    const elapsedTime = currentTime - startTimeRef.current - (index * delay);
                    if (elapsedTime >= 0) {
                        const progress = Math.min(elapsedTime / duration, 1);
                        icon.position.copy(getCurvedPath(new THREE.Vector3(0, 0, 0), TARGET_POSITION, progress));
                        icon.material.opacity = progress < 1 ? 1 : 0;
                    }
                });

                if (icons.every(icon => icon.material.opacity === 0)) {
                    startTimeRef.current = 0; // Reset start time after all animations are complete
                }
            }

            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mount?.removeChild(renderer.domElement);
        };
    }, [startAnimation]);

    useEffect(() => {
        if (startAnimation) {
            startTimeRef.current = Date.now();

            const timer = setTimeout(() => {
                setIsVisible(false);
                handleAnimation(false);
            }, 4500); // Hide animation after 5 seconds

            return () => clearTimeout(timer);
        }
    }, [startAnimation]);

    if (!isVisible) {
        return null;
    }

    return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
};

export default ThreeScene;
