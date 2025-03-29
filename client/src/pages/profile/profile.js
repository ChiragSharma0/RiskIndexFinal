import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ProfileTabs from "../../components/profilepage/profiletabs";
import { Avatar, UserName, Note } from "../../components/common/avatar";

import { useAuthContext } from "../../context/Authcontext";
import { useTranslation } from "react-i18next";
import USERprofile from "../../components/profilepage/USERprofile";


export default function Profile() {
 

 

  return (
    <div className={`dashboard ${styles.dashboard}`}>
      <Header />
      <main className={`main ${styles.main}`}>

        <div className={styles.profiletabs}>
          <ProfileTabs />
        </div>
      </main>
      <Footer />

     
    </div>
  );
}
