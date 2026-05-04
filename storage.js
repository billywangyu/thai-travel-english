// 本地持久化封装
export function setStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function getStorage(key) {
  const res = localStorage.getItem(key)
  return res ? JSON.parse(res) : null
}

// 清空指定缓存
export function clearStorage(key) {
  localStorage.removeItem(key)
}
