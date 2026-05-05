<!-- 顶部：进度 + 暗黑按钮 -->
    学习进度已完成 {{ doneWords }}待完成 {{ leftWords }}总计 {{ totalWords }}<button class="theme-btn" @">
        {{ isDark ? '☀️ 浅色模式' : '🌙 暗黑模式' }}
     <!-- 分类卡片网格 完全复刻参考站双列 -->
<div 
        class="item-card frosted" 
        v-for="(item, idx) in list" 
        :key="idx"
        @{{ item.name }}{{ item.desc }}
          已学 {{ masterArr[idx] || 0 }} / {{ item.total }}{{ currentCate?.name }}<!-- 3D翻转核心：正面英文，背面中文 -->
        <div class="flip-card" @
              {{ currentWord?.en }}
            
              {{ currentWord?.cn }}
            <button class="btn voice" @="playVoice">🔊 发音<button class="btn ok" @✅ 已掌握<button class="btn next" @click="nextWord">➡️ 下一句<button class="btn close" @❌ 关闭