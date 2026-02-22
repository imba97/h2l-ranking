<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useImageDrag, useTouchDrag } from '../hooks'
import { CloseIcon, ExternalLinkIcon } from '../icons'

interface Props {
  show: boolean
  src: string
  url?: string
  title?: string
  description?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const containerRef = ref<HTMLElement>()
const scale = ref(1)
const maxScale = 5
const minScale = 0.5

// 描述展开状态
const descriptionExpanded = ref(false)
const descriptionOverflowing = ref(false)
const descriptionTextRef = ref<HTMLElement>()

// 拖拽和触摸 hooks
const { dragState, startDrag, onDragMove, endDrag, resetPosition } = useImageDrag()
const { touchState, onTouchStart, onTouchMove, onTouchEnd } = useTouchDrag(dragState)

// 计算缩放和位移后的样式
const imageStyle = computed(() => {
  const isDragging = dragState.value.active || touchState.value.isDragging
  return {
    transform: `translate(${dragState.value.translateX}px, ${dragState.value.translateY}px) scale(${scale.value})`,
    transformOrigin: 'center center',
    transition: isDragging || touchState.value.active ? 'none' : 'transform 0.2s ease-out',
  }
})

// 检查描述是否溢出
async function checkDescriptionOverflow() {
  await nextTick()
  if (descriptionTextRef.value) {
    descriptionOverflowing.value = descriptionTextRef.value.scrollHeight > descriptionTextRef.value.clientHeight
  }
}

// 切换描述展开
function toggleDescription() {
  descriptionExpanded.value = !descriptionExpanded.value
}

// 关闭弹窗
function close() {
  emit('update:show', false)
  // 重置缩放、位移和展开状态
  setTimeout(() => {
    scale.value = 1
    resetPosition()
    descriptionExpanded.value = false
  }, 200)
}

// 鼠标滚轮缩放（PC 端）
function handleWheel(e: WheelEvent) {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.max(minScale, Math.min(maxScale, scale.value + delta))
}

// 鼠标拖拽开始
function handleMouseDown(e: MouseEvent) {
  e.preventDefault()
  startDrag(e.clientX, e.clientY)
}

// 鼠标拖拽移动
function handleMouseMove(e: MouseEvent) {
  onDragMove(e.clientX, e.clientY)
}

// 鼠标拖拽结束
function handleMouseUp() {
  endDrag()
}

// 触摸开始
function handleTouchStart(e: TouchEvent) {
  onTouchStart(e, scale.value)
}

// 触摸移动
function handleTouchMove(e: TouchEvent) {
  onTouchMove(e, scale, minScale, maxScale)
}

// 触摸结束
function handleTouchEnd() {
  onTouchEnd()
}

// ESC 键关闭
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

// 监听 show 变化，重置状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    checkDescriptionOverflow()
  } else {
    scale.value = 1
    resetPosition()
    descriptionExpanded.value = false
  }
})

// 监听描述变化
watch(() => props.description, () => {
  if (props.show) {
    checkDescriptionOverflow()
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
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
          <img :src="src" :style="imageStyle" alt="Preview" @mousedown="handleMouseDown">
        </div>
        <!-- 标题和描述信息 -->
        <div v-if="title || description" class="h2l-image-viewer__info">
          <div class="h2l-image-viewer__info-header">
            <div v-if="title" class="h2l-image-viewer__title">{{ title }}</div>
            <button
              v-if="description && descriptionOverflowing"
              class="h2l-image-viewer__more"
              @click="toggleDescription"
            >
              {{ descriptionExpanded ? '收起' : '更多' }}
            </button>
          </div>
          <div v-if="description" class="h2l-image-viewer__description">
            <div
              ref="descriptionTextRef"
              class="h2l-image-viewer__description-text"
              :class="{ 'h2l-image-viewer__description-text--expanded': descriptionExpanded }"
            >
              {{ description }}
            </div>
          </div>
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
  position: relative;
  z-index: 0;
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
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 1;
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
  backdrop-filter: blur(4px);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.2s;
  text-decoration: none;
  z-index: 1;
}

.h2l-image-viewer__link:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.h2l-image-viewer__info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 16px 20px;
}

.h2l-image-viewer__info-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.h2l-image-viewer__title {
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  min-width: 0;
}

.h2l-image-viewer__description {
  margin-top: 12px;
}

.h2l-image-viewer__description-text {
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  transition: -webkit-line-clamp 0.3s ease;
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
}

.h2l-image-viewer__description-text--expanded {
  -webkit-line-clamp: unset;
  max-height: none;
}

.h2l-image-viewer__more {
  padding: 2px 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.h2l-image-viewer__more:hover {
  color: #fff;
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
