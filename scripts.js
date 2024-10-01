// scripts.js
document.addEventListener("DOMContentLoaded", function() {
    particlesJS("particles-js", {
        particles: {
            number: { value: 150, density: { enable: true, value_area: 1200 } },
            color: { value: ["#00ff85", "#ff00ff", "#00ffff"] },
            shape: {
                type: ["circle", "triangle", "edge"],
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 6 }
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 4,
                random: true,
                anim: { enable: true, speed: 10, size_min: 0.1, sync: false }
            },
            line_linked: { enable: true, distance: 150, color: "#00ff85", opacity: 0.4, width: 2 },
            move: {
                enable: true,
                speed: 6,
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "bubble" },
                resize: true
            },
            modes: {
                grab: { distance: 400, line_linked: { opacity: 1 } },
                bubble: { distance: 400, size: 20, duration: 2, opacity: 8, speed: 3 },
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 }
            }
        },
        retina_detect: true
    });

    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01";
    const fontSize = 24;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#00ff85";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(draw, 33);

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('three-js-container').appendChild(renderer.domElement);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Adding a dynamic background shader
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float time;
        varying vec2 vUv;
        void main() {
            vec2 uv = vUv;
            vec3 color = vec3(0.0);
            color.r = 0.5 + 0.5 * cos(uv.x * 10.0 + time * 0.5);
            color.g = 0.5 + 0.5 * cos(uv.y * 10.0 + time * 0.5 + 2.0);
            color.b = 0.5 + 0.5 * cos((uv.x + uv.y) * 10.0 + time * 0.5 + 4.0);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const uniforms = {
        time: { type: "f", value: 1.0 }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
    scene.add(plane);

    function animate() {
        requestAnimationFrame(animate);
        uniforms.time.value += 0.05;
        renderer.render(scene, camera);
    }
    animate();

    // Load a GLTF model
    const loader = new THREE.GLTFLoader();
    loader.load('path/to/your/model.glb', function(gltf) {
        const model = gltf.scene;
        model.scale.set(10, 10, 10);
        scene.add(model);

        function animateModel() {
            requestAnimationFrame(animateModel);
            model.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animateModel();
    });

    // Post-processing with shaders for Glitch effects
    const composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    const glitchPass = new THREE.GlitchPass();
    composer.addPass(glitchPass);

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        camera.position.x += mouseX * 0.05;
        camera.position.y += mouseY * 0.05;
        camera.lookAt(scene.position);
    });

    function animate() {
        requestAnimationFrame(animate);
        composer.render();
    }

    animate();

    const audio = new Audio('ambient-sound.mp3');
    audio.loop = true;
    audio.play();
});

function alertMessage() {
    const audioEffect = new Audio('button-click.mp3');
    audioEffect.play();
    alert('Welcome to the Cyberpunk World!');
}

function changeBackgroundColor() {
    const colors = ['#001f3f', '#0074D9', '#7FDBFF', '#39CCCC', '#3D9970', '#2ECC40', '#FFDC00', '#FF851B', '#FF4136', '#85144b'];
    document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
}