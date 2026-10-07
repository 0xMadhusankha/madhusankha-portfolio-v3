'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { heroProgress } from '@/lib/hero-progress';

const RADIUS = 1.5;

// The shaders write colours straight to the screen, so theme colours are
// stored as plain sRGB numbers rather than converted to three.js's linear space.
function setFromCss(color: THREE.Color, value: string) {
    const hex = value.trim().match(/^#([0-9a-f]{6})$/i)?.[1];
    if (!hex) return;
    const n = parseInt(hex, 16);
    color.setRGB(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

// Small seeded generator so the globe looks the same on every visit
function seeded(seed: number) {
    let s = seed;
    return () => {
        s = (s * 1664525 + 1013904223) % 4294967296;
        return s / 4294967296;
    };
}

const smooth = (edge0: number, edge1: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ dots */

const dotsVertex = /* glsl */ `
    uniform float uTime;
    uniform float uSize;
    attribute float aSeed;
    varying float vGlow;
    varying float vFade;
    varying float vLat;

    void main() {
        vec3 n = normalize(position);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;

        // A bright band that sweeps over the surface like a scan
        vGlow = smoothstep(0.8, 1.0, sin(n.y * 3.0 + n.x * 1.5 - uTime * 0.9));
        vFade = smoothstep(-0.05, 0.55, normalize(normalMatrix * n).z);
        vLat = n.y * 0.5 + 0.5;
        gl_PointSize = uSize * (0.7 + aSeed * 0.6 + vGlow * 0.9) / -mv.z;
    }
`;

const dotsFragment = /* glsl */ `
    uniform vec3 uSecondary;
    uniform vec3 uAccent;
    uniform float uOpacity;
    varying float vGlow;
    varying float vFade;
    varying float vLat;

    void main() {
        float disc = smoothstep(0.5, 0.2, length(gl_PointCoord - 0.5));
        vec3 base = mix(uAccent, uSecondary, vLat);
        vec3 color = mix(base, vec3(1.0), vGlow);
        gl_FragColor = vec4(color, disc * (0.38 + 0.62 * vGlow) * vFade * uOpacity);
    }
`;

/* ------------------------------------------------------------------ core */

const coreVertex = /* glsl */ `
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const coreFragment = /* glsl */ `
    uniform vec3 uSecondary;
    uniform vec3 uAccent;
    uniform vec3 uInk;
    varying vec3 vNormal;

    void main() {
        float rim = pow(1.0 - max(vNormal.z, 0.0), 2.6);
        float light = max(dot(vNormal, normalize(vec3(-0.5, 0.6, 0.6))), 0.0);
        vec3 color = uInk * 0.8 + (uInk * 0.8 + 0.008) * light;
        color += mix(uAccent, uSecondary, vNormal.y * 0.5 + 0.5) * rim * 0.42;
        gl_FragColor = vec4(color, 1.0);
    }
`;

/* ------------------------------------------------------------ atmosphere */

const ATMOSPHERE_SCALE = 1.25;

const atmosphereFragment = /* glsl */ `
    uniform vec3 uSecondary;
    uniform vec3 uAccent;
    uniform float uOpacity;
    varying vec3 vNormal;

    void main() {
        // Back faces only: brightest next to the globe, fading to nothing at the outer edge
        float glow = pow(clamp(-vNormal.z / 0.6, 0.0, 1.0), 2.4);
        vec3 color = mix(uAccent, uSecondary, vNormal.y * 0.5 + 0.5);
        gl_FragColor = vec4(color, glow * 0.6 * uOpacity);
    }
`;

/* ------------------------------------------------------------------ arcs */

const arcsVertex = /* glsl */ `
    uniform float uTime;
    uniform float uSize;
    attribute float aT;
    attribute float aPhase;
    attribute float aSpeed;
    attribute float aKind;
    uniform vec3 uAccent;
    uniform vec3 uSecondary;
    uniform vec3 uTertiary;
    attribute float aTone;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        vColor = aTone < 0.5 ? uAccent : (aTone < 1.5 ? uSecondary : uTertiary);

        if (aKind > 0.5) {
            // Endpoints pulse where a signal lands
            float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + aPhase * 6.2831);
            vAlpha = 0.55 + 0.45 * pulse;
            gl_PointSize = uSize * (1.3 + pulse * 0.9) / -mv.z;
        } else {
            // A comet travels along the arc, leaving a short trail
            float head = fract(uTime * aSpeed + aPhase) * 1.5 - 0.25;
            float behind = head - aT;
            float trail = (behind > 0.0 && behind < 0.42) ? 1.0 - behind / 0.42 : 0.0;
            vAlpha = max(trail, 0.08);
            gl_PointSize = uSize * (0.45 + trail * 1.2) / -mv.z;
        }
    }
`;

const arcsFragment = /* glsl */ `
    uniform float uOpacity;
    varying float vAlpha;
    varying vec3 vColor;

    void main() {
        float disc = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
        gl_FragColor = vec4(vColor, disc * vAlpha * uOpacity);
    }
`;

/* ---------------------------------------------------------------- scene */

// Continent-like clusters, so the dots read as a world rather than a uniform ball
function onLand(x: number, y: number, z: number) {
    const n =
        Math.sin(x * 2.3 + 1.7) * Math.cos(y * 2.9 - 0.4) +
        Math.sin(z * 2.6 + x * 1.9 + 2.1) * 0.8 +
        Math.cos(y * 4.1 + z * 3.3) * 0.45;
    return n > 0.1;
}

function buildDots(candidates: number) {
    const positions: number[] = [];
    const seeds: number[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    const random = seeded(7);
    for (let i = 0; i < candidates; i++) {
        const y = 1 - (i / (candidates - 1)) * 2;
        const ring = Math.sqrt(1 - y * y);
        const theta = golden * i;
        const x = Math.cos(theta) * ring;
        const z = Math.sin(theta) * ring;
        const seed = random();
        if (!onLand(x, y, z)) continue;
        positions.push(x * RADIUS, y * RADIUS, z * RADIUS);
        seeds.push(seed);
    }
    return { positions: new Float32Array(positions), seeds: new Float32Array(seeds) };
}

function buildArcs(count: number) {
    const STEPS = 72;
    const random = seeded(21);
    // 0 = accent, 1 = secondary, 2 = tertiary; resolved to colours in the shader
    const tones = [0, 1, 0, 2, 1];
    const positions: number[] = [];
    const t: number[] = [];
    const phase: number[] = [];
    const speed: number[] = [];
    const kind: number[] = [];
    const tone: number[] = [];

    const randomPoint = () => {
        const u = random() * 2 - 1;
        const a = random() * Math.PI * 2;
        const r = Math.sqrt(1 - u * u);
        return new THREE.Vector3(Math.cos(a) * r, u, Math.sin(a) * r);
    };

    for (let i = 0; i < count; i++) {
        const from = randomPoint();
        let to = randomPoint();
        // Keep arcs a readable length: not tiny, not all the way round
        for (let tries = 0; tries < 20 && (from.angleTo(to) < 0.6 || from.angleTo(to) > 2.2); tries++) {
            to = randomPoint();
        }
        const lift = 0.12 + from.angleTo(to) * 0.14;
        const arcPhase = random();
        const arcSpeed = 0.1 + random() * 0.1;
        const arcTone = tones[i % tones.length];
        const push = (v: THREE.Vector3, at: number, isEnd: number) => {
            positions.push(v.x, v.y, v.z);
            t.push(at);
            phase.push(arcPhase);
            speed.push(arcSpeed);
            kind.push(isEnd);
            tone.push(arcTone);
        };

        for (let s = 0; s <= STEPS; s++) {
            const at = s / STEPS;
            const height = RADIUS * (1 + lift * Math.sin(Math.PI * at));
            // Interpolate across the surface, then lift the middle of the arc away from it
            const point = from.clone().lerp(to, at).normalize().multiplyScalar(height);
            push(point, at, 0);
        }
        push(from.clone().multiplyScalar(RADIUS * 1.005), 0, 1);
        push(to.clone().multiplyScalar(RADIUS * 1.005), 1, 1);
    }

    return {
        positions: new Float32Array(positions),
        t: new Float32Array(t),
        phase: new Float32Array(phase),
        speed: new Float32Array(speed),
        kind: new Float32Array(kind),
        tone: new Float32Array(tone),
    };
}

function buildRing(radius: number) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
}

function buildStars(count: number) {
    const random = seeded(99);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions.set([(random() - 0.5) * 30, (random() - 0.5) * 16, -3 - random() * 10], i * 3);
    }
    return positions;
}

const Globe = ({ onReady }: { onReady: () => void }) => {
    const group = useRef<THREE.Group>(null);
    const stars = useRef<THREE.Points>(null);
    const ringA = useRef<THREE.Group>(null);
    const ringB = useRef<THREE.Group>(null);
    const satellite = useRef<THREE.Mesh>(null);
    const eased = useRef(0);
    const appear = useRef(0);
    const spin = useRef(0);
    const pointer = useRef({ x: 0, y: 0 });
    const tilt = useRef({ x: 0, y: 0 });
    const slowFrames = useRef(0);

    const gl = useThree((state) => state.gl);
    const scene = useThree((state) => state.scene);
    const camera = useThree((state) => state.camera);
    const setDpr = useThree((state) => state.setDpr);
    const size = useThree((state) => state.size);
    const viewport = useThree((state) => state.viewport);
    const compact = size.width < 1024;

    const dots = useMemo(() => buildDots(compact ? 15000 : 26000), [compact]);
    const arcs = useMemo(() => buildArcs(compact ? 7 : 11), [compact]);
    const ringGeometryA = useMemo(() => buildRing(RADIUS * 1.5), []);
    const ringGeometryB = useMemo(() => buildRing(RADIUS * 1.85), []);
    const starPositions = useMemo(() => buildStars(420), []);

    // One set of uniforms shared by every material, so a single update drives them all
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uSize: { value: 1 },
            uOpacity: { value: 0 },
            uAccent: { value: new THREE.Color('#7aa2f7') },
            uSecondary: { value: new THREE.Color('#5eb5b0') },
            uTertiary: { value: new THREE.Color('#e9edf6') },
            uInk: { value: new THREE.Color('#0a0f1e') },
        }),
        [],
    );

    // Built by hand rather than as JSX so every material keeps a reference to the
    // same uniforms object; the per-frame updates below then reach all of them.
    const materials = useMemo(() => {
        const glowing = { uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending };
        return {
            core: new THREE.ShaderMaterial({ uniforms, vertexShader: coreVertex, fragmentShader: coreFragment }),
            atmosphere: new THREE.ShaderMaterial({
                ...glowing,
                vertexShader: coreVertex,
                fragmentShader: atmosphereFragment,
                side: THREE.BackSide,
            }),
            dots: new THREE.ShaderMaterial({ ...glowing, vertexShader: dotsVertex, fragmentShader: dotsFragment }),
            arcs: new THREE.ShaderMaterial({ ...glowing, vertexShader: arcsVertex, fragmentShader: arcsFragment }),
            ringA: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32 }),
            ringB: new THREE.LineBasicMaterial({ transparent: true, opacity: 0.2 }),
        };
    }, [uniforms]);

    // Take colours from the page's theme variables (set on <html> before first paint)
    useEffect(() => {
        const style = getComputedStyle(document.documentElement);
        const value = (name: string) => style.getPropertyValue(name);
        setFromCss(uniforms.uAccent.value, value('--color-accent'));
        setFromCss(uniforms.uSecondary.value, value('--color-secondary'));
        setFromCss(uniforms.uTertiary.value, value('--color-tertiary'));
        setFromCss(uniforms.uInk.value, value('--color-ink'));
        materials.ringA.color.set(value('--color-accent').trim());
        materials.ringB.color.set(value('--color-secondary').trim());
    }, [uniforms, materials]);

    // Compile the shaders before the first frame. Where the browser supports
    // it this happens in parallel, so the page does not freeze while it runs;
    // the render loop only starts once it has finished.
    useEffect(() => {
        let cancelled = false;
        gl.compileAsync(scene, camera)
            .catch(() => undefined)
            .then(() => {
                if (!cancelled) onReady();
            });
        return () => {
            cancelled = true;
        };
    }, [gl, scene, camera, onReady]);

    // Three poses, one per hero statement. On wide screens the globe sits
    // opposite the text; on narrow ones it rises from the bottom edge behind it.
    const poses = useMemo(() => {
        const w = viewport.width;
        const h = viewport.height;
        const fit = compact ? Math.min(1, (w * 0.4) / RADIUS) : 1;
        return compact
            ? [
                  { x: 0, y: -h * 0.37, s: fit },
                  { x: 0, y: -h * 0.37, s: fit * 1.12 },
                  { x: 0, y: -h * 0.16 - RADIUS * fit * 1.9, s: fit * 1.9 },
              ]
            : [
                  { x: w * 0.23, y: -0.05, s: 1 },
                  { x: -w * 0.23, y: -0.05, s: 1.1 },
                  { x: 0, y: -h * 0.1 - RADIUS * 1.85, s: 1.85 },
              ];
    }, [viewport.width, viewport.height, compact]);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            pointer.current.x = e.clientX / window.innerWidth - 0.5;
            pointer.current.y = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    useFrame((state, rawDelta) => {
        const g = group.current;
        if (!g) return;

        // After a pause (a busy moment, or a return to the tab) one frame can
        // report a long gap; capping it stops the globe from jumping.
        const delta = Math.min(rawDelta, 0.05);

        // On a GPU that cannot keep up, drop to one pixel per CSS pixel
        if (viewport.dpr > 1 && appear.current === 1) {
            slowFrames.current = rawDelta > 1 / 40 ? slowFrames.current + 1 : Math.max(0, slowFrames.current - 1);
            if (slowFrames.current > 45) setDpr(1);
        }

        const step = Math.min(1, delta * 4);
        eased.current += (heroProgress.value - eased.current) * step;
        // Fade in over about half a second once the first frame is ready
        appear.current = Math.min(1, appear.current + delta * 1.8);
        tilt.current.x += (pointer.current.x - tilt.current.x) * step * 0.5;
        tilt.current.y += (pointer.current.y - tilt.current.y) * step * 0.5;
        spin.current += delta * 0.07;

        const p = eased.current;
        const intro = 1 - Math.pow(1 - appear.current, 3);
        const time = state.clock.elapsedTime;

        uniforms.uTime.value = time;
        uniforms.uSize.value = size.height * viewport.dpr * 0.03;
        // Dimmer on narrow screens, where the globe sits behind the text
        uniforms.uOpacity.value = intro * (compact ? 0.75 : 1);

        const a = smooth(0.14, 0.4, p);
        const b = smooth(0.52, 0.8, p);
        const mix = (k: 'x' | 'y' | 's') => {
            const first = poses[0][k] + (poses[1][k] - poses[0][k]) * a;
            return first + (poses[2][k] - first) * b;
        };

        g.position.set(mix('x'), mix('y'), 0);
        g.scale.setScalar(mix('s'));
        g.rotation.y = spin.current + p * 2.4;
        g.rotation.x = 0.28 + tilt.current.y * 0.25;
        g.rotation.z = -0.12 + tilt.current.x * -0.12;

        if (ringA.current) ringA.current.rotation.y = time * 0.25;
        if (ringB.current) ringB.current.rotation.y = -time * 0.16;
        if (satellite.current) {
            const angle = time * 0.6;
            satellite.current.position.set(Math.cos(angle) * RADIUS * 1.5, 0, Math.sin(angle) * RADIUS * 1.5);
        }
        if (stars.current) {
            stars.current.position.x = tilt.current.x * -0.6;
            stars.current.position.y = tilt.current.y * 0.4 + p * 1.2;
        }
    });

    return (
        <>
            <points ref={stars}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial color="#ffffff" size={0.035} sizeAttenuation transparent opacity={0.55} depthWrite={false} />
            </points>

            <group ref={group}>
                <mesh material={materials.core}>
                    <sphereGeometry args={[RADIUS * 0.985, 64, 64]} />
                </mesh>

                <mesh scale={ATMOSPHERE_SCALE} material={materials.atmosphere}>
                    <sphereGeometry args={[RADIUS, 64, 64]} />
                </mesh>

                <points key={`dots-${dots.seeds.length}`} material={materials.dots}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[dots.positions, 3]} />
                        <bufferAttribute attach="attributes-aSeed" args={[dots.seeds, 1]} />
                    </bufferGeometry>
                </points>

                <points key={`arcs-${arcs.t.length}`} material={materials.arcs}>
                    <bufferGeometry>
                        <bufferAttribute attach="attributes-position" args={[arcs.positions, 3]} />
                        <bufferAttribute attach="attributes-aT" args={[arcs.t, 1]} />
                        <bufferAttribute attach="attributes-aPhase" args={[arcs.phase, 1]} />
                        <bufferAttribute attach="attributes-aSpeed" args={[arcs.speed, 1]} />
                        <bufferAttribute attach="attributes-aKind" args={[arcs.kind, 1]} />
                        <bufferAttribute attach="attributes-aTone" args={[arcs.tone, 1]} />
                    </bufferGeometry>
                </points>

                <group rotation={[1.25, 0, 0.35]}>
                    <group ref={ringA}>
                        <lineLoop geometry={ringGeometryA} material={materials.ringA} />
                        <mesh ref={satellite}>
                            <sphereGeometry args={[0.035, 16, 16]} />
                            <meshBasicMaterial color="#ffffff" />
                        </mesh>
                    </group>
                </group>
                <group rotation={[1.05, 0, -0.5]}>
                    <group ref={ringB}>
                        <lineLoop geometry={ringGeometryB} material={materials.ringB} />
                    </group>
                </group>
            </group>
        </>
    );
};

const HeroScene = ({ onLive }: { onLive?: () => void }) => {
    const container = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(true);
    const [compiled, setCompiled] = useState(false);
    const onReady = useCallback(() => {
        setCompiled(true);
        onLive?.();
    }, [onLive]);

    useEffect(() => {
        // Stop rendering once the hero has scrolled out of view
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
        if (container.current) observer.observe(container.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={container} className="hero-scene" aria-hidden="true">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 7.5], fov: 35 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                frameloop={visible && compiled ? 'always' : 'never'}
                style={{ pointerEvents: 'none' }}
            >
                <Globe onReady={onReady} />
            </Canvas>
        </div>
    );
};

export default HeroScene;
