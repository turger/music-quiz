import type { User } from '@firebase/auth'

export type FirebaseUser = User | undefined | null

export type Game = {
  id: string,
  created: number,
  name: string,
  userUid: string
}

export type Song = {
  id: string,
  artist: string,
  name: string,
  created: number
}