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

     getVal(val,data){

        var re ='';
        data.map((k,i)=>{

                if(Object.keys(k) == val){

                    re = k[Object.keys(k)].replace(/\n/g, "　");

                }

               })

        return re;
     },
    fetch() {

      this.setState({ loading: true });
      let id = this.props.params.id ;
      let forurl = db.formatUrl(ajaxPath + '/regresult?filter=addressitemId,eq,');

      rest.ajax({
          url: forurl+`${id}`,
          cb:(data)=>{

              const records = db.toRecords('regresult',data);

              var names = ['证件类型','证件号码','中文姓名','法名','手机','电子邮箱','微信号','QQ号','住址 ','身份',
              '受戒时间','出生日期','职业','职位','学历','紧急联系人姓名','电话','衣服尺码','是否愿意担任法工职务？','报名班级','打座时间',
              '你懂英文吗','你懂的语言',
              '有没有家庭成员或朋友一起参加今次这一个课程?如果有，请填写他的姓名/关系。',
              '您参加过昙谛了尊者或由他指派的助理老师所指导的课程吗? ',
              '您有学习过任何静坐或禅修方法或禅修营吗？接受过心理咨询疗程或身心灵修疗法的经验吗?如有，请详述',
              '您如何得知身至念禅修课程，或是谁向您介绍的 ? ',
              '您有没有任何身体上的健康问题或疾病? 如有，请详述',
              '现在或过去,您有没有精神(心理)方面的问题呢？如明显沮丧或焦燥、惶恐、极度沮丧或人格分裂等?如有，请详述 ',
              '您现在或最近两年内有没有服用过医生处方的药品? 如有，请详述',
              '您现在或最近两年内有没有服食任何酒类或毒品，如大麻，安非他命，巴比妥盐，古苛碱，海洛因，或其它麻醉品等 ?如有，请详述',
              '我同意以上条款'];

              var namesOut = ['证件类型','证件号码','中文姓名','法名','手机','电子邮箱','微信号','QQ号','住址','身份',
              '受戒时间','出生日期','职业','职位','学历','紧急联系人姓名','紧急联系人电话','衣服尺码','愿意担任法工','报名班级','打座时间',
              '你懂英文吗','你懂的语言',
              '家庭成员一起参加',
              '参加过指导课程',
              '学习过禅修方法',
              '如何得知禅修课程',
              '健康问题或疾病',
              '精神心理方面',
              '最近两年服药',
              '服食任何酒类或毒品',
              '同意条款'];

              //console.log(records)
              var nndata = [];
              records.map((record)=>{
                  var t = {id:record.id};
                  var rreg =  JSON.parse(record.reg);

                  for(var j = 0,k = names.length;j<k;j++){

                      t[namesOut[j]] = this.getVal(names[j],rreg);

                  }

                  nndata.push(t)
              })
              //https://codebeautify.org/json-to-excel-converter#
              console.log('{"employees": {"employee":'+JSON.stringify(nndata)+'}}')

                this.setState({
                  loading: false,
                  data: records
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
