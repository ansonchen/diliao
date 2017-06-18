import React from 'react';

import List from '../../Tools/List';

import db from '../../../config/data';

const Tablereg = React.createClass({



      render() {
          console.log(this.props.params)
        let id = this.props.params.id ;
          
          const aurl = db.formatUrl('/addressitem?filter=addressId,eq,');

        return (
            <List
            path={`${aurl}${id}`}
            params={this.props.params}
            router ={this.props.router}
            btn={[['报名查看','regdbitem']]}
            columns = {[{
                        title: '课程类型及说明',
                        dataIndex: 'desc',

                      }, {
                        title: '开始日期',
                        dataIndex: 'beginDate',
                        width: '160px',
                    }, {
                        title: '结束日期',
                        dataIndex: 'endDate',
                        width: '160px',
                    }]}/>
        );
      }
})

module.exports = Tablereg
