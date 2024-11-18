import React, { useState } from 'react'
import QRCode from 'react-qr-code'
import styles from './Info.module.less'

const Info = () => {
  const [gameId, setGameId] = useState('')

  const path = window.location.pathname
  const url = `${window.location.href.split(path)[0]}/${gameId}`

  return (
    <div className={styles.info}>
      <h1>Music quiz</h1>
      <div>
        <label>
          <input
            type='text'
            name='artist'
            value={gameId}
            onChange={(e) => setGameId(e.target.value.toUpperCase())}
          />
        </label>
      </div>
      <h3>{url}</h3>
      <div className={styles.qr}>
        <QRCode
          value={url}
          style={{ width: 'auto', maxWidth: '100%', maxHeight: '100%', height: '100%' }}
          viewBox={'0 0 256 256'}
        />
      </div>
    </div>
  )
}

export default Info
