import type { User } from '@firebase/auth'

export type FirebaseUser = User | undefined | null

export type UserGame = {
  id: string,
  created: number,
  name: string,
  userUid: string
}

export type Song = {
  id: number,
  artist: string,
  name: string
}