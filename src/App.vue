<template>
  <div class="app">
    <h1>泰语旅行英语</h1>
    <div class="card-list">
      <div v-for="item in wordList" :key="item.id" class="card">
        <div class="en">{{ item.english }}</div>
        <div class="cn">{{ item.chinese }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const wordList = ref([])

// 加载数据（线上绝对正确）
async function loadData() {
  try {
    const res = await fetch('./allData.json')
    const data = await res.json()
    wordList.value = data
  } catch (err) {
    console.error('加载失败', err)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 20px auto;
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
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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