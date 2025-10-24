import React, { useRef, useEffect } from 'react';
import { createNoise3D } from 'https://cdn.skypack.dev/simplex-noise';

interface LoginBackgroundProps {
    theme: string;
}

const TAU = 2 * Math.PI;
const THIRD = 1 / 3;
const TWO_THIRDS = 2 / 3;

const hsl = (h: number, s: number, l: number, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`;
const map = (value: number, start1: number, stop1: number, start2: number, stop2: number): number => {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
};

const LoginBackground: React.FC<LoginBackgroundProps> = ({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // FIX: The type for the ref should allow for `undefined` when no initial value is provided.
    // FIX: When a generic type argument is provided to `useRef`, an initial value is expected.
    // Providing `undefined` as the initial value resolves the "Expected 1 arguments, but got 0" error.
    const animationFrameId = useRef<number | undefined>(undefined);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number, height: number, width_half: number, height_half: number;
        
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            width = canvas.width = window.innerWidth * dpr;
            height = canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            width_half = width / 2;
            height_half = height / 2;
            ctx.scale(dpr, dpr);
        };

        window.addEventListener('resize', resize, false);
        resize();

        const noise3D = createNoise3D(Math.random);

        const draw = (e: number) => {
            let xCount = 40;
            let yCount = 60;
            let iXCount = 1 / (xCount - 1);
            let iYCount = 1 / (yCount - 1);
            let time = e * 0.0005; // Slow down animation
            let timeStep = 0.01;
            
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            
            const grad = ctx.createLinearGradient(-window.innerWidth, 0, window.innerWidth, window.innerHeight);
            const t = time % 1;
            const tSide = Math.floor(time % 2) === 0;

            let hueA, hueB;
            if (theme === 'dark') {
                hueA = tSide ? 210 : 280; // Blue & Purple
                hueB = !tSide ? 210 : 280;
            } else {
                hueA = tSide ? 340 : 210; // Pink & Blue
                hueB = !tSide ? 340 : 210;
            }
            
            const colorA = hsl(hueA, 100, 50);
            const colorB = hsl(hueB, 100, 50);
            grad.addColorStop(map(t, 0, 1, THIRD, 0), colorA);
            grad.addColorStop(map(t, 0, 1, TWO_THIRDS, THIRD), colorB);
            grad.addColorStop(map(t, 0, 1, 1, TWO_THIRDS), colorA);
            
            ctx.save();
            ctx.globalAlpha = map(Math.cos(time), -1, 1, 0.15, 0.3);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.restore();
            
            ctx.beginPath();
            for (let j = 0; j < yCount; j++) {
                const tj = j * iYCount;
                const c = Math.cos(tj * TAU + time) * 0.1;
                for (let i = 0; i < xCount; i++) {
                    const ti = i * iXCount;
                    const n = noise3D(ti, time, c);
                    const y = n * (height_half / (window.devicePixelRatio || 1));
                    const x = ti * (window.innerWidth + 20) - (window.innerWidth / 2) - 10;
                    (i === 0 ? ctx.moveTo : ctx.lineTo).call(ctx, x, y);
                }
                time += timeStep;
            }
            
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            ctx.filter = 'blur(10px)';
            ctx.strokeStyle = grad;
            ctx.lineWidth = 5;
            ctx.stroke();
            ctx.restore();
            
            ctx.save();
            ctx.strokeStyle = hsl(0, 0, 100, 0.8);
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        };
        
        const render = (time: number) => {
            draw(time);
            animationFrameId.current = window.requestAnimationFrame(render);
        };
        animationFrameId.current = window.requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resize, false);
            if (animationFrameId.current) {
                window.cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [theme]);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />;
};

export default LoginBackground;