import { useEffect, useState } from 'react'
import ShortUniqueId from 'short-unique-id'
import { getSongs, getFields, writeSongs } from '../service/firebaseDB'
import { Song, FirebaseUser, Game, Field, SongField } from '../types'
import './GameEditor.css'

const getUid = new ShortUniqueId({ length: 5 })

const defaultFields: Field[] = [
  { id: getUid(), created: Date.now(), name: 'Artist' },
  { id: getUid(), created: Date.now() + 1, name: 'Song name' }
]

const GameEditor = ({ user, game }: { user: FirebaseUser; game: Game }) => {
  const [songs, setSongs] = useState<Song[]>([])
  const [saved, setSaved] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [modifyFieldOpen, setModifyFieldsOpen] = useState(false)

  const emptyField = {
    id: getUid(),
    created: Date.now(),
    name: ''
  }

  const emptySong = {
    id: getUid(),
    created: Date.now(),
    fields: []
  }

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const songs = await getSongs(game.id)
        if (songs && songs.length > 0) {
          setSongs(songs)
        } else {
          setSongs([emptySong])
        }

        const fields = await getFields(game.id)
        if (fields && fields.length > 0) {
          setFields(fields)
        } else {
          setFields(defaultFields)
        }
      }
      fetchData()
    }
  }, [game, user])

  const addSong = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSongs([emptySong, ...songs])
  }

  const removeSong = (e: React.SyntheticEvent, songId: string) => {
    e.preventDefault()
    setSongs(songs.filter((song) => song.id !== songId))
  }

  const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>, songId: string, fieldId: string) => {
    const value = e.target.value as string
    const updatedSong = songs.find((s) => s.id === songId) as Song
    if (updatedSong) {
      const updatedSongField = updatedSong.fields?.find(sf => sf.fieldId === fieldId) as SongField
      if (updatedSongField) {
        updatedSongField.value = value
        updatedSong.fields = [...updatedSong.fields.filter((sf) => sf.fieldId !== fieldId), updatedSongField]
      } else {
        updatedSong.fields = [...updatedSong.fields, { fieldId, value }]
      }
    }

    setSongs([...songs.filter((s) => s.id !== songId), ...[updatedSong]])
  }

  const addField = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setFields([emptyField, ...fields])
  }

  const removeField = (e: React.SyntheticEvent, fieldId: string) => {
    e.preventDefault()
    setFields(fields.filter((field) => field.id !== fieldId))
  }

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: string) => {
    const value = e.target.value as string
    const id = e.target.name

    if (!id) return null

    const updatedField = fields.find((f) => f.id === fieldId) as Field

    if (updatedField) {
      updatedField.name = value
    }

    setFields([...fields.filter((f) => f.id !== fieldId), ...[updatedField]])
  }

  const onSave = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (game && user) {
      writeSongs(game.id, songs, fields)
      setSaved(true)
      setTimeout(() => {
        setSaved(false)
      }, 5000)
    }
  }

  return (
    <div className='game-editor' key={game.id}>
      <button className='large-button' onClick={() => setModifyFieldsOpen(!modifyFieldOpen)}>Click to customize your own fields here</button>
      <form className='game-form'>
        <div className='game-form-modify' hidden={!modifyFieldOpen}>
          <p>Modify custom fields</p>
          {fields.sort((a: Field, b: Field) => a.created - b.created)
            .map((field, i) => (
              <div className='game-form-row'>
                <div className='game-form-row-content'>
                  <label>
                    <input
                      type='text'
                      name={field.id}
                      value={field.name}
                      onChange={(e) => handleFieldChange(e, field.id)}
                    />
                  </label>
                </div>
                <button className='small-button plus' onClick={(e) => removeField(e, field.id)}>
                  –
                </button>
              </div>
            ))}
          <div className='game-form-actions'>
            <button className='small-button plus' onClick={(e) => addField(e)}>
              +
            </button>
          </div>
        </div>
        {songs &&
          songs
            .sort((a: Song, b: Song) => a.created - b.created)
            .map((song, i) => (
              <div className='game-form-row' key={song.id}>
                <div className='game-form-row-content'>
                  <p>Song {i + 1}.</p>
                  {fields.map(field => {
                    console.log('field.id', field.id)
                    console.log('song.fields', song.fields)
                    const value = song.fields ? song.fields.find(sf => sf.fieldId === field.id)?.value : ''
                    console.log('****value', value)
                    return (
                      <label>
                        {i + 1}. {field.name}
                        <input
                          type='text'
                          name={field.id}
                          value={value}
                          onChange={(e) => handleSongChange(e, song.id, field.id)}
                        />
                      </label>
                    )
                  })}
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
    </div >
  )
}

export default GameEditor
