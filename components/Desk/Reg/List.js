import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import {Icon,Table,Button,Popconfirm,message } from 'antd';
import JSON from '../../Tools/Json';
import rest from '../../../utils/rest';
import db from '../../../config/data';

const ButtonGroup = Button.Group;
const Reglist = React.createClass({
    getInitialState() {
       return {
         courses: [],
         requesting:false,
         detail:'加载中',
       };
     },
     getDetail(){
         let id = this.props.params.id ;
         rest.ajax({
             url: ajaxPath + `/address/${id}`,
             cb:(data)=>{
                 this.setState({
                   detail: data.desc,
                   requesting:false
                 });
             }
         })

     },

     getList(){
         const id = this.props.params.id ;
         const aurl = db.formatUrl('/addressitem?filter=addressId,eq,');

         rest.ajax({
               url: ajaxPath + `${aurl}${id}`,
              cb:(data)=>{
                  this.setState({
                    courses: db.toRecords('addressitem',data),

                  });
              }
          })


     },
     componentWillMount(){
         this.setState({
            requesting:true
           });
         this.getList();
         this.getDetail();
     },

     componentWillReceiveProps(nextProps){
        if(this.state.requesting) return false;
        if(this.props.params.id===nextProps.params.id){
             this.setState({
                requesting:true
               });
             this.getList();
             this.getDetail();

         }
     },

      render() {


        return (
            <div>
            <div key="table" className="courseBox">

              {this.state.courses.filter((x)=>x.finished==0).map((k)=>
                    
                  <dl key={`regBox_${k.id}`}>
                      <dt>禅修时间：<i>{`${k.beginDate.substr(5,2)}月${k.beginDate.substr(8,2)}日 ～ ${k.endDate.substr(5,2)}月${k.endDate.substr(8,2)}日`}</i>
                      
                      </dt>
                      <dd>
                       <p>{k.desc}</p>
                          <ButtonGroup>
                      {
                          JSON.parse(k.reg).map((l)=>
                          <Button  key={`reglink_${k.id}_${l.pid}`} type="primary" size="large"><Link to={`regitem/${this.props.params.id}/${l.formRegId}/${k.id}`}>{l.name}报名</Link></Button>
                          )

                      }
                        </ButtonGroup>
                       </dd>

                  </dl>

                

              )}

            </div>
            <div key="boxDetail" className="addressDetail" dangerouslySetInnerHTML={{__html: this.state.detail}} />
            </div>
        );
      }
})

module.exports = Reglist
