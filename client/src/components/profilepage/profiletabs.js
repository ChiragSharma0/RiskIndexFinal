import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Settings from "./settings";
import VIFORM from "./VIFORM";
import EIForm from "./EIForm";
import CustomScheduleForm from "./ScheduleForm";
import Userprofile from "./USERprofile";
import styles from "./profiletab.module.css";

function ProfileTabs() {
    const { t } = useTranslation();

    const [currentTab, setCurrentTab] = useState(0);

    const tabs = [
        { label: t("profileTabs.profile"), component: <Userprofile /> },
        { label: t("profileTabs.viForm"), component: <VIFORM /> },
        { label: t("profileTabs.eiForm"), component: <EIForm /> },
        { label: t("profileTabs.schedule"), component: <CustomScheduleForm /> },
    ];

    return (
        <div className={styles.Tabpage}>
            {/* Other Tabs Section */}
            <div className={styles.Tabsbar}>
                <div className={styles.Tabs}>
                    <div className={styles.Tabsgroup}>
                        {tabs.map((tab, index) => (
                            <label className={styles.Tab} key={index}>
                                <input
                                    type="radio"
                                    name="radio"
                                    checked={currentTab === index}
                                    onChange={() => setCurrentTab(index)}
                                />
                                <div className={styles.name}>{tab.label}</div>
                            </label>
                        ))}
                    </div>

                    {/* Settings Label */}
                    <div className={styles.settingsgroup}>
                        <label className={styles.Tab}>
                            <input
                                type="radio"
                                name="radio"
                                checked={currentTab === "settings"}
                                onChange={() => setCurrentTab("settings")}
                            />
                            <div className={styles.name}>{t("profileTabs.settings")}</div>
                        </label>
                    </div>
                </div>
            </div>
            {/* Tab Content */}
            <div className={styles.TabContent}>
                {currentTab === "settings" ? <Settings /> : tabs[currentTab].component}
            </div>
        </div>
    );
}

export default ProfileTabs;
