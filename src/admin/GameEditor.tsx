import { useEffect, useState } from 'react'
import { getSongs } from '../service/firebaseDB'
import { Song, FirebaseUser, UserGame } from '../types'
import './GameEditor.css'

const GameEditor = ({ user, game }: { user: FirebaseUser, game: UserGame }) => {
  const [songs, setSongs] = useState<Song[]>([])

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const songs = await getSongs(game.id, user.uid)
        if (songs && songs.length > 0) {
          setSongs(songs)
        } else {
          const emptySong = {
            artist: '',
            name: ''
          }
          setSongs([...Array(10)].map((_, i) => ({ ...{ id: i + 1 }, ...emptySong })))
        }
      }
      fetchData()
    }
  }, [game])

  const handleChange = (e: any, songId: number) => {
    const value = e.target.value as string
    const type = e.target.name
    const updatedSong = songs.find(s => s.id === songId) as Song
    if (updatedSong) {
      if (type === 'artist') updatedSong.artist = value
      if (type === 'name') updatedSong.name = value
    }

    setSongs([
      ...songs.filter(s => s.id !== songId),
      ...[updatedSong]
    ])
  }

  return (
    <div className='Game-editor'>
      <form className='Game-form'>
        {songs && songs.sort((a: Song, b: Song) => a.id - b.id).map(song =>
          <div className='Game-form-row' key={song.id}>
            <label>
              Artist:
              <input type="text" name="artist" value={song.artist} onChange={(e) => handleChange(e, song.id)} />
            </label>
            <label>
              Name:
              <input type="text" name="name" value={song.name} onChange={(e) => handleChange(e, song.id)} />
            </label>
          </div>
        )}
        <button>+ Lisää biisi -nappula</button>
      </form>
    </div>
  )
}

export default GameEditor