import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer({ message }) {
  const { t } = useTranslation();

  return (
    <footer className='footer'>
      {message ? (message) : (<p>&copy; 2024 {t('footer.text')}</p>)}
      <h2 style={{ margin: "auto", width: "min-content" }}>
        Disclaimer:
      </h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>


        <p style={{ width: "40%" }}>

          <h3>Prototype Information:</h3>
          This is a prototype website intended for use from 10th June 2024, 17:30 IST to 16th June 2024, 05:30 IST.
        </p>
        <p style={{ width: "40%" }}>

          <h3>Medical Disclaimer:</h3>
          The authors do not provide medical advice or recommendations. If you experience any medical issues or concerns, we strongly recommend that you consult a qualified healthcare professional.

        </p>
      </div>

    </footer>
  );
}

export default Footer;
