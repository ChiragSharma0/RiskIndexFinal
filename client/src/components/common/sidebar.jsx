import React from 'react';
import styles from'../../styles/sidebar.module.css';

function Sidebar({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className={styles.sidebaroverlay} onClick={onClose}>
            <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>✖</button>
                <h3>Sidebar Menu</h3>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/settings">Settings</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Sidebar;
