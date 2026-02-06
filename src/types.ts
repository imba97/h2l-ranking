export interface RankingItem {
  title: string
  url: string
  description?: string
}

export interface Rankings {
  hang: RankingItem[] // 夯 - 最强
  upper: RankingItem[] // 顶级
  middle: RankingItem[] // 人上人 - 中等
  lower: RankingItem[] // NPC
  la: RankingItem[] // 拉完了 - 最差
}
