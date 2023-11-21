<template>
  <div>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
// 场景
const scene = new THREE.Scene();
// 渲染器 递归渲染 17.2ms渲染一次
const render = () => {}
// 摄像机位置
onMounted(() => {
  render();// 有 DOM了渲染
  // 网格地面
  // 模型加载器
})
</script>

<style lang="scss" scoped></style>