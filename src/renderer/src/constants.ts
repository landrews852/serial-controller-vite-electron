import type { Hotkey } from './types'

export enum Action {
  ArrowLeft = 57419,
  ArrowRight = 57421,
  ArrowUp = 57416,
  ArrowDown = 57424,
  Space = 57,
  History = 35
}

export const DEFAULT_HOTKEYS: Hotkey[] = [
  { key: 'a', action: Action.ArrowLeft },
  { key: 'b', action: Action.ArrowRight },
  { key: 'c', action: Action.ArrowUp },
  { key: 'd', action: Action.ArrowDown },
  { key: 'o', action: Action.Space },
  { key: 'p', action: Action.History }
]

export const ACTIONS: { action: number; display: string }[] = [
  { action: Action.ArrowLeft, display: '←' },
  { action: Action.ArrowRight, display: '→' },
  { action: Action.ArrowUp, display: '↑' },
  { action: Action.ArrowDown, display: '↓' },
  { action: Action.Space, display: 'Completar' },
  { action: Action.History, display: 'Historial' }
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
