import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import auth from '../../utils/auth'
import '../../style/index.css';
import { Layout, Menu, Breadcrumb, Icon,Table } from 'antd';
import rest from '../../utils/rest';
import db from '../../config/data';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const AddressMenu = React.createClass({
  getInitialState() {
    return {
      menus: []
    };
  },

  loadMenu() {

      rest.ajax({
          url: ajaxPath +'/_Typefortext/',
          cb:(data)=>{
             this.setState({menus:db.toRecords('_Typefortext',data)});
          }
      })

  },

  componentDidMount() {
    this.loadMenu();
  },
  render() {
//      console.log(this.state.menus)
    return (
        <Menu
            mode="inline"
            defaultOpenKeys={['addressMenu']}
            style={{ height: '100%' }}
          >
          <SubMenu key="addressMenu" title={<span><Icon type="environment-o" /><span>禅修地点</span></span>}>
                <Menu.Item key="address"><Link to={`/address/`}><Icon type="file-text" />禅修地点</Link></Menu.Item>
                <Menu.Item key="regform"><Link to={`/formreg/`}><Icon type="file-text" />报名表格</Link></Menu.Item>
                <Menu.Item key="norm"><Link to={`/norm/`}><Icon type="file-text" />规范管理</Link></Menu.Item>
            </SubMenu>
            {this.state.menus.map((k)=>
                <Menu.Item key={`menu_${k.id}`}><Link to={`/textmore/${k.id}`}><Icon type={k.icon} />{k.name}</Link></Menu.Item>
            )}

        </Menu>
    );
}
});

const Index = React.createClass({
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
module.exports = Index
