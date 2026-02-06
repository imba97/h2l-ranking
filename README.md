# h2l-ranking

从夯到拉排行组件。

一个简单易用的 Vue 3 排行展示组件，支持横向滚动和悬停提示。

## 特性

- 🖱️ 鼠标滚轮横向滚动
- 📱 响应式设计
- 🎨 可自定义样式
- 💡 悬停显示 tooltip（支持描述信息）

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
    { title: '《中二病也要谈恋爱》', url: '/images/1.png', description: '本人入宅作，给到一个夯' },
    { title: '《玉子爱情故事》', url: '/images/2.png' },
    { title: '《葬送的芙莉莲》', url: '/images/3.png' },
    { title: '《我心里危险的东西》', url: '/images/4.png' },
    { title: '《碧蓝之海 第一季》', url: '/images/5.png' },
    { title: '《双城之战》', url: '/images/6.png' },
    { title: '《男子高中生的日常》', url: '/images/7.png' },
    { title: '《樱花庄的宠物女孩》', url: '/images/8.png' },
    { title: '《NO GAME NO LIFE 游戏人生》', url: '/images/9.png' },
    { title: '《OVERLORD》', url: '/images/10.png' },
    { title: '《言叶之庭》', url: '/images/11.png' },
    { title: '《命运石之门》', url: '/images/12.png' }
  ],
  upper: [
    { title: '《搞笑漫画日和》', url: '/images/13.png' },
    { title: '《胆大党》', url: '/images/14.png' },
    { title: '《荒川爆笑团》', url: '/images/15.png' },
    { title: '《银魂》', url: '/images/16.png' },
    { title: '《某科学的超电磁炮》', url: '/images/17.png' },
    { title: '《魔法禁书目录》', url: '/images/18.png' },
    { title: '《花牌情缘》', url: '/images/19.png' },
    { title: '《热带雨林的爆笑生活》', url: '/images/20.png' },
    { title: '《零之使魔》', url: '/images/21.png' },
    { title: '《魔法少女小圆》', url: '/images/22.png' },
    { title: '《齐木楠雄的灾难》', url: '/images/23.png' },
    { title: '《Re：从零开始的异世界生活》', url: '/images/24.png' }
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

### Rankings 类型

```ts
interface RankingItem {
  title: string // 标题
  url: string // 图片地址
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
