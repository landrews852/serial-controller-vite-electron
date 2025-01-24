// export type HotkeysConfig = { key: string; action: number | 'GoToJusto' }[]
export type HotkeysConfig = { key: string; action: number }[]

export enum Key {
  // GoToJusto = 'GoToJusto',
  ArrowLeft = 57419,
  ArrowRight = 57421,
  ArrowUp = 57416,
  ArrowDown = 57424,
  Space = 57
}
