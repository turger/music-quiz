import './Info.css'
import PropTypes from 'prop-types'
import QRCode from 'react-qr-code'

function Info({ songCount }) {
  const path = window.location.pathname
  const url = window.location.href.split(path)[0]

  return (
    <div className='Info'>
      <h1>Christmas song music quiz</h1>
      <h3>Theme: famous artist christmas songs</h3>
      <h4>Song count: {songCount}</h4>
      <div className='Info-url'>Go to: {url}</div>
      <div className='Info-qr'>
        <QRCode
          value={url}
          style={{ width: 'auto', maxHeight: '100%', height: '100%' }}
          viewBox={'0 0 256 256'}
        />
      </div>
    </div>
  )
}

Info.propTypes = {
  songCount: PropTypes.number
}

export default Info
