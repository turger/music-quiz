import { useEffect, useState } from 'react'
import ShortUniqueId from 'short-unique-id'
import { getSongs, writeSongs } from '../service/firebaseDB'
import { Song, FirebaseUser, Game } from '../types'
import './GameEditor.css'

const GameEditor = ({ user, game }: { user: FirebaseUser; game: Game }) => {
  const [songs, setSongs] = useState<Song[]>([])
  const [saved, setSaved] = useState(false)

  const getUid = new ShortUniqueId({ length: 5 })

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const songs = await getSongs(game.id, user.uid)
        if (songs && songs.length > 0) {
          setSongs(songs)
        } else {
          const emptySong = {
            id: getUid(),
            artist: '',
            name: '',
            created: Date.now(),
          }
          setSongs([emptySong])
        }
      }
      fetchData()
    }
  }, [game, user])

  const addSong = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const emptySong = {
      id: getUid(),
      artist: '',
      name: '',
      created: Date.now(),
    }
    setSongs([...[emptySong], ...songs])
  }

  const removeSong = (e: React.SyntheticEvent, songId: string) => {
    e.preventDefault()
    setSongs(songs.filter((song) => song.id !== songId))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, songId: string) => {
    const value = e.target.value as string
    const type = e.target.name
    const updatedSong = songs.find((s) => s.id === songId) as Song
    if (updatedSong) {
      if (type === 'artist') updatedSong.artist = value
      if (type === 'name') updatedSong.name = value
    }

    setSongs([...songs.filter((s) => s.id !== songId), ...[updatedSong]])
  }

  const onSave = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (game && user) {
      writeSongs(game.id, user.uid, songs)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
      }, 5000)
    }
  }

  return (
    <div className='game-editor' key={game.id}>
      <form className='game-form'>
        {songs &&
          songs
            .sort((a: Song, b: Song) => a.created - b.created)
            .map((song, i) => (
              <div className='game-form-row' key={song.id}>
                <div className='game-form-row-content'>
                  <label>
                    {i + 1}. Artist:
                    <input
                      type='text'
                      name='artist'
                      value={song.artist}
                      onChange={(e) => handleChange(e, song.id)}
                    />
                  </label>
                  <label>
                    {i + 1}. Song name:
                    <input
                      type='text'
                      name='name'
                      value={song.name}
                      onChange={(e) => handleChange(e, song.id)}
                    />
                  </label>
                </div>
                <button className='small-button plus' onClick={(e) => removeSong(e, song.id)}>
                  –
                </button>
              </div>
            ))}
        <div className='game-form-actions'>
          <button className='small-button plus' onClick={(e) => addSong(e)}>
            +
          </button>

          <button className='small-button' onClick={(e) => onSave(e)}>
            Save
          </button>
          {saved && 'Tallennettu'}
        </div>
      </form>
    </div>
  )
}

export default GameEditor
