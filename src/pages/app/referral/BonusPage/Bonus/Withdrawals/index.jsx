import React from 'react';
import { Table } from 'antd';
import { getReferralBonusesAction } from 'redux/referrals';
import { BaseDataTable } from 'models/BaseDataTable';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';
import style from './style.module.scss';

const Bonus = ({ getBonuses, model, isLoading }) => {
  const { data, pagination } = model;

  React.useEffect(() => {
    getBonuses(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getBonuses]);

  const handleTableChange = (pagination, filters, sorter, extra) => {
    // Order
    if (extra.triggerBySorting) {
      model = {
        ...model,
        sort: {
          field: sorter.field,
          order: sorter.order,
        },
        pagination: {
          ...model.pagination,
          current: 1,
        },
      };
    } else {
      // Change page size or page number
      model = {
        ...model,
        pagination: {
          ...model.pagination,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      };
    }

    getBonuses(model);
  };

  const columns = [
    {
      title: 'Time of payment',
      dataIndex: 'time',
      key: 'time',
      width: '20%',
      className: 'bg-transparent text-gray-6',
      render: createdAt => {
        return (
          <span className="active-date">{moment(createdAt).format('MMM DD, YYYY HH:mm A')}</span>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: '15%',
      className: 'bg-transparent text-gray-6',
      render: amount => <span>{amount}</span>,
    },
    {
      title: 'BTC Value',
      dataIndex: 'btcValue',
      key: 'btcValue',
      width: '15%',
      className: 'bg-transparent text-gray-6',
      render: btcValue => <span>{btcValue}</span>,
    },
    {
      title: 'USDT Value',
      dataIndex: 'usdtValue',
      key: 'usdtValue',
      width: '15%',
      className: 'bg-transparent text-gray-6',
      render: usdtValue => <span>{usdtValue}</span>,
    },
    {
      title: 'To Address',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
      className: 'bg-transparent text-gray-6',
      render: address => <a className="text-blue">{address}</a>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      className: 'bg-transparent text-gray-6',
      render: status => <span>{status}</span>,
    },
  ];
  return (
    <div className={classNames('card', style.fullWidth)}>
      <div className="card-header">
        <div className="utils__title">
          <strong>Withdrawals</strong>
        </div>
        <div className="utils__description">Your withdrawal detail</div>
      </div>
      <div className="card-body">
        <div className={style.table}>
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={isLoading}
            onChange={handleTableChange}
            rowKey="_id"
            size="small"
            scroll={{ x: true }}
          />
        </div>
      </div>
    </div>
  );
};

function getModel(state: any) {
  let { referrals } = state.referrals;

  if (!referrals) {
    referrals = new BaseDataTable();
    referrals.sort.field = 'createdAt';
    referrals.sort.order = 'descend';
    referrals.pagination.pageSize = 10;
  }

  return referrals;
}

const mapStateToProps = (state: any) => ({
  model: getModel(state),
  isLoading: state.referrals.referrals?.isLoading || false,
});

const mapDispatchToProps = (dispatch: any) => ({
  getBonuses: model => {
    dispatch(getReferralBonusesAction(model));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Bonus);
