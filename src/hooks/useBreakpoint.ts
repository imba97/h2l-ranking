import { onMounted, onUnmounted, ref } from 'vue'

/**
 * 检测 User Agent 是否为移动设备
 */
function isMobileUserAgent(): boolean {
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
    const isSmallScreen = window.innerWidth < 768
    const hasTouch = 'ontouchstart' in window
    const isMobileUA = isMobileUserAgent()
    isMobile.value = isSmallScreen || hasTouch || isMobileUA
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  return { isMobile }
}
