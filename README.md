# h2l-ranking

一个简单易用的 Vue 3 从夯到拉排行组件

![](https://github.com/imba97/h2l-ranking/blob/main/.github/screenshot/component.png?raw=true)

## 特性

- 🖱️ 鼠标滚轮横向滚动
- 📱 响应式设计，自适应窗口大小
- 🎨 可自定义样式
- 💡 悬停显示 tooltip（PC 端，支持标题和描述）
- 🖼️ 内置图片预览器
  - 点击图片放大预览
  - PC 端滚轮缩放，移动端双指缩放
  - 缩放后支持拖拽移动
  - 显示标题和描述信息
  - 支持外部链接跳转
- ⌨️ ESC 键关闭预览

## 安装

```bash
pnpm add h2l-ranking
```

## 使用

```vue
<script setup lang="ts">
import H2lRanking from 'h2l-ranking'
import { ref } from 'vue'
import 'h2l-ranking/style.css'

const rankings = ref({
  hang: [
    { title: '《中二病也要谈恋爱》', cover: '/images/1.png', url: 'https://example.com/1', description: '本人入宅作，给到一个夯' },
    { title: '《玉子爱情故事》', cover: '/images/2.png' },
    { title: '《葬送的芙莉莲》', cover: '/images/3.png' },
    { title: '《我心里危险的东西》', cover: '/images/4.png' },
    { title: '《碧蓝之海 第一季》', cover: '/images/5.png' },
    { title: '《双城之战》', cover: '/images/6.png' },
    { title: '《男子高中生的日常》', cover: '/images/7.png' },
    { title: '《樱花庄的宠物女孩》', cover: '/images/8.png' },
    { title: '《NO GAME NO LIFE 游戏人生》', cover: '/images/9.png' },
    { title: '《OVERLORD》', cover: '/images/10.png' },
    { title: '《言叶之庭》', cover: '/images/11.png' },
    { title: '《命运石之门》', cover: '/images/12.png' }
  ],
  upper: [
    { title: '《搞笑漫画日和》', cover: '/images/13.png' },
    { title: '《胆大党》', cover: '/images/14.png' },
    { title: '《荒川爆笑团》', cover: '/images/15.png' },
    { title: '《银魂》', cover: '/images/16.png' },
    { title: '《某科学的超电磁炮》', cover: '/images/17.png' },
    { title: '《魔法禁书目录》', cover: '/images/18.png' },
    { title: '《花牌情缘》', cover: '/images/19.png' },
    { title: '《热带雨林的爆笑生活》', cover: '/images/20.png' },
    { title: '《零之使魔》', cover: '/images/21.png' },
    { title: '《魔法少女小圆》', cover: '/images/22.png' },
    { title: '《齐木楠雄的灾难》', cover: '/images/23.png' },
    { title: '《Re：从零开始的异世界生活》', cover: '/images/24.png' }
  ],
  middle: [],
  lower: [],
  la: []
})
</script>

<template>
  <H2lRanking :rankings="rankings" />
</template>
```

算了，太多了，详情请观看[追番列表](https://space.bilibili.com/2198461/bangumi)

## API

### Props

| 属性 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| rankings | `Rankings` | 是 | 排行数据 |
| enableImageViewer | `boolean` | 否 | `true` | 是否启用图片预览器 |

### Rankings 类型

```ts
interface RankingItem {
  title: string // 标题
  cover: string // 封面图片地址
  url?: string // 跳转链接（可选），预览时右上角显示外部链接按钮
  description?: string // 描述（可选）
}

interface Rankings {
  hang: RankingItem[] // 夯 - 最强
  upper: RankingItem[] // 顶级
  middle: RankingItem[] // 人上人 - 中等
  lower: RankingItem[] // NPC
  la: RankingItem[] // 拉完了 - 最差
}
```
