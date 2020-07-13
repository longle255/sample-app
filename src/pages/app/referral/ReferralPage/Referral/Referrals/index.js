import React from 'react';
import { Table } from 'antd';
import { COMMON } from 'services/../constants/COMMON';
import { getReferralsAction } from 'redux/referrals';
import { BaseDataTable } from 'models/BaseDataTable';
import { connect } from 'react-redux';
import moment from 'moment';
import style from './style.module.scss';

const Referral = ({ getReferrals, model, isLoading }) => {
  const { data, pagination } = model;

  React.useEffect(() => {
    getReferrals(model);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getReferrals]);

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

    getReferrals(model);
  };

  const columns = [
    {
      dataIndex: 'avatar',
      key: 'avatar',
      width: '10%',
      className: 'bg-transparent text-gray-6 width-50',
      render: picture => {
        return (
          <div>
            <div className="kit__utils__avatar">
              <img src={picture || COMMON.defaultAvatarUrl} alt="User avatar" />
            </div>
          </div>
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'userName',
      key: 'firstName',
      width: '30%',
      className: 'bg-transparent text-gray-6',
      render: (text, record) => {
        return (
          <div>
            <div>{`${record.firstName} ${record.lastName}`}</div>
          </div>
        );
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
      className: 'bg-transparent text-gray-6',
      render: email => {
        return <a className="text-blue">{email}</a>;
      },
    },
    {
      title: 'Registered At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '30%',
      className: 'bg-transparent text-gray-6',
      render: createdAt => {
        return (
          <span className="active-date">{moment(createdAt).format('MMM DD, YYYY HH:mm A')}</span>
        );
      },
    },
  ];
  return (
    <div className="card">
      <div className="card-header">
        <div className="utils__title">
          <strong>Referral members</strong>
        </div>
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
  getReferrals: model => {
    dispatch(getReferralsAction(model));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Referral);
