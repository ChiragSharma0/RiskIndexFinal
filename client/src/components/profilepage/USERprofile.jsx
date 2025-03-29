import React ,{useState,useEffect}from "react";
import styles from "../../pages/profile/profile.module.css";
import { useAuthContext } from "../../context/Authcontext";
import { Avatar, Note, UserName } from "../common/avatar";
import { useTranslation } from "react-i18next";
import axios from "axios";
const url = process.env.REACT_APP_UPDATE_USER;

export default function Userprofile (){
 const { t } = useTranslation();
  const { User = {}, setUser } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});



  
  useEffect(() => {
    if (!User?.UserName) return;
    setFormData(User);
  }, [User]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveChanges = async () => {
    const userid =localStorage.getItem("userid");
    setUser(formData);
    setIsEditing(false);
console.log("initiated user change ");

    try {
      console.log("sending user req");
      const response = await axios.post(`${url}`, {userid,
        userdata: formData
      });
      if (response.status === 200) {
        console.log("✅ User data updated successfully");
      }
    } catch (error) {
      console.error("❌ Failed to update User data", error);
    }
  };
    return(
        <div className={styles.profile}>
        <div className={styles.profileBox}>
          <div className={styles.button}>
            <button
              className={styles.editButton}
              onClick={() => setIsEditing(true)}
            >
              ✎
            </button>
          </div>
        </div>

        <div className={styles.UserBox}>
          <div className={styles.avatar}>
            <Avatar link={User?.profilepic} />
          </div>
          <div className={styles.name}>
            <UserName name={User?.UserName} />
          </div>
          <div className={styles.UserNote}>
            <Note note={User?.NOTE} />
          </div>
        </div>



        {isEditing && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>{t("edit_profile")}</h2>

            <label>
              {t("profile_picture_placeholder")}
              <input
                type="text"
                name="profilepic"
                value={formData.profilepic || ""}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label>
              {t("username")}
              <input
                type="text"
                name="UserName"
                value={formData.UserName || ""}
                onChange={handleChange}
                className={styles.input}
              />
            </label>

            <label>
              {t("note")}
              <textarea
                name="NOTE"
                value={formData.NOTE || ""}
                onChange={handleChange}
                className={styles.textarea}
              />
            </label>

            <div className={styles.buttonGroup}>
              <button onClick={saveChanges} className={styles.saveButton}>
                💾 {t("save_profile")}
              </button>
              <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
                ❌ {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      
    )
}