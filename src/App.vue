<template>
  <div class="app">
    <div class="header">
      <h1>泰国旅行英语大全</h1>
      <button @click="toggleDark" class="dark-btn">
        {{ darkMode ? '☀️ 浅色模式' : '🌙 暗黑模式' }}
      </button>
    </div>

    <!-- 分类遍历 -->
    <div class="category-wrap" v-if="categoryList.length">
      <div class="category-item" v-for="cate in categoryList" :key="cate.name">
        <div class="cate-head">
          <h2>{{ cate.name }}</h2>
          <span class="desc">{{ cate.desc }}</span>
        </div>

        <!-- 当前分类下单词卡片 -->
        <div class="card-list">
          <div
            v-for="(item, idx) in cate.list"
            :key="idx"
            class="card"
            :class="{ learned: isLearned(item.en) }"
            @click="toggleLearned(item.en)"
          >
            <div class="en">{{ item.en }}</div>
            <div class="cn">{{ item.cn }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 持久化封装
const getLocal = (key) => {
  const val = localStorage.getItem(key)
  return val ? JSON.parse(val) : []
}
const setLocal = (key, val) => {
  localStorage.setItem(key, JSON.stringify(val))
}

const categoryList = ref([])
// 用英文句子做唯一标记
const learnedList = ref(getLocal('thai_learned_en'))
const darkMode = ref(getLocal('thai_dark') || false)

// 暗黑切换
const toggleDark = () => {
  darkMode.value = !darkMode.value
  setLocal('thai_dark', darkMode.value)
  document.documentElement.classList.toggle('dark', darkMode.value)
}

// 标记已学/取消
const toggleLearned = (enText) => {
  const idx = learnedList.value.indexOf(enText)
  if (idx > -1) {
    learnedList.value.splice(idx, 1)
  } else {
    learnedList.value.push(enText)
  }
  setLocal('thai_learned_en', learnedList.value)
}

const isLearned = (enText) => {
  return learnedList.value.includes(enText)
}

// 加载 public 下 json 适配 GitHub Pages
const loadData = async () => {
  const base = import.meta.env.BASE_URL
  const res = await fetch(`${base}allData.json`)
  categoryList.value = await res.json()
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', darkMode.value)
  loadData()
})
</script>

<style scoped>
.app {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.dark-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #eee;
}
.category-item {
  margin-bottom: 36px;
}
.cate-head {
  margin-bottom: 12px;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}
.cate-head h2 {
  margin: 0;
  font-size: 18px;
}
.desc {
  font-size: 13px;
  color: #666;
}
.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.card {
  padding: 16px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
}
.card.learned {
  background: #e8f5e9;
}
.en {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}
.cn {
  font-size: 14px;
  color: #555;
}
</style>

<style>
.dark {
  background: #1a1a1a;
  color: #eee;
}
.dark .card {
  background: #2d2d2d;
  color: #eee;
}
.dark .card.learned {
  background: #274029;
}
.dark .cn,
.dark .desc {
  color: #aaa;
}
.dark .dark-btn {
  background: #333;
  color: #eee;
}
</style>