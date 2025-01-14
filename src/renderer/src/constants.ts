import type { Hotkey } from './types'

export enum Action {
  ArrowLeft = 57419,
  ArrowRight = 57421,
  ArrowUp = 57416,
  ArrowDown = 57424,
  Space = 57
}

export const DEFAULT_HOTKEYS: Hotkey[] = [
  { key: 'o', action: Action.ArrowLeft },
  { key: 'p', action: Action.ArrowRight },
  { key: 'a', action: Action.ArrowUp },
  { key: 'b', action: Action.ArrowDown },
  { key: 'k', action: Action.Space }
]

export const ACTIONS: { action: number; display: string }[] = [
  { action: 57419, display: '←' }, // ArrowLeft
  { action: 57421, display: '→' }, // ArrowRight
  { action: 57416, display: '↑' }, // ArrowUp
  { action: 57424, display: '↓' }, // ArrowDown
  { action: 57, display: 'Completar' } // Space
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
