import React from 'react';
import GRecaptcha from 'react-recaptcha';
import { RecaptchaConfig } from '../../../config';

export default function Recaptcha(props) {
  const { onChange, forwardRef } = props;

  const verifyCallback = result => {
    onChange(result); // notify the form after verified
  };

  return (
    <GRecaptcha
      render="explicit"
      ref={forwardRef}
      onloadCallback={() => {}}
      verifyCallback={verifyCallback}
      sitekey={RecaptchaConfig.key}
      size="normal"
      {...props}
    />
  );
}
