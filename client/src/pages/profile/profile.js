import React, { useState, useEffect } from "react";
import styles from "./profile.module.css"; // Import the modular CSS

import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import ProfileTabs from "../../components/profilepage/profiletabs";
import { Avatar, UserName, Note } from "../../components/common/avatar";
import { useUserContext } from "../../context/usercontext";
import axios from "axios"; // Import axios for API calls

export default function Profile() {
  const { userdata, setUserdata } = useUserContext(); // Get context values
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [formData, setFormData] = useState({}); // Local state for editing

  useEffect(() => {
    if (!userdata.UserName) return;
    console.log("🔹 Profile Rendered:", userdata);
    setFormData(userdata); // Sync local form data with userdata
  }, [userdata]);

  // Function to handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to save changes
  const saveChanges = async () => {
    setUserdata(formData); // Update UI immediately
    setIsEditing(false); // Exit edit mode

    try {
      const response = await axios.post("http://localhost:5500/api/update/userdata", formData);
      if (response.status === 200) {
        console.log("✅ User data updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update user data", error);
    }
  };

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
                  value={formData.profilepic}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Profile Picture URL"
                />
              ) : (
                <Avatar link={userdata.profilepic} />
              )}
            </div>

            <div className={styles.name}>
              {isEditing ? (
                <input
                  type="text"
                  name="UserName"
                  value={formData.UserName}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <UserName name={userdata.UserName} />
              )}
            </div>

            <div className={styles.userNote}>
              {isEditing ? (
                <textarea
                  name="NOTE"
                  value={formData.NOTE}
                  onChange={handleChange}
                  className={styles.input}
                />
              ) : (
                <Note note={userdata.NOTE} />
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
