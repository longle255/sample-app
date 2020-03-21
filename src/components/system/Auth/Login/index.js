import React from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import style from '../style.module.scss'

@Form.create()
@connect(({ user }) => ({ user }))
class Login extends React.Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/LOGIN',
          payload: values,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { loading },
    } = this.props

    return (
      <div>
        <div className={`card ${style.container}`}>
          <div className="text-dark font-size-24 mb-2">
            <strong>Sign in to your account</strong>
          </div>
          <div className="mb-4">
            <p>Login and password - admin@mediatec.org / mediatec</p>
          </div>
          <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit} className="mb-4">
            <Form.Item>
              {form.getFieldDecorator('email', {
                initialValue: 'admin@mediatec.org',
                rules: [{ required: true, message: 'Please input your e-mail address' }],
              })(<Input size="large" placeholder="Email" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('password', {
                initialValue: 'mediatec',
                rules: [{ required: true, message: 'Please input your password' }],
              })(<Input size="large" type="password" placeholder="Password" />)}
            </Form.Item>
            <Button
              type="primary"
              size="large"
              className="text-center w-100"
              htmlType="submit"
              loading={loading}
            >
              <strong>Sign in</strong>
            </Button>
          </Form>
          <Link to="/auth/forgot-password" className="kit__utils__link font-size-16">
            Forgot Password?
          </Link>
        </div>
        <div className="text-center pt-2 mb-auto">
          <span className="mr-2">Don't have an account?</span>
          <Link to="/auth/register" className="kit__utils__link font-size-16">
            Sign up
          </Link>
        </div>
      </div>
    )
  }
}

export default Login
