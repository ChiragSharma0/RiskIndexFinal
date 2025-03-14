import React, { useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link
import styles from "../../styles/header.module.css";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div>
        <h2>UTCI HSRIF</h2>
        <p className={styles.para1}>UTCI based Heat Stress Risk Index Forecast</p>
      </div>

      {/* ✅ Menu Toggle */}
      <div className={styles.menuButton} onClick={() => setSidebarOpen(true)}>
        MENU
      </div>

      {/* ✅ Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.close}`}>
        <button className={styles.closeButton} onClick={() => setSidebarOpen(false)}>✖</button>
        <ul>
          {/* ✅ Each Link navigates and also closes sidebar */}
          <li>
            <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => setSidebarOpen(false)}>Profile</Link>
          </li>
          
        </ul>
      </div>
    </header>
  );
}

export default Header;
