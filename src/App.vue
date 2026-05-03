<template>
<div class="wrap">
  <div class="header-row">
    <div class="progress-card frosted">
      <div class="title">学习进度</div>
      <div class="bar-wrap">
        <div class="bar" :style="{width:totalPercent+'%'}"></div>
      </div>
      <div class="stat">{{doneWords}} 已学 / {{leftWords}} 剩余 / {{totalWords}} 总计</div>
    </div>
    <button class="theme-btn frosted" @click="toggleDark">
      {{isDark?'☀️ 浅色':'🌙 暗黑'}}
    </button>
  </div>

  <div class="card-grid">
    <div class="cate-card frosted" v-for="(item,idx) in list" :key="idx" @click="open(idx)">
      <h3 class="cate-title">{{item.name}}</h3>
      <p class="cate-desc">{{item.desc}}</p>
      <div class="cate-content" v-html="item.content"></div>
      <div class="cate-foot">已学 {{masterArr[idx]||0}} / {{item.total}}</div>
    </div>
  </div>

  <!-- 3D翻转动画弹窗 -->
  <div class="mask" v-show="showModal" @click.self="close">
    <div class="modal-box frosted">
      <h3 class="modal-title">{{currentCate?.name}}</h3>
      <div class="intro" v-html="currentCate?.content"></div>

      <!-- 核心3D翻转卡片 -->
      <div class="flip-wrap" @click="flipCard">
        <div class="flip-inner" :class="{flipped:flipped}">
          <div class="flip-front">
            <p>英文句子</p>
            <span>{{currentWord?.en}}</span>
          </div>
          <div class="flip-back">
            <p>中文释义</p>
            <span>{{currentWord?.cn}}</span>
          </div>
        </div>
      </div>

      <div class="btn-group">
        <button class="btn btn1" @click="voice">🔊 发音</button>
        <button class="btn btn2" @click="ok">✅ 已掌握</button>
        <button class="btn btn3" @click="next">➡️ 下一句</button>
        <button class="btn btn4" @click="close">❌ 关闭</button>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import {ref,computed,onMounted,watch} from 'vue'

const isDark = ref(false)
const list = ref([])
const masterArr = ref([])
const showModal = ref(false)
const flipped = ref(false)
let cateIndex = 0, wordIndex = 0
let currentCate = ref(null), currentWord = ref(null)

const totalWords = computed(()=>list.value.reduce((s,i)=>s+i.total,0))
const doneWords = computed(()=>masterArr.value.reduce((s,i)=>s+(i||0),0))
const leftWords = computed(()=>totalWords.value-doneWords.value)
const totalPercent = computed(()=>totalWords.value?Math.round(doneWords.value/totalWords.value*100):0)

const loadData = async ()=>{
  const res = await fetch('/allData.json')
  list.value = await res.json()
}
const loadMaster = ()=>{
  const m = localStorage.getItem('thai-frosted-master')
  if(m) masterArr.value = JSON.parse(m)
  while(masterArr.length < list.value.length) masterArr.push(0)
}
const loadDark = ()=>{
  const s = localStorage.getItem('thai-frosted-dark')
  isDark.value = s==='true' || window.matchMedia('(prefers-color-scheme:dark)').matches
  updateDark()
}
const toggleDark = ()=>{
  isDark.value = !isDark.value
  localStorage.setItem('thai-frosted-dark',isDark.value)
  updateDark()
}
const updateDark = ()=>{
  document.documentElement.classList.toggle('dark',isDark.value)
}

const open = idx=>{
  cateIndex = idx
  wordIndex = masterArr[idx]||0
  currentCate.value = list.value[idx]
  show()
}
const show = ()=>{
  const arr = currentCate.value.list
  if(wordIndex >= arr.length) wordIndex = arr.length-1
  currentWord.value = arr[wordIndex]
  flipped.value = false
  showModal.value = true
}
const flipCard = ()=> flipped.value = !flipped.value
const voice = ()=>{
  const u = new SpeechSynthesisUtterance(currentWord.value.en)
  u.lang='en-US';u.rate=0.85
  speechSynthesis.speak(u)
}
const ok = ()=>{
  masterArr[cateIndex] = wordIndex+1
  localStorage.setItem('thai-frosted-master',JSON.stringify(masterArr.value))
  next()
}
const next = ()=>{wordIndex++;show()}
const close = ()=>showModal.value=false

onMounted(async ()=>{
  await loadData()
  loadMaster()
  loadDark()
})
watch(isDark,updateDark)
</script>

<style scoped>
.wrap{padding:20px;max-width:920px;margin:0 auto}
.header-row{display:flex;gap:16px;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap}
.progress-card{flex:1;min-width:280px;padding:20px}
.title{font-size:16px;color:var(--text-main);margin-bottom:10px}
.bar-wrap{height:8px;background:rgba(0,0,0,0.1);border-radius:4px;overflow:hidden}
.bar{height:100%;background:linear-gradient(90deg,#4285f4,#34a853);transition:0.4s}
.stat{margin-top:10px;font-size:13px;color:var(--text-sub)}

.theme-btn{padding:10px 16px;border:none;color:var(--text-main);cursor:pointer}

.card-grid{display:grid;grid-template-columns:1fr;gap:18px}
@media(min-width:600px){.card-grid{grid-template-columns:1fr 1fr}}

.cate-card{padding:22px;cursor:pointer;transition:transform 0.3s ease}
.cate-card:hover{transform:translateY(-6px)}
.cate-title{font-size:18px;color:var(--text-main);margin-bottom:8px}
.cate-desc{font-size:13px;color:var(--text-sub);margin-bottom:12px}
.cate-content{font-size:14px;color:var(--text-sub);line-height:1.7;margin-bottom:14px}
.cate-foot{font-size:12px;text-align:right;color:var(--text-sub)}

.mask{position:fixed;inset:0;background:rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;padding:20px;z-index:999}
.modal-box{width:100%;max-width:480px;padding:26px}
.modal-title{font-size:18px;color:var(--text-main);margin-bottom:12px;text-align:center}
.intro{font-size:14px;color:var(--text-sub);line-height:1.6;margin-bottom:20px}

/* 3D翻转动画核心 */
.flip-wrap{width:100%;height:180px;perspective:1200px;margin:20px auto;cursor:pointer}
.flip-inner{width:100%;height:100%;position:relative;transition:transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);transform-style:preserve-3d}
.flip-inner.flipped{transform:rotateY(180deg)}
.flip-front,.flip-back{
  position:absolute;width:100%;height:100%;backface-visibility:hidden;
  border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;
  padding:20px;
}
.flip-front{
  background:linear-gradient(135deg,#4285f4,#5294ff);color:#fff
}
.flip-back{
  background:linear-gradient(135deg,#34a853,#40c057);color:#fff;
  transform:rotateY(180deg)
}
.flip-front p,.flip-back p{font-size:14px;opacity:0.8;margin-bottom:8px}
.flip-front span,.flip-back span{font-size:20px;text-align:center}

.btn-group{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:10px}
.btn{border:none;padding:9px 16px;border-radius:10px;cursor:pointer;font-size:14px}
.btn1{background:var(--warning);color:#222}
.btn2{background:var(--success);color:#fff}
.btn3{background:var(--primary);color:#fff}
.btn4{background:rgba(0,0,0,0.15);color:var(--text-main)}
</style>