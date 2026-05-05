// 本地存储封装 持久化
export const setLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getLocal = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}