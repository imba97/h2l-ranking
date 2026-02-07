<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { CloseIcon, ExternalLinkIcon } from '../icons'

interface Props {
  show: boolean
  src: string
  url?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const containerRef = ref<HTMLElement>()
const scale = ref(1)
const maxScale = 5
const minScale = 0.5

// 触摸状态
const touchState = ref({
  active: false,
  startDistance: 0,
  startScale: 1,
  centerX: 0,
  centerY: 0,
})

// 计算缩放后的样式
const imageStyle = computed(() => ({
  transform: `scale(${scale.value})`,
  transformOrigin: 'center center',
  transition: touchState.value.active ? 'none' : 'transform 0.2s ease-out',
}))

// 关闭弹窗
function close() {
  emit('update:show', false)
  // 重置缩放
  setTimeout(() => {
    scale.value = 1
  }, 200)
}

// 鼠标滚轮缩放（PC 端）
function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.max(minScale, Math.min(maxScale, scale.value + delta))
}

// 触摸开始
function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 2) {
    e.preventDefault()
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY,
    )
    const centerX = (touch1.clientX + touch2.clientX) / 2
    const centerY = (touch1.clientY + touch2.clientY) / 2

    touchState.value = {
      active: true,
      startDistance: distance,
      startScale: scale.value,
      centerX,
      centerY,
    }
  }
}

// 触摸移动
function handleTouchMove(e: TouchEvent) {
  if (e.touches.length === 2 && touchState.value.active) {
    e.preventDefault()
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY,
    )

    const scaleRatio = distance / touchState.value.startDistance
    const newScale = Math.max(
      minScale,
      Math.min(maxScale, touchState.value.startScale * scaleRatio),
    )
    scale.value = newScale
  }
}

// 触摸结束
function handleTouchEnd() {
  touchState.value.active = false
}

// ESC 键关闭
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

// 监听 show 变化，重置缩放
watch(() => props.show, (newVal) => {
  if (!newVal) {
    scale.value = 1
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="h2l-image-viewer">
      <div
        v-if="show"
        ref="containerRef"
        class="h2l-image-viewer"
        @wheel="handleWheel"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @click.self="close"
      >
        <button class="h2l-image-viewer__close" @click="close">
          <CloseIcon />
        </button>
        <a
          v-if="url"
          :href="url"
          target="_blank"
          rel="noopener noreferrer"
          class="h2l-image-viewer__link"
          title="打开链接"
        >
          <ExternalLinkIcon />
        </a>
        <div class="h2l-image-viewer__content">
          <img :src="src" :style="imageStyle" alt="Preview">
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.h2l-image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.h2l-image-viewer__content {
  width: 100%;
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.h2l-image-viewer__content img {
  max-width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.h2l-image-viewer__close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
}

.h2l-image-viewer__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.h2l-image-viewer__link {
  position: absolute;
  top: 20px;
  right: 72px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
}

.h2l-image-viewer__link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 过渡动画 */
.h2l-image-viewer-enter-active,
.h2l-image-viewer-leave-active {
  transition: opacity 0.2s ease;
}

.h2l-image-viewer-enter-active .h2l-image-viewer__content,
.h2l-image-viewer-leave-active .h2l-image-viewer__content {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.h2l-image-viewer-enter-from,
.h2l-image-viewer-leave-to {
  opacity: 0;
}

.h2l-image-viewer-enter-from .h2l-image-viewer__content,
.h2l-image-viewer-leave-to .h2l-image-viewer__content {
  opacity: 0;
  transform: scale(0.9);
}
</style>
