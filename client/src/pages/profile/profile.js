import React, { useState, useEffect } from "react";
import styles from "./profile.module.css"; // Import the modular CSS

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ProfileTabs from "../../components/profilepage/profiletabs";
import { Avatar, UserName, Note } from "../../components/common/avatar";
import axios from "axios"; // Import axios for API calls
import { useAuthContext } from "../../context/Authcontext";
const url = process.env.REACT_APP_UPDATE_USER;

export default function Profile() {
  const { userdata = {}, setUserdata } = useAuthContext(); // Ensure userdata is never undefined
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!userdata?.UserName) return;
    console.log("🔹 Profile Rendered:", userdata);
    setFormData(userdata);
  }, [userdata]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    setUserdata(formData);
    setIsEditing(false);

    try {
      const response = await axios.post(`${url}`, formData);
      if (response.status === 200) {
        console.log("✅ User data updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update user data", error);
    }
  };

  if (!userdata) return <p>Loading...</p>; // Prevent error

  return (
    <div className={`dashboard ${styles.dashboard}`}>
      <Header />
      <main className={`main ${styles.main}`}>
        <div className={styles.profile}>
          <div className={styles.profileBox}>
            <div className={styles.button}>
              {isEditing ? (
                <button className={styles.saveButton} onClick={saveChanges}>💾 Save</button>
              ) : (
                <button className={styles.editButton} onClick={() => setIsEditing(true)}>✎ Edit</button>
              )}
            </div>
          </div>

          <div className={styles.userBox}>
            <div className={styles.avatar}>
              {isEditing ? (
                <input
                  type="text"
                  name="profilepic"
                  value={formData.profilepic || ""}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Profile Picture URL"
                />
              ) : (
                <Avatar link={userdata?.profilepic} />
              )}
            </div>

            <div className={styles.name}>
              {isEditing ? (
                <input
                  type="text"
                  name="UserName"
                  value={formData.UserName || ""}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <UserName name={userdata?.UserName} />
              )}
            </div>

            <div className={styles.userNote}>
              {isEditing ? (
                <textarea
                  name="NOTE"
                  value={formData.NOTE || ""}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <Note note={userdata?.NOTE} />
              )}
            </div>
          </div>
        </div>

        <div className={styles.profiletabs}>
          <ProfileTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
}
