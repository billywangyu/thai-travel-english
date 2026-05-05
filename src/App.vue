<template>
  <div class="app">
    <div class="header">
      <h1>泰语旅行英语</h1>
      <button @click="toggleDark" class="dark-btn">
        {{ darkMode ? '☀️ 浅色' : '🌙 暗黑' }}
      </button>
    </div>

    <div class="card-list" v-if="wordList.length">
      <div
        v-for="item in wordList"
        :key="item.id"
        class="card"
        :class="{ learned: isLearned(item.id) }"
        @click="toggleLearned(item.id)"
      >
        <div class="en">{{ item.english }}</div>
        <div class="cn">{{ item.chinese }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 本地持久化封装
const getLocal = (key) => {
  const val = localStorage.getItem(key)
  return val ? JSON.parse(val) : []
}
const setLocal = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}

const wordList = ref([])
const learnedIds = ref(getLocal('thai_learned'))
const darkMode = ref(getLocal('thai_dark') || false)

// 暗黑切换+持久化
const toggleDark = () => {
  darkMode.value = !darkMode.value
  setLocal('thai_dark', darkMode.value)
  document.documentElement.classList.toggle('dark', darkMode.value)
}

// 学习标记+持久化
const toggleLearned = (id) => {
  const idx = learnedIds.value.indexOf(id)
  idx > -1 
    ? learnedIds.value.splice(idx, 1)
    : learnedIds.value.push(id)
  setLocal('thai_learned', learnedIds.value)
}
const isLearned = (id) => learnedIds.value.includes(id)

// 加载public下的json 适配GitHub Pages
const loadData = async () => {
  const basePath = import.meta.env.BASE_URL
  const res = await fetch(`${basePath}allData.json`)
  wordList.value = await res.json()
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkMode.value)
  loadData()
})
</script>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.dark-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.card-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.card {
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
}
.card.learned {
  background: #e6f7e6;
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

<style global>
.dark {
  background: #222;
  color: #eee;
}
.dark .card {
  background: #333;
  color: #eee;
}
</style>