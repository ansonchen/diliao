import React from 'react';

import List from '../../Tools/List';

import db from '../../../config/data';

const Textmorelist = React.createClass({


 render() {
        let id = this.props.params.id ;
        const aurl = db.formatUrl('/textmore?filter=typeid,eq,');
        return (
            <List
            path={`${aurl}${id}`}
            params={this.props.params}
            router ={this.props.router}
            buildPath='book'
            showBuild={true}
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

module.exports = Textmorelist
