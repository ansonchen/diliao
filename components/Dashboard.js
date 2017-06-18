import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import auth from '../utils/auth'
import '../style/index.css';
import { Layout, Menu, Breadcrumb, Icon,Table } from 'antd';
import reqwest from 'reqwest';
import db from '../config/data';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const AddressMenu = React.createClass({
  getInitialState() {
    return {
      data: []
    };
  },

  ajax() {
    reqwest({
      url: ajaxPath +'/address/',
      method: 'get',
      type: 'json',
    }).then((data) => {

            this.setState({data:db.toRecords('address',data)});


    });
  },

  componentDidMount() {
    //this.ajax();
  },
  render() {
    return (
        <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >

            <Menu.Item key="address"><Link to={`/address/`}><Icon type="file-text" />禅修地点</Link></Menu.Item>
            <Menu.Item key="regform"><Link to={`/formreg/`}><Icon type="file-text" />报名表格</Link></Menu.Item>
            <Menu.Item key="Norm"><Link to={`/norm/`}><Icon type="file-text" />规范管理</Link></Menu.Item>
        </Menu>
    );
}
});

const Dashboard = React.createClass({
  render() {
    const token = auth.getToken()

    return (
        <Layout>

        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
                 <Menu.Item key="index"><Link to={`/`}>报名设置</Link></Menu.Item>
          </Menu>
        </Header>
          <Content style={{ padding: '0 32px 32px' }}>
          <Breadcrumb style={{ margin: '12px 0' }}>
               <Breadcrumb.Item><Link to="/logout">退出登录</Link></Breadcrumb.Item>
             </Breadcrumb>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <AddressMenu />
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                {this.props.children}
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            CopyRight ©2017 泰国森林法音
          </Footer>
        </Layout>
    )
  }
})
//{token}
module.exports = Dashboard
