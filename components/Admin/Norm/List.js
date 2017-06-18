import React from 'react';

import List from '../../Tools/List';


const Tablereg = React.createClass({


      render() {


        return (
            <List
            path="/norm"
            router ={this.props.router}
            columns = {[{
                        title: '名称',
                        dataIndex: 'name',

                      }, {
                        title: '时间',
                        dataIndex: 'creatTime',
                        width: '160px',
                    }]}/>
        );
      }
})

module.exports = Tablereg
