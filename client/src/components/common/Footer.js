import React from 'react';
import { useTranslation } from 'react-i18next';

function Footer({message}) {
  const { t } = useTranslation();

  return (
    <footer>
        {message? (message):(<p>&copy; 2024 {t('footer.text')}</p>)}
      
    </footer>
  );
}

export default Footer;
