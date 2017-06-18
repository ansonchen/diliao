import React from 'react';
import { Link } from 'react-router';
import {Button } from 'antd';
import List from '../../Tools/List';


const Tablereg = React.createClass({


      render() {


        return (
            <List
            path="/address"
            router ={this.props.router}
            btn={[['课程管理','addressitem']]}
            columns = {[{
                        title: '名称',
                        dataIndex: 'name',

                      },{
                        title: '时间',
                        dataIndex: 'creatTime',
                        width: '160px',
                    }]}/>
        );
      }
})

module.exports = Tablereg
