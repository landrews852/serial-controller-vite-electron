import type { Hotkey } from './types'

export enum Action {
  ArrowLeft = 57419,
  ArrowRight = 57421,
  ArrowUp = 57416,
  ArrowDown = 57424,
  Space = 57,
  GoToJusto = 'GoToJusto'
}

export const DEFAULT_HOTKEYS: Hotkey[] = [
  { key: 'o', action: Action.ArrowLeft },
  { key: 'p', action: Action.ArrowRight },
  { key: 'a', action: Action.ArrowUp },
  { key: 'b', action: Action.ArrowDown },
  { key: 'k', action: Action.Space },
  { key: 'h', action: Action.GoToJusto }
]

export const ACTIONS: { action: number | 'GoToJusto'; display: string }[] = [
  { action: Action.ArrowLeft, display: '←' },
  { action: Action.ArrowRight, display: '→' },
  { action: Action.ArrowUp, display: '↑' },
  { action: Action.ArrowDown, display: '↓' },
  { action: Action.Space, display: 'Completar' },
  { action: Action.GoToJusto, display: 'Ir a Justo/Chrome' }
]

export const BUMPBAR_KEYS = [
  { value: 'o', bumpbarName: '<' },
  { value: 'p', bumpbarName: '>' },
  { value: 'a', bumpbarName: '1' },
  { value: 'c', bumpbarName: '2' },
  { value: 'e', bumpbarName: '3' },
  { value: 'g', bumpbarName: '4' },
  { value: 'b', bumpbarName: '5' },
  { value: 'd', bumpbarName: '6' },
  { value: 'f', bumpbarName: '7' },
  { value: 'h', bumpbarName: '8' },
  { value: 'i', bumpbarName: 'REFRESH DISPLAY' },
  { value: 'k', bumpbarName: 'QUE SELECT' },
  { value: 'm', bumpbarName: 'RECALL LAST' },
  { value: 'j', bumpbarName: 'SPLIT ON/OFF' },
  { value: 'l', bumpbarName: 'QUE ON/OFF' },
  { value: 'n', bumpbarName: 'SUM ON/OFF' }
]
