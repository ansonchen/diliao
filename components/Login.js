import React from 'react'
import { withRouter } from 'react-router'
import auth from '../utils/auth.js'

import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

const Login = Form.create()(React.createClass({
  getInitialState() {
      return {
        error: false
      }
    },
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);

        const email = values.userName;
        const pass = values.password;

        auth.login(email, pass, (loggedIn) => {
          if (!loggedIn)
            return this.setState({ error: true })

          const { location } = this.props

          if (location.state && location.state.nextPathname) {
            this.props.router.replace(location.state.nextPathname)
          } else {
            this.props.router.replace('/')
          }
        })


      }


    });


  },

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className="loginBox">

          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('userName', {
                initialValue:'admin',
                rules: [{ required: true, message: '请输入用户名!' }],
              })(
                <Input addonBefore={<Icon type="user" />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                initialValue:'',
                rules: [{ required: true, message: '请输入密码!' }],
              })(
                <Input addonBefore={<Icon type="lock" />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>

              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
              {this.state.error && (
                <p>用户名或密码错误</p>
              )}
            </FormItem>
          </Form>
           <p className="copyRight">CopyRight ©2017 泰国森林法音</p>
      </div>
    );
  },
}));


module.exports = withRouter(Login)
