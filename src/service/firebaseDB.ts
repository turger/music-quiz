import { ref, onValue, child, get, set, serverTimestamp } from 'firebase/database'
import { Song, Game } from '../types'

import { getFirebaseDB } from './firebaseInit'

const db = getFirebaseDB()
const dbRef = ref(getFirebaseDB())

export const writeGameData = (gameId: string, userUid: string) => {
  set(ref(db, `${userUid}/games/${gameId}`), {
    id: gameId,
    userUid,
    name: 'asfdadsfdfadfa',
    created: serverTimestamp()
  })
}

export const getUserGames = (userUid: string): Promise<Game[]> => {
  return new Promise(function (resolve, reject) {
    get(child(dbRef, `${userUid}/games`)).then((snapshot: any) => {
      if (snapshot.exists()) {
        const response = snapshot.val()
        const userGames = Object.keys(response).map(key => response[key]) as Game[]
        return resolve(userGames)
      } else {
        console.error('No user games available')
      }
    }).catch((error: any) => {
      console.error(error)
      return reject()
    })
  })
}

export const writeSongs = (gameId: string, userUid: string, songs: Song[]) => {
  set(ref(db, `${userUid}/games/${gameId}/songs`), songs)
}

export const getSongs = (gameId: string, userUid: string): Promise<Song[]> => {
  return new Promise(function (resolve, reject) {
    get(child(dbRef, `${userUid}/games/${gameId}/songs`)).then((snapshot: any) => {
      if (snapshot.exists()) {
        const response = snapshot.val()
        const songs = Object.keys(response).map(key => response[key]) as Song[]
        return resolve(songs)
      } else {
        return resolve([])
      }
    }).catch((error: Error) => {
      console.error(error)
      return reject()
    })
  })
}