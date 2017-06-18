import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import '../../style/index.css';
import { Layout, Menu, Breadcrumb, Icon,Table } from 'antd';
import rest from '../../utils/rest';
import db from '../../config/data';
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const AddressMenu = React.createClass({
     getDefaultProps(){
      return {
        clickeven:function(){}
      };
     },
  getInitialState() {
    return {
      data: [],
      menus:[]
    };
  },

  ajax() {
      rest.ajax({
          url: ajaxPath +'/address/',
          cb:(data)=>{
              this.setState({data:db.toRecords('address',data)});
          }
      })

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
    this.ajax();
    this.loadMenu();
  },

  render() {
    return (
        <Menu
            mode="inline"
             defaultOpenKeys={['addressMenu']}
            style={{ height: '100%' }}
          >
          <SubMenu key="addressMenu" title={<span><Icon type="environment-o" /><span className="nav-text">禅修地点</span></span>}>
          {this.state.data.map((mu,k)=>
                 <Menu.Item key={`key_${k}`}><Link onClick={this.props.clickeven} to={`/reglist/${mu.id}`}>{mu.name}</Link></Menu.Item>
                )
            }
            </SubMenu>
            {this.state.menus.map((k)=>
                <Menu.Item key={`menu_${k.id}`}><Link onClick={this.props.clickeven} to={`/Book/${k.id}`}><Icon type={k.icon} /><span className="nav-text">{k.name}</span></Link></Menu.Item>
            )}

        </Menu>
    );
}
});

const Course = React.createClass({
  getInitialState() {
    return {
      collapsed: false
    };
  },
  closeMenu(){
      if(this.state.collapsed){
          this.setState({
            collapsed:false
          });
      }
  },
  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
    });
  },
    linkTo(){
        this.props.router.replace(`reglist/1`);
    },
  render() {

    return (
        <Layout>
          <Content style={{ padding: '32px 32px' }}>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider
                trigger={null}
                collapsible
                collapsed={this.state.collapsed}
                width={260} style={{ background: '#fff' }}>
                <AddressMenu clickeven={this.closeMenu}/>
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }} onClick={this.closeMenu} >
            <Icon
              className="trigger triggerSwitch"
              type={this.state.collapsed ? 'menu-fold' : 'menu-unfold'}
              onClick={this.toggle}
            />
                {this.props.children || this.linkTo() }
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
module.exports = Course
