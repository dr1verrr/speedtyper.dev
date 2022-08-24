import { assets } from '@/assets'

import styles from './404.module.css'

export default function NotFound() {
  return (
    <video
      className={styles.video}
      src={assets[404]}
      muted
      loop
      autoPlay
    ></video>
  )
}
