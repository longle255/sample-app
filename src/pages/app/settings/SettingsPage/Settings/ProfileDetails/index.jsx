import { Upload, Row, Col, Select, Form, Input, Alert } from 'antd';
import Button from 'components/app/Button';
import React from 'react';
import { connect } from 'react-redux';
import { notificationService, profileService, fileService } from 'services';
import { updateUserProfileSuccessAction } from 'redux/user';
import { COMMON } from 'services/../constants/COMMON';
import style from './style.module.scss';

const { Option } = Select;

const types = ['image/png', 'image/jpeg', 'image/gif'];

const ProfileDetails = ({ userProfile, updateUserProfileSuccess, countries }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [uploadFileErrorMessage, setUploadFileErrorMessage] = React.useState(null);
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [country, setCountry] = React.useState(null);

  const beforeUpload = file => {
    if (types.every(type => file.type !== type)) {
      setUploadFileErrorMessage('You can only upload JPG file!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 <= 0.2;
    if (!isLt2M) {
      setUploadFileErrorMessage('Image must smaller than 200 KB!');
      return false;
    }
    setUploadFileErrorMessage(null);
    return isLt2M;
  };

  const getUploadLink = async () => {
    const params = { type: 'profilePicture' };
    const uploadLinkInfo = await fileService.getUploadLink(params);
    setAvatarUrl(uploadLinkInfo.url);
  };

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setIsProcessing(true);
      return;
    }

    if (info.file.status === 'done') {
      setIsProcessing(false);
      const data = { picture: avatarUrl };
      updateUserProfileSuccess(data);
      notificationService.showSuccessMessage('Your avatar has been updated successful.');
    }
  };

  const onFinish = async values => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    const data = {};
    ['firstName', 'lastName', 'phone', 'city', 'address'].forEach(key => {
      data[key] = values[key] || '';
    });
    data.country = country;
    try {
      const result = await profileService.updateUserProfile(data);
      setIsProcessing(false);
      setErrorMessage(null);
      notificationService.showSuccessMessage('Profile updated successful.');
      updateUserProfileSuccess(result);
    } catch (error) {
      const errorMessage = error.message;
      setIsProcessing(false);
      setErrorMessage(errorMessage);
    }
  };

  const avatar = userProfile.picture || COMMON.defaultAvatarUrl;
  const countryList = countries || [];
  const headers = fileService.getHeadersForUploadFile();

  return (
    <div className="card shadow-sm bg-white">
      <div className="card-header">
        <div className="utils__title">
          <strong>Account Details</strong>
        </div>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <Upload
              name="file"
              listType="picture-card"
              className={style.avatarUploader}
              showUploadList={false}
              action={getUploadLink}
              headers={headers}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              disabled
            >
              <img src={avatar} alt="avatar" />
            </Upload>
            <div className="text-muted">
              * Photo dimension must be less than 300x300, and its size must be less than 200 KB.
            </div>
            {uploadFileErrorMessage && <Alert message={uploadFileErrorMessage} type="error" />}
          </div>
          <div className="col-md-8">
            <Form
              onFinish={onFinish}
              className="update-profile-form"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="Email" name="email" initialValue={userProfile.email} rules={[]}>
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="First name"
                name="firstName"
                initialValue={userProfile.firstName}
                rules={[{ required: true, message: 'Please provide the first name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="lastName"
                initialValue={userProfile.lastName}
                rules={[{ required: true, message: 'Please provide the last name!' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Phone number"
                name="phone"
                initialValue={userProfile.phone}
                rules={[]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                initialValue={userProfile.address}
                rules={[]}
              >
                <Input />
              </Form.Item>
              <Row>
                <Col span={12}>
                  <Form.Item label="Country">
                    <Select
                      showSearch
                      // style={{ width: 100 }}
                      placeholder="Select a country"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={e => setCountry(e)}
                      defaultValue={userProfile.country}
                    >
                      {countryList.map(item => (
                        <Option key={item.name} value={item.name}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                    ,
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="City" name="city" initialValue={userProfile.city} rules={[]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              {errorMessage && (
                <Form.Item label=" " colon={false}>
                  <Alert message={errorMessage} type="error" />
                </Form.Item>
              )}
              <Form.Item>
                <Button loading={isProcessing}>Update</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  countries: state.user.countries,
});

const mapDispatchToProps = (dispatch: any) => ({
  updateUserProfileSuccess: profile => {
    dispatch(updateUserProfileSuccessAction(profile));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetails);
