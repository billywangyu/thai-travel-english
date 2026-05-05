<template>
  <div class="app">
    <div class="header">
      <h1>泰语旅行英语</h1>
      <button @click="toggleDark" class="dark-btn">
        {{ darkMode ? '☀️ 白天' : '🌙 暗黑' }}
      </button>
    </div>

    <div class="card-list">
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
import { setLocal, getLocal } from './utils/storage.js'

// 数据列表
const wordList = ref([])

// 本地持久化：已学习单词
const learnedIds = ref(getLocal('thai_learned') || [])

// 本地持久化：暗黑模式
const darkMode = ref(getLocal('thai_dark') || false)

// 切换暗黑
const toggleDark = () => {
  darkMode.value = !darkMode.value
  setLocal('thai_dark', darkMode.value)
  document.documentElement.classList.toggle('dark', darkMode.value)
}

// 标记已学 / 取消
const toggleLearned = (id) => {
  const idx = learnedIds.value.indexOf(id)
  if (idx > -1) {
    learnedIds.value.splice(idx, 1)
  } else {
    learnedIds.value.push(id)
  }
  setLocal('thai_learned', learnedIds.value)
}

// 判断是否已学
const isLearned = (id) => {
  return learnedIds.value.includes(id)
}

// 加载数据（路径 100% 正确）
const loadData = async () => {
  try {
    const res = await fetch('/thai-travel-english/allData.json')
    wordList.value = await res.json()
  } catch (err) {
    console.error('加载失败', err)
  }
}

// 初始化
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
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
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
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: pointer;
}
.card.learned {
  background: #e6f7e6;
}
.en {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}
.cn {
  font-size: 14px;
  color: #666;
}

.dark {
  background: #222;
  color: white;
}
.dark .card {
  background: #333;
  color: white;
}
</style>