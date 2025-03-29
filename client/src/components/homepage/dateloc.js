import React, { useState, useEffect } from 'react';
import styles from '../../styles/DateLoc.module.css';
import { useTimeContext } from '../../context/timecontext';
import { useTranslation } from 'react-i18next';
import { useLocationContext } from '../../context/locationcontext';

function DateLoc() {
  const { t } = useTranslation();
  const { date, setDate, time, setTime } = useTimeContext();
  const { useLocation, locationSource } = useLocationContext();

  const [istimeEditing, settimeEditing] = useState(false);
  const [tempDate, setTempDate] = useState(date.date);
  const [tempTime, setTempTime] = useState(time.hrs);
  const [modalOpen, setModalOpen] = useState(false); // ✅ Added modal state

  const handleDateChange = (e) => setTempDate(e.target.value);
  const handleTimeChange = (e) => setTempTime(e.target.value);

  const handletimeSave = () => {
    const newDate = String(tempDate).padStart(2, '0');
    const newTime = String(tempTime).padStart(2, '0');

    if (Number(newDate) >= 10 && Number(newDate) <= 16) {
      setDate((prev) => ({ ...prev, date: Number(newDate) }));
    }

    if (Number(newTime) >= 0 && Number(newTime) <= 23) {
      setTime((prev) => ({
        ...prev,
        hrs: newTime,
      }));
    }

    settimeEditing(false);
  };

  // ✅ Runs only when `locationSource` or `useLocation` changes
  useEffect(() => {
    console.log('DateLoc re-rendered:', { locationSource, useLocation });
  }, [locationSource, useLocation]);

  return (
    <div className={styles.infobox}>
      <div className={styles.datetime}>
        <button
          style={{ position: 'absolute' }}
          onClick={() => {
            istimeEditing ? handletimeSave() : settimeEditing(true);
          }}
          className={styles.button}
        >
          {istimeEditing ? t('confirm') : t('edit')}
        </button>
        <p>{t('datetime_label')}</p>
        <div>
          <h3>
            {!istimeEditing ? (
              <>{String(date.date).padStart(2, '0')}</>
            ) : (
              <input
                type="number"
                min="10"
                max="16"
                value={tempDate}
                onChange={handleDateChange}
                className={styles.dateInput}
                style={{ fontSize: 'clamp(10px, 2vw, 30px)' }}
              />
            )}
            /{date.month}/{date.year} |

            {!istimeEditing ? (
              <>{String(time.hrs).padStart(2, '0')}</>
            ) : (
              <input
                type="number"
                min="0"
                max="23"
                value={tempTime}
                onChange={handleTimeChange}
                className={styles.timeInput}
                style={{ fontSize: 'clamp(10px, 2vw, 30px)' }}
              />
            )}
            :{String(time.min).padStart(2, '0')}:{String(time.sec).padStart(2, '0')} UTC
          </h3>
        </div>
      </div>

      <div className={styles.location}>
        <p>{t('location_label')}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className={styles.lonlat}>
            {t('latitude')}: {useLocation?.lat ? Number(useLocation.lat).toFixed(3) : t('unavailable')}
            <br />
            {t('longitude')}: {useLocation?.lng ? Number(useLocation.lng).toFixed(3) : t('unavailable')}
          </h3>
          <h4 id="localityName">{locationSource || t('unknown')}</h4>
          <button className={styles.button} style={{ position: 'absolute' }} onClick={() => setModalOpen(true)}>
            {t('edit')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateLoc;
