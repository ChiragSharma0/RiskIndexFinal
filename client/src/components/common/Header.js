import React, { useState } from "react";
import styles from "../../styles/header.module.css"; // ✅ Import CSS Module
import { usePageContext } from "../../context/pagecontext";

function Header() { // ✅ Accept setShowPage as a prop
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar

  return (
    <header className={styles.header}>
      <div>
        <h2>UTCI HSRIF</h2>
        <p className={styles.para1}>UTCI based Heat Stress Risk Index Forecast</p>
      </div>

      {/* ✅ Menu button */}
      <div className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
        MENU
      </div>

      {/* ✅ Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.close}`}>
        <button className={styles.closeButton} onClick={() => setSidebarOpen(false)}>✖</button>
        <ul>
          <li onClick={() => {  setSidebarOpen(false); }}>Home</li>
          <li onClick={() => { setSidebarOpen(false); }}>Profile</li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
