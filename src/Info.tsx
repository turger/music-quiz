import React from 'react'
import QRCode from 'react-qr-code'
import './Info.css'

type InfoProps = {
  songCount: number
}

const Info = ({ songCount }: InfoProps) => {
  const path = window.location.pathname
  const url = window.location.href.split(path)[0]

  return (
    <div className='Info'>
      <h1>Christmas song music quiz</h1>
      <h3>Theme: famous artist christmas songs</h3>
      <h4>Song count: {songCount}</h4>
      <h3 className='Info-url'>{url}</h3>
      <div className='Info-qr'>
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
