import React from 'react';

import List from '../../Tools/List';


const Regform = React.createClass({


      render() {

        const dh = ['法工','学员','兼程'];

        return (
            <List
            path="/formreg"
            router ={this.props.router}
            columns = {[{
                        title: '报名表名称',
                        dataIndex: 'name',

                      }, {
                        title: '报名对象',
                        dataIndex: 'forFormPersonId',
                        render: text =>[<span key={`span_${text}`}>{dh[text-1]}</span>],
                        width: '120px',
                    }]}/>
        );
      }
})

module.exports = Regform
