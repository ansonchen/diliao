import React from 'react';
import ReactDOM from 'react-dom';
import { Select, Radio, Checkbox, Button, DatePicker, TimePicker,Input, InputNumber, Form, Cascader, Icon, message } from 'antd';
import Ajaxselect from '../../Tools/Ajaxselect';
import JSON from '../../Tools/Json';
import rest from '../../../utils/rest';
import db from '../../../config/data';
import moment from 'moment';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { MonthPicker, RangePicker } = DatePicker;
let Demo = React.createClass({

    getInitialState() {
       return {
         options: [],
         allowReg:[],
         showLabel:[],
         desc:'',
         beginDate:'',
         endDate:'',
         addressId:'',
       };
     },
      curentData(){
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day  : day;
        hh = hh < 10 ? "0" + hh  : hh;
        mm = mm < 10 ? "0" + mm  : mm;
        return `${year}-${month}-${day}`;
    },
   getPerson(){

       const path="/_Person";

       rest.ajax({
           url: ajaxPath + path,
           cb:(data)=>{

                   const ndata = db.toRecords(path,data);
                   let option=[];
                   let showLabel=[];
                   ndata.map((k)=>{
                       option.push({
                           label:`${k.name}`,
                           value:`${k.id}`,
                       })
                       showLabel[`${k.id}`] = `${k.name}`;
                   })

                 this.setState({
                   options: option,
                   showLabel:showLabel
                 });
           }
       })

   },

  getItemData(){
       const {pid,id} = this.props.params;
       if(id !=0 ){

           rest.ajax({
               url: ajaxPath +'/addressitem/'+ id,
               cb:(data)=>{


                      //console.log(data);

                      let regs = JSON.parse(data.reg);
                      let allId =[];
                      let ndata = {
                           desc:data.desc,
                           beginDate:data.beginDate,
                           endDate:data.endDate,
                           addressId:data.addressId,
                        };
                      const { getFieldDecorator } = this.props.form;

                      getFieldDecorator('beginDate',{initialValue:data.beginDate});
                      getFieldDecorator('endDate',{initialValue:data.endDate});

                      regs.map((k,i)=>{
                          allId.push(k.pid);
                          ndata[`forFormPersonId-${k.pid}`] = k.formRegId;
                      });

                       ndata.allowReg = allId;

                      // console.log(ndata);

                      this.setState(ndata);
               }
           })

       }

  },
  addItemForm(values,add){

      const {pid,id} = this.props.params;

      let iid = id;

      if(add){iid = 0}

      rest.ajax({
          url: (iid != 0) ? ajaxPath +'/addressitem/'+ iid : ajaxPath +'/addressitem',
          //url: 'https://randomuser.me/api',
          method: (iid != 0) ? 'PUT': 'POST',
          data: values,
          cb:(data)=>{
              message.success('成功');
               let that = this;
               setTimeout(()=>{
                   that.props.router.replace(`/addressitem/${pid}`)
               },1000)

          }
      })


      
  },

  componentDidMount(){

      this.getPerson();
      this.getItemData();

  },

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

     // console.log(values);

      const {pid,id} = this.props.params;


      //重新组装下数据

      const reg =[];
      values.allowId.map((k)=>{
          reg.push({
              name:this.state.showLabel[k],
              pid:k,
              formRegId:values[`forFormPersonId-${k}`]
          })

      })

      const sdata = {
          desc:values.desc,
          beginDate:values.beginDate,
          endDate:values.endDate,
          addressId:pid,
          reg:JSON.stringify(reg)
      };

     // console.log(sdata)

      this.addItemForm(sdata);



    });
  },

   onChange(checkedValues) {


       this.setState({
         allowReg: checkedValues,
       });

    },


  render() {


    const { getFieldDecorator,setFieldsValue } = this.props.form;
    const { desc,beginDate,endDate,addressId,allowReg} = this.state;

    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    const aurl = db.formatUrl('/formreg?forFormPersonId=');
    return (
      <Form horizontal >

          <FormItem
            {...formItemLayout}
            label="上课日期"
          >
          {getFieldDecorator('begendDate', {
            initialValue:[moment(beginDate!=''?beginDate:this.curentData(), 'YYYY-MM-DD'), moment(endDate!=''?endDate:this.curentData(), 'YYYY-MM-DD')],
            rules: [
              {required: true, message: '请选择上课日期'},
            ],
            onChange:(date, dateString)=> {
                getFieldDecorator('beginDate',{initialValue:dateString[0]});
                getFieldDecorator('endDate',{initialValue:dateString[1]});
              //  console.log( dateString);
              }
          })(
              <RangePicker/>
          )}

          </FormItem>

          <FormItem
            {...formItemLayout}
            label="允许报名角色"
          >
          {getFieldDecorator('allowId', {
            initialValue:allowReg,
            rules: [
              {required: true, message: '请选择报名对象'},
            ],

          })(
              <CheckboxGroup options={this.state.options}  onChange={this.onChange} />
          )}

        </FormItem>

        {allowReg.map((i)=>{

            return(

                <Ajaxselect
                    key = {`select_${i}`}
                    form={this.props.form}
                    formItemLayout = {formItemLayout}
                    path={`${aurl}${i}`}
                    name={`forFormPersonId-${i}`}
                    label={`${this.state.showLabel[i]}报名表`}
                    defaultValue={this.state[`forFormPersonId-${i}`]||''}
                />

            )

        })}


        <FormItem
            {...formItemLayout}
            label="类型及说明"
          >
          {getFieldDecorator('desc', {
            initialValue:desc,
            rules: [
              { required: true, message: '课程类型及说明不能为空' },
            ],
            })(
                <Input type="textarea" placeholder="课程类型及说明" id="desc" name="desc" />
            )}

          </FormItem>

        <FormItem
          wrapperCol={{ span: 12, offset: 7 }}
        >
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    );
  },
});

Demo = createForm()(Demo);
module.exports = Demo;
