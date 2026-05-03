  
# 泰语旅行英语学习页
基于 Vite + Vue3 开发的泰国旅行常用语单页应用，支持单词卡片、翻转释义、发音播放、暗黑模式，部署在 GitHub Pages。

## 本地运行
### 安装依赖
```bash
npm install
 
 
本地开发
 
bash  
npm run dev
 
 
打包构建
 
bash  
npm run build
 
 
GitHub Pages 自动部署
 
推送代码到 master 分支，自动触发 GitHub Actions 打包并部署到 Pages。
在线访问地址：
https://billywangyu.github.io/thai-travel-english/
 
 
 
常见错误 & 解决方案（必看）
 
1. vite.config.js 配置报错
 
错误提示：
 does not provide an export named 'defineConfig' 
 
原因：导入路径写错
正确写法：
 
js  
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/thai-travel-english/'
})
 
 
2. 页面一直转圈、空白、只显示进度条
 
原因1：静态资源/JSON 路径 404
错误写法：
 
js  
fetch('/allData.json')
 
 
正确写法（带仓库名）：
 
js  
fetch('/thai-travel-english/allData.json')
 
 
原因2：vite 的 base 没配置成仓库名
必须配置： base: '/thai-travel-english/' 
 
3. GitHub Actions 部署权限报错、403 推不上去
 
解决两步
 
1. 仓库设置开启权限
Settings → Actions → General → Workflow permissions
选择：Read and write permissions
2. 工作流文件添加权限
在 deploy.yml 顶部加：
 
yaml  
permissions:
  contents: write
  pages: write
  id-token: write
 
 
4. workflow 语法错误：Expected format {org}/{repo}
 
原因：少写了  actions/ 
错误： uses: setup-node@v4 
正确： uses: actions/setup-node@v4 
 
5. Pages 提示 Get Pages site failed 找不到站点
 
解决：
仓库 Settings → Pages → Build and deployment
Source 改为：GitHub Actions
 
6. 浏览器控制台跨域/跟踪拦截警告
 
 Tracking Prevention blocked access to storage 
属于浏览器隐私拦截，不影响项目功能，可忽略不用处理。
 
7. 分支名不匹配报错
 
本地是 master，workflow 写了 main
把 workflow 里分支改成：
 
yaml  
on:
  push:
    branches: [ master ]
 
 
日常提交推送命令
 
bash  
git add .
git commit -m "更新说明"
git push origin master
 
 
plaintext  

你直接把上面全部复制，新建 `README.md` 粘进去就行。
需要我再帮你加：项目目录结构、技术栈介绍，我可以直接给你补好一版。