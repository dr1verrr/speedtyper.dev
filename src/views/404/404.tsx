import styles from './404.module.css'
import { assets } from '@/assets'

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
