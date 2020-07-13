import React from 'react';
import { siteConfig } from 'config.js';
import style from './style.module.scss';

const Footer = () => {
  return (
    <div className={style.footer}>
      <div className={style.footerInner}>
        <a
          href="https://sellpixels.com"
          target="_blank"
          rel="noopener noreferrer"
          className={style.logo}
        >
          {siteConfig.siteName}
          <span />
        </a>
        <br />
        <p className="mb-0">
          {siteConfig.footerText} |{' '}
          <a href="https://www.mediatec.org/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
