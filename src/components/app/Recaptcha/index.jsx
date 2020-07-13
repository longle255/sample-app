import React from 'react';
import GRecaptcha from 'react-recaptcha';
import { RecaptchaConfig } from '../../../config';
import style from './style.module.scss';

export default function Recaptcha(props) {
  const { onChange, forwardRef } = props;

  const verifyCallback = result => {
    onChange(result); // notify the form after verified
  };

  const [width, setWidth] = React.useState(null);
  const div = React.useCallback(node => {
    if (node !== null) {
      setWidth(node.getBoundingClientRect().width);
    }
  }, []);

  let displaySize = 'normal';
  let size = 'normal';
  if (width < 170) {
    size = 'compact';
  } else if (width < 300) {
    displaySize = 'medium';
  }
  return (
    <div ref={div} className={style[`recaptcha__${displaySize || 'default'}`]}>
      {width !== null ? (
        <GRecaptcha
          render="explicit"
          ref={forwardRef}
          onloadCallback={() => {}}
          verifyCallback={verifyCallback}
          sitekey={RecaptchaConfig.key}
          size={size}
          {...props}
        />
      ) : (
        <div />
      )}
    </div>
  );
}
