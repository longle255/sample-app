import React from 'react'
import Sparkline from '@rowno/sparkline'
import style from './style.module.scss'

class Chart11 extends React.Component {
  render() {
    const options = {
      width: 120,
      height: 110,
      lines: [
        {
          values: [2, 11, 8, 14, 18, 20, 26],
          colors: {
            area: 'rgba(199, 228, 255, 0.5)',
            line: '#004585',
          },
        },
      ],
    }

    return (
      <div className="card-body overflow-hidden position-relative">
        <div className="font-size-36 font-weight-bold text-dark mb-n2">1240</div>
        <div className="text-uppercase">Transactions</div>
        <div className={style.chartContainer}>
          <div className={style.chart}>
            <Sparkline {...options} />
          </div>
        </div>
      </div>
    )
  }
}

export default Chart11
