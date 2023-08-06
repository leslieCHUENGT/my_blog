<template>
  <div id="app">
      <div>
        <input 
          type="file"
          :disabled="status != Status.wait"
          @change="handleFileChange"
        />
        <el-button @click="handleUpload" :disabled="upload"></el-button>
      </div>
  </div>
</template>
<script>
const Status = {
  // 状态调整
  wait: "wait",
  pause: "pause",
  uploading: "uploading",
  // 文件对象
  container: {
    file: null,
  },
  // xhr 列表
  requestList: []
}
export default {
  name: 'App',
  data: () => ({
    Status,
    status: Status.wait
  }),
  computed: {
    uploadDisabled() {
      return (
        !this.container.file || 
        [Status.pause, Status.uploading].includes(this.status)
      )
    }
  },
  methods: {
    handleFileChange() {
      const [file] = e.target.files;
      if (!file) return;

      this.container.file = file;
    },
    handleUpload() {
      if (!this.container.file) return;
      this.status = Status.uploading;
      const fileChunkList = this.createFileChunk(this.container.file);

    },
    resetData() {
      this.requestList.forEach(xhr = xhr?.abort());
    },
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
