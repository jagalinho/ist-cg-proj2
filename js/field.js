function addFieldBase(obj, x, y, z, size_x, size_z) {
    'use strict';
    var geometry = new THREE.CubeGeometry(size_x, 2, size_z);
    var material = new THREE.MeshBasicMaterial({color: 0x00cc00, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFieldWallV(obj, x, y, z, size_z, size_y) {
    'use strict';
    var geometry = new THREE.CubeGeometry(2, size_y, size_z);
    var material = new THREE.MeshBasicMaterial({color: 0x44aa00, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addFieldWallH(obj, x, y, z, size_x, size_y) {
    'use strict';
    var geometry = new THREE.CubeGeometry(size_x + 4, size_y, 2);
    var material = new THREE.MeshBasicMaterial({color: 0x44aa00, wireframe: true});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createField(x, y, z, width, length, height) {
    'use strict';
    var field = new THREE.Object3D();
   
    addFieldBase(field, 0, 1, 0, width, length);
    addFieldWallV(field, -(width / 2) - 1, height / 2, 0, length, height);
    addFieldWallV(field, (width / 2) + 1, height / 2, 0, length, height);
    addFieldWallH(field, 0, height / 2, -(length / 2) - 1, width, height);
    addFieldWallH(field, 0, height / 2, (length / 2) + 1, width, height);
    
    field.position.set(x, y, z);
    scene.add(field);

    return field;
}