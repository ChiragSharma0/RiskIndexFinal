import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../../styles/header.module.css";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className={styles.header}>
      <div>
        <h2>{t("header.title")}</h2>
        <p className={styles.para1}>{t("header.subtitle")}</p>
      </div>

      <div className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
        {t("header.menu")}
      </div>

      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.close}`}>
        <button className={styles.closeButton} onClick={() => setSidebarOpen(false)}>✖</button>
        <ul>
          <li>
            <Link to="/" onClick={() => setSidebarOpen(false)}>{t("header.home")}</Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => setSidebarOpen(false)}>{t("header.profile")}</Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
