import React from 'react';
import classNames from 'classnames';
import style from './style.module.scss';

export default function Overlay(props) {
  const { children } = props;
  return <div className={classNames(style.overlay, style.overlay__blur)}>{children}</div>;
}
