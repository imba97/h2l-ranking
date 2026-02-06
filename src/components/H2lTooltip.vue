<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const triggerRef = ref<HTMLElement>()
const showTooltip = ref(false)
const position = ref({ x: 0, y: 0 })

function handleMouseEnter() {
  if (!triggerRef.value)
    return
  const rect = triggerRef.value.getBoundingClientRect()
  position.value = {
    x: rect.left + rect.width / 2,
    y: rect.bottom + 8
  }
  showTooltip.value = true
}

function handleMouseLeave() {
  showTooltip.value = false
}

onMounted(() => {
  triggerRef.value?.addEventListener('mouseenter', handleMouseEnter)
  triggerRef.value?.addEventListener('mouseleave', handleMouseLeave)
})

onUnmounted(() => {
  triggerRef.value?.removeEventListener('mouseenter', handleMouseEnter)
  triggerRef.value?.removeEventListener('mouseleave', handleMouseLeave)
})
</script>

<template>
  <div ref="triggerRef" class="h2l-tooltip">
    <slot />
    <Teleport to="body">
      <Transition name="h2l-tooltip">
        <div
          v-if="showTooltip"
          class="h2l-tooltip__content"
          :style="{ left: `${position.x}px`, top: `${position.y}px` }"
        >
          <div class="h2l-tooltip__title">
            <slot name="content" />
          </div>
          <div v-if="$slots.description" class="h2l-tooltip__divider" />
          <div v-if="$slots.description" class="h2l-tooltip__description">
            <slot name="description" />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.h2l-tooltip {
  position: relative;
  display: inline-flex;
}

.h2l-tooltip__content {
  position: fixed;
  transform: translate(-50%, 0);
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 6px;
  font-size: 12px;
  color: #fff;
  pointer-events: none;
  z-index: 9999;
  max-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.h2l-tooltip__content::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.85);
}

.h2l-tooltip__divider {
  height: 1px;
  background-color: rgba(255, 255, 255, 0.2);
  margin: 2px 0;
}

.h2l-tooltip__description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  word-wrap: break-word;
  white-space: normal;
}

/* 进入和离开动画 */
.h2l-tooltip-enter-active,
.h2l-tooltip-leave-active {
  transition: all 0.25s ease;
}

.h2l-tooltip-enter-from,
.h2l-tooltip-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
