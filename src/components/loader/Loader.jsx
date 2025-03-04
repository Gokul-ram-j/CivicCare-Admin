import React from "react";
import styles from "./loader.module.css";
import { HashLoader } from "react-spinners";
function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <HashLoader color="#3367f7" size={200} />
      <h2>Loading.. Please wait a moment</h2>
    </div>
  );
}

export default Loader;
