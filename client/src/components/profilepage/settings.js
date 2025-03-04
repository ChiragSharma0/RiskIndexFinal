import React from "react";
import styles from "./settings.module.css"; // Import modular CSS
import ToggleSwitch from "../common/toggle"
function Settings() {
    return (
        <div className={styles.settingtabs}>
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2> Notifications</h2>
                    - Allow users to enable/disable notifications for different events.

                </div>
                <ToggleSwitch />
            </div>
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>Appearance</h2>
                    - Let users customize color themes.
                </div>
            </div>

            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>Privacy</h2>
                    - Settings for data privacy preferences and permissions.
                </div>
            </div>

            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>Activity Status</h2>
                    - Show/hide active/online status to other users.
                </div>
            </div>

            <div className={styles.settabs}>
                <div className={styles.setDangerBox}>
                    <h2>Danger zone</h2>
                    - Permanent account actions like deactivate account, wipe data, etc.
                </div>
            </div>

        </div>
    );
}

export default Settings;
