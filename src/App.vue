<template>
  <div class="container">
    <!-- 顶部进度栏 + 主题切换 -->
    <div class="top-bar">
      <div class="progress-box frosted">
        <div class="progress-title">学习进度</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="progress-text">
          <span>已掌握：{{ learnedTotal }}</span>
          <span>总计：{{ totalWordCount }}</span>
        </div>
      </div>
      <button class="theme-toggle" @click="switchTheme">
        {{ isDark ? '☀️ 浅色模式' : '🌙 暗黑模式' }}
      </button>
    </div>

    <!-- 分类卡片列表 -->
    <div class="category-grid">
      <div 
        class="category-card frosted" 
        v-for="(item, index) in categoryList" 
        :key="index"
        @click="openCategory(index)"
      >
        <h3 class="card-name">{{ item.name }}</h3>
        <p class="card-desc">{{ item.desc }}</p>
        <div class="card-tip" v-html="item.content"></div>
        <div class="card-progress">
          已学 {{ learnedList[index] || 0 }} / {{ item.total }}
        </div>
      </div>
    </div>

    <!-- 单词学习弹窗 -->
    <div class="modal-mask" v-show="showModal" @click.self="closeModal">
      <div class="modal-content frosted">
        <h4 class="modal-title">{{ currentCategory?.name }}</h4>
        <div class="modal-tip" v-html="currentCategory?.content"></div>
        
        <!-- 单词翻转卡片 -->
        <div class="flip-card" @click="flipCard">
          <div class="flip-inner" :class="{ flipped: isFlipped }">
            <div class="flip-front">
              {{ currentWord?.en }}
            </div>
            <div class="flip-back">
              {{ currentWord?.cn }}
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="btn-group">
          <button class="btn voice-btn" @click="playAudio">🔊 发音</button>
          <button class="btn learn-btn" @click="markLearned">✅ 已掌握</button>
          <button class="btn next-btn" @click="nextWord">➡️ 下一句</button>
          <button class="btn close-btn" @click="closeModal">❌ 关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// 主题状态
const isDark = ref(false)
// 分类与单词数据
const categoryList = ref([])
const learnedList = ref([])
// 弹窗与翻转状态
const showModal = ref(false)
const isFlipped = ref(false)
// 当前学习数据
let currentCateIndex = 0
let currentWordIndex = 0
const currentCategory = ref(null)
const currentWord = ref(null)

// 进度计算
const totalWordCount = computed(() => categoryList.value.reduce((sum, item) => sum + item.total, 0))
const learnedTotal = computed(() => learnedList.value.reduce((sum, num) => sum + (num || 0), 0))
const progressPercent = computed(() => totalWordCount.value ? Math.round(learnedTotal.value / totalWordCount.value * 100) : 0)

// 加载单词数据（适配GitHub Pages）
const loadCategoryData = async () => {
  const baseUrl = import.meta.env.BASE_URL
  const res = await fetch(`${baseUrl}allData.json`)
  categoryList.value = await res.json()
}

// 加载本地学习记录
const loadLearnedData = () => {
  const saved = localStorage.getItem('thai-travel-learned')
  if (saved) learnedList.value = JSON.parse(saved)
  while (learnedList.value.length < categoryList.value.length) learnedList.value.push(0)
}

// 主题切换与持久化
const loadTheme = () => {
  const savedTheme = localStorage.getItem('thai-travel-dark')
  isDark.value = savedTheme === 'true'
  document.documentElement.classList.toggle('dark', isDark.value)
}
const switchTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('thai-travel-dark', isDark.value)
  document.documentElement.classList.toggle('dark', isDark.value)
}

// 打开分类弹窗
const openCategory = (index) => {
  currentCateIndex = index
  currentWordIndex = learnedList.value[index] || 0
  currentCategory.value = categoryList.value[index]
  renderCurrentWord()
  showModal.value = true
}

// 渲染当前单词
const renderCurrentWord = () => {
  const wordList = currentCategory.value.list
  if (currentWordIndex >= wordList.length) currentWordIndex = wordList.length - 1
  currentWord.value = wordList[currentWordIndex]
  isFlipped.value = false
}

// 卡片翻转
const flipCard = () => {
  isFlipped.value = !isFlipped.value
}

// 英文发音
const playAudio = () => {
  const utterance = new SpeechSynthesisUtterance(currentWord.value.en)
  utterance.lang = 'en-US'
  utterance.rate = 0.85
  speechSynthesis.speak(utterance)
}

// 标记已掌握
const markLearned = () => {
  learnedList.value[currentCateIndex] = currentWordIndex + 1
  localStorage.setItem('thai-travel-learned', JSON.stringify(learnedList.value))
  nextWord()
}

// 下一个单词
const nextWord = () => {
  currentWordIndex++
  renderCurrentWord()
}

// 关闭弹窗
const closeModal = () => {
  showModal.value = false
}

// 初始化
onMounted(async () => {
  await loadCategoryData()
  loadLearnedData()
  loadTheme()
})

watch(isDark, () => {
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.progress-box {
  flex: 1;
  min-width: 280px;
  padding: 18px;
}
.progress-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 10px;
  color: var(--text-main);
}
.progress-bar-bg {
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.4s ease;
}
.progress-text {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 8px;
}
.theme-toggle {
  padding: 9px 15px;
  border: none;
  border-radius: 10px;
  background: var(--primary);
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-toggle:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
@media (max-width: 600px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}
.category-card {
  padding: 20px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
}
.card-name {
  font-size: 18px;
  color: var(--text-main);
  margin-bottom: 8px;
}
.card-desc {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 12px;
}
.card-tip {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.5;
  margin-bottom: 14px;
}
.card-progress {
  font-size: 12px;
  color: var(--text-sub);
  text-align: right;
}
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 999;
}
.modal-content {
  width: 100%;
  max-width: 480px;
  padding: 28px;
  border-radius: 20px;
}
.modal-title {
  font-size: 20px;
  text-align: center;
  color: var(--text-main);
  margin-bottom: 12px;
}
.modal-tip {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.6;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--card-border);
  margin-bottom: 24px;
}
.flip-card {
  width: 100%;
  height: 170px;
  perspective: 1000px;
  margin-bottom: 28px;
  cursor: pointer;
}
.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s ease;
  transform-style: preserve-3d;
}
.flip-inner.flipped {
  transform: rotateY(180deg);
}
.flip-front, .flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  padding: 20px;
}
.flip-front {
  background: var(--primary);
  color: #fff;
}
.flip-back {
  background: var(--card-bg);
  color: var(--text-main);
  border: 1px solid var(--card-border);
  transform: rotateY(180deg);
}
.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.voice-btn {
  background: var(--warning);
  color: #222;
}
.learn-btn {
  background: var(--success);
  color: #fff;
}
.next-btn {
  background: var(--primary);
  color: #fff;
}
.close-btn {
  background: var(--text-sub);
  color: #fff;
}
.btn:hover {
  transform: translateY(-1px);
  opacity: 0.9;
}
</style>