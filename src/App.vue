<template>
  <div class="app">
    <h1>泰语旅行英语</h1>

    <div class="card-list">
      <!-- 这里我不用 v-for，直接手写 2 个卡片！ -->
      <div class="card">
        <div class="en">Hello</div>
        <div class="cn">你好</div>
      </div>
      <div class="card">
        <div class="en">Thank you</div>
        <div class="cn">谢谢</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里什么都不要！
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
}
.card-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}
.card {
  padding: 20px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}
.en {
  font-size: 18px;
  font-weight: bold;
}
.cn {
  font-size: 14px;
  color: #666;
  margin-top: 6px;
}
</style>