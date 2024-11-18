import React from 'react'
import cx from 'classnames'
import styles from './Button.module.less'

type Props = {
  onClick: React.MouseEventHandler
  text: string
  type?: 'mini'
}

const Button = ({ onClick, text, type }: Props) => {
  return (
    <button className={cx(styles.button, type === 'mini' && styles.mini)} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
