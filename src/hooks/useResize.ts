import { onMounted, onUnmounted } from 'vue'

/**
 * 窗口大小变化监听 hook（带防抖）
 * @param callback 回调函数
 * @param delay 防抖延迟（毫秒），默认 200ms
 */
export function useResize(callback: () => void, delay = 200) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function onResize() {
    if (timeoutId)
      clearTimeout(timeoutId)
    timeoutId = setTimeout(callback, delay)
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', onResize)
    }
    if (timeoutId)
      clearTimeout(timeoutId)
  })
}
