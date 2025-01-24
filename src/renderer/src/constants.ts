import type { Hotkey } from './types'

export enum Action {
  // GoToJusto = 'GoToJusto',
  ArrowLeft = 57419,
  ArrowRight = 57421,
  ArrowUp = 57416,
  ArrowDown = 57424,
  Space = 57
}

export const DEFAULT_HOTKEYS: Hotkey[] = [
  // { key: 'h', action: Action.GoToJusto },
  { key: 'a', action: Action.ArrowLeft },
  { key: 'b', action: Action.ArrowRight },
  { key: 'c', action: Action.ArrowUp },
  { key: 'd', action: Action.ArrowDown },
  { key: 'o', action: Action.Space }
]

// export const ACTIONS: { action: number | 'GoToJusto'; display: string }[] = [
export const ACTIONS: { action: number; display: string }[] = [
  // { action: Action.GoToJusto, display: 'Ir a Justo/Chrome' },
  { action: Action.ArrowLeft, display: '←' },
  { action: Action.ArrowRight, display: '→' },
  { action: Action.ArrowUp, display: '↑' },
  { action: Action.ArrowDown, display: '↓' },
  { action: Action.Space, display: 'Completar' }
]

export const BUMPBAR_KEYS = [
  { value: 'a', bumpbarName: '1' },
  { value: 'b', bumpbarName: '5' },
  { value: 'c', bumpbarName: '2' },
  { value: 'd', bumpbarName: '6' },
  { value: 'e', bumpbarName: '3' },
  { value: 'f', bumpbarName: '7' },
  { value: 'g', bumpbarName: '4' },
  { value: 'h', bumpbarName: '8' },
  { value: 'i', bumpbarName: 'REFRESH DISPLAY' },
  { value: 'j', bumpbarName: 'SPLIT ON/OFF' },
  { value: 'k', bumpbarName: 'QUE SELECT' },
  { value: 'l', bumpbarName: 'QUE ON/OFF' },
  { value: 'm', bumpbarName: 'RECALL LAST' },
  { value: 'n', bumpbarName: 'SUM ON/OFF' },
  { value: 'o', bumpbarName: '<' },
  { value: 'p', bumpbarName: '>' }
]
