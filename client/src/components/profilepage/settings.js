import React from "react";
import styles from "./settings.module.css"; // Import modular CSS
import ToggleSwitch from "../common/toggle"
import LanguageSelector from "../common/translator.jsx";
import ScheduleDropdown from "../common/schedulestatus.jsx";
function Settings() {
    return (
        <div className={styles.settingtabs}>
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2> Language</h2>
                    - Select the Language of Your Choice.

                </div>
                <label>

                    <LanguageSelector />
                </label>
            </div>
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>Schedule</h2>
                    - Customize Your Daily General Schedule.
                </div>
                <label>

                    <ScheduleDropdown />
                </label>
            </div>
{/* 
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
 */}
        </div>
    );
}

export default Settings;
