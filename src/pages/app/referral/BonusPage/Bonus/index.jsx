import React from 'react';
import Bonuses from './Bonuses';
import Withdrawals from './Withdrawals';

const Bonus = () => {
  return (
    <div className="bonus-container">
      <div className="row">
        <div className="col-md-10">
          <div className="row">
            <Bonuses />
          </div>
          <div className="row">
            <Withdrawals />
          </div>
        </div>
        <div className="col-md-2" />
      </div>
    </div>
  );
};

export default Bonus;
