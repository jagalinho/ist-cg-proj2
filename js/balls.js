var balls, n_balls, ball_radius, vel;
var min_x, max_x, min_z, max_z;

function createBall(position, radius) {
    'use strict';
    var geometry = new THREE.SphereGeometry(radius, radius * 4, radius * 4);
    var material = new THREE.MeshBasicMaterial({color: 0xcc0044, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.add(new THREE.AxesHelper(5));
    mesh.position.copy(position);
    scene.add(mesh);
    return mesh;
}

function initBallMovement(min_speed, max_speed, accel, accel_interval, accel_scaling) {
    for (let i = 0; i < n_balls; i++)
        vel.push(new THREE.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1).setLength(Math.random() * (max_speed - min_speed) + min_speed));
    setInterval(() => {
        for (let i = 0; i < n_balls; i++)
            vel[i].setLength(vel[i].length() * (1 + accel));
        accel *= accel_scaling;
    }, accel_interval);
}

function createBalls(n, radius, x, y, z, radius_x, radius_z, min_speed, max_speed, accel, accel_interval, accel_scaling) {
    'use strict';
    balls = [], n_balls = n, ball_radius = radius, vel = [];
    min_x = x - radius_x + ball_radius, max_x = x + radius_x - ball_radius;
    min_z = z - radius_z + ball_radius, max_z = z + radius_z - ball_radius;

    for (let i = 0; i < n_balls; i++) {
        let position = new THREE.Vector3(0, y + ball_radius, 0);
        do {
            position.x = Math.random() * (max_x - min_x) + min_x;
            position.z = Math.random() * (max_z - min_z) + min_z;
        } while (balls.some(ball => position.distanceTo(ball.position) < ball_radius * 2));
        balls.push(createBall(position, ball_radius));
    }

    initBallMovement(min_speed, max_speed, accel, accel_interval, accel_scaling);

    return balls;
}

function moveBall(ball, vel) {
    ball.rotateOnWorldAxis(vel.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2).normalize(), vel.length() / ball_radius).position.add(vel);
}

function checkWallCollision(ball, vel) {
    let next_pos = ball.position.clone().add(vel.clone().multiplyScalar(delta));

    if (next_pos.x <= min_x)
        vel.x = Math.abs(vel.x);
    else if (next_pos.x >= max_x)
        vel.x = -Math.abs(vel.x);
    if (next_pos.z <= min_z)
        vel.z = Math.abs(vel.z);
    else if (next_pos.z >= max_z)
        vel.z = -Math.abs(vel.z);
}

function checkBallCollision(this_ball, other_ball, this_vel, other_vel, delta) {
    let this_ball_next_pos = this_ball.position.clone().add(this_vel.clone().multiplyScalar(delta));
    let other_ball_next_pos = other_ball.position.clone().add(other_vel.clone().multiplyScalar(delta));

    let distance = this_ball_next_pos.distanceTo(other_ball_next_pos);
    if (distance <= ball_radius * 2) {
        let this_vel_diff = this_vel.clone().sub(other_vel), this_next_pos_diff = this_ball_next_pos.clone().sub(other_ball_next_pos);
        let other_vel_diff = other_vel.clone().sub(this_vel), other_next_pos_diff = other_ball_next_pos.clone().sub(this_ball_next_pos);
        this_vel.sub(this_next_pos_diff.multiplyScalar(this_vel_diff.dot(this_next_pos_diff) / this_next_pos_diff.lengthSq()));
        other_vel.sub(other_next_pos_diff.multiplyScalar(other_vel_diff.dot(other_next_pos_diff) / other_next_pos_diff.lengthSq()));
        
        moveBall(this_ball, this_vel.clone().setLength(ball_radius - distance / 2));
        moveBall(other_ball, other_vel.clone().setLength(ball_radius - distance / 2));
    }
}

function simulateBallMovement(delta) {
    for (let i = 0; i < n_balls; i++) {
        checkWallCollision(balls[i], vel[i], delta);
        for (let j = i + 1; j < n_balls; j++)
            checkBallCollision(balls[i], balls[j], vel[i], vel[j], delta);
        moveBall(balls[i], vel[i].clone().multiplyScalar(delta));
    }
}