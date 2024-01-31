import React from 'react'
import styles from "./SlectedItems.module.css";

export default function SelectedItems({categories, type}) {
  return (
    <div className={styles.select}>{type}<span>{categories}</span></div>
  )
}
