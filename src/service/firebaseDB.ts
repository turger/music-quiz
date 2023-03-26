import { ref, child, get, set, serverTimestamp, DataSnapshot } from 'firebase/database'
import { Song, Game } from '../types'

import { getFirebaseDB } from './firebaseInit'

const db = getFirebaseDB()
const dbRef = ref(getFirebaseDB())

export const writeGameData = (gameId: string, userUid: string) => {
  set(ref(db, `games/${gameId}`), {
    id: gameId,
    userUid,
    name: 'Game name',
    created: serverTimestamp()
  })
}

export const getUserGames = (userUid: string): Promise<Game[]> => {
  return new Promise(function (resolve, reject) {
    get(child(dbRef, 'games')).then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        const response = snapshot.val()
        const allGames = Object.keys(response).map(key => response[key]) as Game[]
        const userGames = allGames.filter(game => game.userUid === userUid)
        return resolve(userGames)
      } else {
        return resolve([])
      }
    }).catch((error: Error) => {
      console.error(error)
      return reject()
    })
  })
}

export const getGameById = (gameId: string): Promise<Game | null> => {
  return new Promise(function (resolve, reject) {
    if (!gameId) return
    get(child(dbRef, `games/${gameId}`)).then((snapshot: DataSnapshot) => {
      if (snapshot.exists()) {
        return resolve(snapshot.val())
      } else {
        return resolve(null)
      }
    }).catch((error: Error) => {
      console.error(error)
      return reject()
    })
  })
}
export const writeSongs = (gameId: string, songs: Song[]) => {
  set(ref(db, `games/${gameId}/songs`), songs)
}

export const getSongs = (gameId: string): Promise<Song[]> => {
  return new Promise(function (resolve, reject) {
    get(child(dbRef, `games/${gameId}/songs`)).then((snapshot: DataSnapshot) => {
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