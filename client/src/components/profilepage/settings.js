import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./settings.module.css"; // Import modular CSS
import ToggleSwitch from "../common/toggle";
import LanguageSelector from "../common/translator.jsx";
import ScheduleDropdown from "../common/schedulestatus.jsx";

function Settings() {
    const { t } = useTranslation();

    return (
        <div className={styles.settingtabs}>
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>{t("settings.languageTitle")}</h2>
                    - {t("settings.languageDescription")}
                </div>
                <label>
                    <LanguageSelector />
                </label>
            </div>
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>{t("settings.scheduleTitle")}</h2>
                    - {t("settings.scheduleDescription")}
                </div>
                <label>
                    <ScheduleDropdown />
                </label>
            </div>
            {/* 
            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>{t("settings.privacyTitle")}</h2>
                    - {t("settings.privacyDescription")}
                </div>
            </div>

            <div className={styles.settabs}>
                <div className={styles.setBox}>
                    <h2>{t("settings.statusTitle")}</h2>
                    - {t("settings.statusDescription")}
                </div>
            </div>

            <div className={styles.settabs}>
                <div className={styles.setDangerBox}>
                    <h2>{t("settings.dangerTitle")}</h2>
                    - {t("settings.dangerDescription")}
                </div>
            </div>
            */}
        </div>
    );
}

export default Settings;
