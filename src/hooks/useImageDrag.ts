import { onMounted, onUnmounted, ref } from 'vue'

export interface DragState {
  active: boolean
  startX: number
  startY: number
  translateX: number
  translateY: number
}

export function useImageDrag() {
  const dragState = ref<DragState>({
    active: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0,
  })

  // 开始拖拽
  function startDrag(clientX: number, clientY: number) {
    dragState.value.active = true
    dragState.value.startX = clientX
    dragState.value.startY = clientY
  }

  // 拖拽移动
  function onDragMove(clientX: number, clientY: number) {
    if (!dragState.value.active)
      return
    const deltaX = clientX - dragState.value.startX
    const deltaY = clientY - dragState.value.startY
    dragState.value.translateX += deltaX
    dragState.value.translateY += deltaY
    dragState.value.startX = clientX
    dragState.value.startY = clientY
  }

  // 结束拖拽
  function endDrag() {
    dragState.value.active = false
  }

  // 重置位置
  function resetPosition() {
    dragState.value.translateX = 0
    dragState.value.translateY = 0
  }

  return {
    dragState,
    startDrag,
    onDragMove,
    endDrag,
    resetPosition,
  }
}

export interface TouchDragState {
  active: boolean
  startDistance: number
  startScale: number
  centerX: number
  centerY: number
  isDragging: boolean
  startX: number
  startY: number
  startTranslateX: number
  startTranslateY: number
}

export function useTouchDrag(dragState: ReturnType<typeof useImageDrag>['dragState']) {
  const touchState = ref<TouchDragState>({
    active: false,
    startDistance: 0,
    startScale: 1,
    centerX: 0,
    centerY: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    startTranslateX: 0,
    startTranslateY: 0,
  })

  // 触摸开始
  function onTouchStart(e: TouchEvent, scale: number) {
    if (e.touches.length === 1) {
      // 单指拖拽 - 允许在任何缩放比例下拖动
      touchState.value.isDragging = true
      touchState.value.startX = e.touches[0].clientX
      touchState.value.startY = e.touches[0].clientY
      touchState.value.startTranslateX = dragState.value.translateX
      touchState.value.startTranslateY = dragState.value.translateY
    }
    else if (e.touches.length === 2) {
      // 双指缩放
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY,
      )
      const centerX = (touch1.clientX + touch2.clientX) / 2
      const centerY = (touch1.clientY + touch2.clientY) / 2

      touchState.value.active = true
      touchState.value.startDistance = distance
      touchState.value.startScale = scale
      touchState.value.centerX = centerX
      touchState.value.centerY = centerY
      touchState.value.isDragging = false
    }
  }

  // 触摸移动
  function onTouchMove(
    e: TouchEvent,
    scale: { value: number },
    minScale: number,
    maxScale: number,
  ) {
    if (e.touches.length === 1 && touchState.value.isDragging) {
      // 单指拖拽
      e.preventDefault()
      const deltaX = e.touches[0].clientX - touchState.value.startX
      const deltaY = e.touches[0].clientY - touchState.value.startY
      dragState.value.translateX = touchState.value.startTranslateX + deltaX
      dragState.value.translateY = touchState.value.startTranslateY + deltaY
    }
    else if (e.touches.length === 2 && touchState.value.active) {
      // 双指缩放
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
  function onTouchEnd() {
    touchState.value.active = false
    touchState.value.isDragging = false
  }

  return {
    touchState,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
