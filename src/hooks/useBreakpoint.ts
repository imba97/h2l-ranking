import { onMounted, ref } from 'vue'
import { useResize } from './useResize'

/**
 * 检测 User Agent 是否为移动设备
 */
function isMobileUserAgent(): boolean {
  if (typeof window === 'undefined' || !navigator.userAgent)
    return false
  const ua = navigator.userAgent.toLowerCase()
  const mobileKeywords = [
    'android',
    'iphone',
    'ipad',
    'ipod',
    'windows phone',
    'mobi',
    'tablet',
    'webos',
    'blackberry'
  ]
  return mobileKeywords.some(keyword => ua.includes(keyword))
}

/**
 * 检测是否为移动端设备
 * 判断依据：屏幕宽度 < 768px 或 支持触摸 或 移动端 User Agent
 */
export function useBreakpoint() {
  const isMobile = ref(false)

  function checkMobile() {
    if (typeof window === 'undefined')
      return
    const isSmallScreen = window.innerWidth < 768
    const hasTouch = 'ontouchstart' in window
    const isMobileUA = isMobileUserAgent()
    isMobile.value = isSmallScreen || hasTouch || isMobileUA
  }

  // 使用 useResize hook 监听窗口变化，200ms 防抖
  useResize(checkMobile, 200)

  // 组件挂载后检测
  onMounted(() => {
    checkMobile()
  })

  return { isMobile }
}
