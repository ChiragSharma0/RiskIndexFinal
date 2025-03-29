import React, { useState, useEffect } from "react";


import Settings from "./settings";
import VIFORM from "./VIFORM";
import EIForm from "./EIForm";
import styles from './profiletab.module.css'
import CustomScheduleForm from "./ScheduleForm";
import Userprofile from "./USERprofile";


function ProfileTabs() {


    const [currentTab, setCurrentTab] = useState(0);

    const tabs = [
        { label: "Profile", component: <Userprofile /> },

        { label: "Settings", component: <Settings /> },
        { label: 'VI', component: <VIFORM /> },

        { label: 'EI', component: <EIForm /> },

        { label: 'Schedule', component: <CustomScheduleForm /> },

    ];

    return (

        <div className={styles.Tabpage}>
            <div className={styles.Tabs}>
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

            {/* Tab Content */}
            <div className={styles.TabContent}>{tabs[currentTab].component}</div>

        </div>
    )
}

export default ProfileTabs;