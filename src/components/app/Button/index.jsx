import React from 'react';
import classNames from 'classnames';
import omit from 'lodash-es/omit';
import style from './style.module.scss';

export default function Button(props) {
  const { loading, children } = props;
  return (
    <button
      type="submit"
      className={classNames(style.btn, 'width-150', 'height-40')}
      disabled={loading}
      {...omit(props, ['loading', 'htmlType'])}
    >
      {children}
    </button>
  );
}
