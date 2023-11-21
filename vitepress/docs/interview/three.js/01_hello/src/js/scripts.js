import * as THREE from 'three';
// 创建渲染场景
const scene = new THREE.Scene();
// 创建透视相机，视角的位置
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 创建渲染器
const renderer = new THREE.WebGLRenderer({ canvas: getSelectionCanvas() });
// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// 创建网格体系
const cube = new THREE.Mesh(geometry, material);// 几何体和材质
scene.add( cube );// 场景添加体系
// 创建光源
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
// 光源位置
light.position.set(-1, 2, 4);
// 添加光源
scene.add(light);

camera.position.z = 5;

const render = (time) => {
    time = time * 0.001;
    // 旋转
    requestAnimationFrame(render);// 递归循环执行
}
requestAnimationFrame(render);// 定时器刷新
