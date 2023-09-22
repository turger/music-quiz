import type { User } from '@firebase/auth'

export type FirebaseUser = User | undefined | null

export type Song = {
  id: string,
  fields: SongField[]
  created: number
}

export type SongField = {
  fieldId: string,
  value: string
}

export type AnswerField = {
  fieldId: string,
  value: string
}

export type Field = {
  id: string,
  name: string,
  created: number
}

export type Game = {
  id: string,
  created: number,
  name: string,
  userUid: string,
  songs?: Song[]
}
