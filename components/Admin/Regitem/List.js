import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Icon,Table,Radio,Button,Popconfirm,message } from 'antd';
const ButtonGroup = Button.Group;
import rest from '../../../utils/rest';
import db from '../../../config/data';
import JSON from '../../Tools/Json';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const Tablereg = React.createClass({
    getInitialState() {
       return {
         data: [],
         loading: false,
       };
     },
    fetch() {

      this.setState({ loading: true });
      let id = this.props.params.id ;
      let forurl = db.formatUrl(ajaxPath + '/regresult?filter=addressitemId,eq,');
      rest.ajax({
          url: forurl+`${id}`,
          cb:(data)=>{
              const records = db.toRecords('regresult',data);
                this.setState({
                  loading: false,
                  data: records,
                });
          }
      })

    },

    componentDidMount() {
       this.fetch();
    },
    delData(id){

        rest.ajax({
            url:  ajaxPath +'/regresult/'+ id ,
            method: 'DELETE',
            cb:(data)=>{
                message.success('成功');
                this.fetch();
            }
        })

    },

    sendChangePass(values){
        let id = values.id;
        rest.ajax({
            url:  ajaxPath +'/regresult/'+ id ,
            method: 'PUT',
            data: values,
            cb:(data)=>{
                message.success('成功');
            }
        })  
    },
    onPassChange(rec,e){
        let ndata = rec;
        ndata.pass = e.target.value;
        this.sendChangePass(ndata);
        // console.log(`radio checked:${e.target.value}`);
    },

      render() {
          const dh = ['法工','学员','兼程'];
          const passText=['未审核','通过','不通过'];//0为未审核，1为通过，2不通过
          const columns = [{
                      title: '报名内容',
                      dataIndex: 'reg',
                      render: text => [<div key="kk">{text.substr(0,50)}</div>]
                  },
                  {
                       title: '报名类型',
                       dataIndex: 'personId',
                       filters: [
                                { text: '法工', value: 1 },
                                { text: '学员', value: 2 },
                                { text: '兼程', value: 3 },
                              ],
                       render: text =>[<span key={`span_${text}`}>{dh[text-1]}</span>],
                    },

                  {
                       title: '审核',
                       dataIndex: 'id',
                       filters: [
                                { text: '未审核', value: 0 },
                                { text: '通过', value: 1 },
                                { text: '不通过', value: 2 },
                              ],
                       render: (id,record) => [<div key={`div_${id}`}><RadioGroup onChange={this.onPassChange.bind(null,record)} defaultValue={ record.pass ?`${record.pass}` : '0'}>
                            <RadioButton value="0">未审核</RadioButton>
                            <RadioButton value="1">通过</RadioButton>
                            <RadioButton value="2">不通过</RadioButton>
                          </RadioGroup><Popconfirm placement="top" title="确定要删除吗？" onConfirm={this.delData.bind(null,id)}><Button>删除</Button></Popconfirm></div>]
                     },
              ]



        return (
            <Table
                rowKey="id"
                columns={columns}
                expandedRowRender={record => <table className="regdbTable">
                                                <tbody>

                                                { JSON.parse(record.reg)
                                                    .filter((rec)=>{//过滤空数据
                                                        return Object.keys(rec).length
                                                    })
                                                    .map((k,i)=>{
                                                        return  <tr key={`${record.id}_${i}`}><th>{Object.keys(k)}</th><td>{k[Object.keys(k)]}</td></tr>

                                                    })
                                                }

                                                </tbody>
                                             </table>}
                dataSource={this.state.data}
                loading={this.state.loading}
              />
        );
      }
})

module.exports = Tablereg
