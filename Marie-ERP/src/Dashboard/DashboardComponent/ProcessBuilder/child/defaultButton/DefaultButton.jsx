import React from 'react'
import styles from "./DefaultButton.module.css";

export default function DefaultButton({value}) {

  return <button className={styles.defaultButton}>{value}</button>;
}
