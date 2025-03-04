import React from "react";
import styles from "./avatar.module.css"; // Import modular CSS

function Avatar({ link }) {
    return <img className={styles.userImage} src={link} alt="User Avatar" />;
}

function UserName({ name }) {
    return <h1 className={styles.username}>{name}</h1>;
}

function Note({ note }) {
    return <span className={styles.userNote}>{note}</span>;
}

export { Avatar, UserName, Note };
