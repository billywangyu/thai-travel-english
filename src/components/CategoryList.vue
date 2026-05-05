<template>
  <div class="category-list">
    <div class="category-item" v-for="cate in categories" :key="cate.name">
      <div class="category-header">
        <h2>{{ cate.name }}</h2>
        <p class="desc">{{ cate.desc }}</p>
      </div>

      <div class="cards">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

const categories = ref([])
const learned = ref([])

// 本地持久化
const loadLearned = () => {
  const saved = localStorage.getItem('thai-learned')
  if (saved) learned.value = JSON.parse(saved)
}

const toggleLearned = (en) => {
  const i = learned.value.indexOf(en)
  i > -1 ? learned.value.splice(i, 1) : learned.value.push(en)
  localStorage.setItem('thai-learned', JSON.stringify(learned.value))
}

const isLearned = (en) => learned.value.includes(en)

// 加载数据（适配 GitHub Pages）
const loadData = async () => {
  const base = import.meta.env.BASE_URL
  const res = await fetch(base + 'allData.json')
  categories.value = await res.json()
}

onMounted(() => {
  loadData()
  loadLearned()
})
</script>

<style scoped>
.category-item {
  margin-bottom: 40px;
}
.category-header {
  border-left: 4px solid #42b983;
  padding-left: 12px;
  margin-bottom: 16px;
}
.desc {
  font-size: 13px;
  color: #666;
  margin: 4px 0 0;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}
.card {
  padding: 16px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  cursor: pointer;
}
.card.learned {
  background: #e8f5e9;
}
.en {
  font-weight: 600;
  margin-bottom: 6px;
}
.cn {
  font-size: 14px;
  color: #555;
}
</style>