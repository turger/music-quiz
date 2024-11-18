import React, { useEffect, useState } from 'react'
import ShortUniqueId from 'short-unique-id'
import { getSongs, getFields, writeSongs } from '../service/firebaseDB'
import Button from '../components/Button'
import { Song, FirebaseUser, Game, Field, SongField } from '../types'
import styles from './GameEditor.module.less'

const uid = new ShortUniqueId({ length: 5 })

const defaultFields: Field[] = [
  { id: uid.rnd(), created: Date.now(), name: 'Artist' },
  { id: uid.rnd(), created: Date.now() + 1, name: 'Song name' },
]

const GameEditor = ({ user, game }: { user: FirebaseUser; game: Game }) => {
  const [songs, setSongs] = useState<Song[]>([])
  const [saved, setSaved] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [modifyFieldOpen, setModifyFieldsOpen] = useState(false)

  const emptyField = {
    id: uid.rnd(),
    created: Date.now(),
    name: '',
  }

  const emptySong = {
    id: uid.rnd(),
    created: Date.now(),
    fields: [],
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

  const handleSongChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    songId: string,
    fieldId: string,
  ) => {
    const value = e.target.value as string
    const updatedSong = songs.find((s) => s.id === songId) as Song
    if (updatedSong) {
      const updatedSongField = updatedSong.fields?.find((sf) => sf.fieldId === fieldId) as SongField
      if (updatedSongField) {
        updatedSongField.value = value
        updatedSong.fields = [
          ...updatedSong.fields.filter((sf) => sf.fieldId !== fieldId),
          updatedSongField,
        ]
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
    <div className={styles.gameEditor} key={game.id}>
      <Button
        onClick={() => setModifyFieldsOpen(!modifyFieldOpen)}
        text={modifyFieldOpen ? 'Close field editing' : 'Click to customize field names'}
      />
      <form>
        <div className={styles.modify} hidden={!modifyFieldOpen}>
          <p>Modify custom fields</p>
          {fields
            .sort((a: Field, b: Field) => a.created - b.created)
            .map((field, i) => (
              <div className={styles.formRow} key={`form-row-${i}`}>
                <div className={styles.formRowContent}>
                  <label className={styles.contentLabel}>
                    <input
                      className={styles.contentInput}
                      type='text'
                      name={field.id}
                      value={field.name}
                      onChange={(e) => handleFieldChange(e, field.id)}
                    />
                  </label>
                </div>
                <Button type='mini' onClick={(e) => removeField(e, field.id)} text='-' />
              </div>
            ))}
          <div className={styles.formActions}>
            <Button type='mini' onClick={(e) => addField(e)} text='+' />
          </div>
        </div>
        {songs &&
          songs
            .sort((a: Song, b: Song) => a.created - b.created)
            .map((song, i) => (
              <div className={styles.formRow} key={song.id}>
                <div className={styles.formRowContent}>
                  <p>Song {i + 1}.</p>
                  {fields.map((field) => {
                    const value = song.fields
                      ? song.fields.find((sf) => sf.fieldId === field.id)?.value
                      : ''
                    return (
                      <label className={styles.contentLabel} key={`song-${field.id}`}>
                        {i + 1}. {field.name}
                        <input
                          className={styles.contentInput}
                          type='text'
                          name={field.id}
                          value={value}
                          onChange={(e) => handleSongChange(e, song.id, field.id)}
                        />
                      </label>
                    )
                  })}
                </div>
                <div className={styles.formRowRemove}>
                  <Button type='mini' onClick={(e) => removeSong(e, song.id)} text='-' />
                  Remove Song {i + 1}
                </div>
              </div>
            ))}
        <div className={styles.formActions}>
          <Button type='mini' onClick={(e) => addSong(e)} text='+' />
          <Button onClick={(e) => onSave(e)} text='Save' />
          {saved && 'Tallennettu'}
        </div>
      </form>
    </div>
  )
}

export default GameEditor
