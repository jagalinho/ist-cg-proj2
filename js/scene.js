var currCamera, scene, renderer, clock, delta;
var cameras = [], top_camera, perspective_camera, ball_camera, followCameraDistance = 40, to_follow = 0;
var view_size = 100;

var field, field_size = 100;
var balls, ball_radius, n_balls = 10, min_ball_speed = 5, max_ball_speed = 10, ball_accel = 0.5, ball_accel_interval = 1500, ball_accel_scaling = 0.7;

//trackball stuff
var cameraTrackball, trackballControls, trackball_clock;

function createScene() {
    'use strict';
    scene = new THREE.Scene();
    //scene.add(new THREE.AxesHelper(10));

    let field_width = field_size, field_length = field_size / 2, field_height = Math.sqrt(5) * field_size / 20;
    ball_radius = field_height / 2;
    field = createField(0, 0, 0, field_width, field_length, field_height);
    balls = createBalls(n_balls, ball_radius, 0, 2, 0, field_width / 2, field_length / 2, min_ball_speed, max_ball_speed, ball_accel, ball_accel_interval, ball_accel_scaling);
}

function createCameras() {
    'use strict';
    let aspect_ratio = window.innerWidth / window.innerHeight;

    //1
    top_camera = new THREE.OrthographicCamera(aspect_ratio * view_size / -2, aspect_ratio * view_size / 2, view_size / 2, view_size / -2, view_size * -1.5, view_size * 1.5);
    top_camera.position.set(0, 1, 0);
    top_camera.lookAt(scene.position);

    //2
    perspective_camera = new THREE.PerspectiveCamera(70, aspect_ratio, 1, 1000);
    perspective_camera.position.set(50, 50, 70);
    perspective_camera.lookAt(scene.position);
 
    //3 
    ball_camera = new THREE.PerspectiveCamera(75, aspect_ratio, 1, 1000);

    cameras.push(top_camera, perspective_camera, ball_camera);

    //Set Default
    currCamera = top_camera;

    //Trackball
    cameraTrackball = new THREE.PerspectiveCamera(70, aspect_ratio, 1, 1000);
    cameraTrackball.position.set(50, 50, 70);
    cameraTrackball.lookAt(scene.position);

    trackballControls = new THREE.TrackballControls(cameraTrackball);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 0.5;
    trackballControls.panSpeed = 1.0;
}

function updateBallCamera() {
    ball_camera.position.set(balls[to_follow].position.x + ball_radius + followCameraDistance, balls[to_follow].position.y + ball_radius + (followCameraDistance / 2), balls[to_follow].position.z);
    ball_camera.lookAt(balls[to_follow].position);
}

function toggleWireframe() {
    'use strict';
    scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.material.wireframe = !node.material.wireframe;
        }
    });
}

function toggleAxisHelper() {
    'use strict';
    scene.traverse(function (node) {
        if (node instanceof THREE.AxesHelper) {
            node.visible = !node.visible;
        }
    });
}

function onResize() {
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        let aspect_ratio = window.innerWidth / window.innerHeight;
        let scaling = window.innerWidth < view_size * 10 ? view_size / window.innerWidth * 10 : 1;
        let horizontal = aspect_ratio * view_size / 2 * scaling;
        let vertical = view_size / 2 * scaling;
        cameras.forEach(camera => {
            if (camera.isPerspectiveCamera) {
                camera.aspect = aspect_ratio;
                camera.zoom = 1 / scaling;
            } else {
                camera.top = vertical;
                camera.bottom = -vertical;
                camera.left = -horizontal;
                camera.right = horizontal;
            }
            camera.updateProjectionMatrix();
        });
    }
}

function onKeyDown(e) {
    'use strict';
    switch (e.keyCode) {
    case 65: //A
    case 97: //a
        toggleWireframe();
        break;
    case 69:  //E
    case 101: //e
        toggleAxisHelper();
        break;
    case 49: //1
        currCamera = top_camera;
        break;
    case 50: //2
        currCamera = perspective_camera;
        break;
    case 51: //3
        if (++to_follow >= n_balls) to_follow = 0;
        currCamera = ball_camera;
        break;
    case 48: //0
        currCamera = cameraTrackball;
        break;
    }
}

function render() {
    'use strict';
    renderer.render(scene, currCamera);
    
    //trackball stuff
    if (currCamera === cameraTrackball)
        trackballControls.update(trackball_clock.getDelta());
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    //trackball stuff
    trackball_clock = new THREE.Clock();
   
    createScene();
    createCameras();
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';
    delta = clock.getDelta();
    simulateBallMovement(delta);
    updateBallCamera();
    render();
    requestAnimationFrame(animate);
}