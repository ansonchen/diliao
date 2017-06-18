import React from 'react';
import ReactDOM from 'react-dom';
import rest from '../../../utils/rest';
import { Select, Radio, Checkbox, Button, DatePicker, TimePicker,Input, InputNumber, Form, Cascader, Icon,message } from 'antd';
import Fulledit from '../../Tools/Fulledit'
import db from '../../../config/data';
const Option = Select.Option;
const RadioGroup = Radio.Group;
const createForm = Form.create;
const FormItem = Form.Item;
const { MonthPicker, RangePicker } = DatePicker;


let Textsingle = React.createClass({

    getInitialState() {
      return {
        fullText: '',
        name:'',
      }
    },

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  fetch() {

    let id = this.props.params.id ;

    rest.ajax({
         url: ajaxPath +'/textmore/'+id,
        cb:(data)=>{
            this.setState({
              fullText: data.body,
              name: data.name,
           })
        }
    })

  },

  componentDidMount() {
    if(this.props.params.id != 0){
        this.fetch();
    }
  },
//  componentWillReceiveProps(){
//      if(this.props.params.id != 0){
//          this.fetch();
//      }
//  },
  addData(values){

       const {pid,id} = this.props.params;
       values.typeid = pid;
       rest.ajax({
           url: (id != 0) ? ajaxPath +'/textmore/'+ id : ajaxPath +'/textmore',
           method: (id != 0) ? 'PUT': 'POST',
           data: values,
           cb:(data)=>{
               console.log(data);
             message.success('成功');
              let that = this;
              setTimeout(()=>{
                  that.props.router.replace('/textmore/'+pid)
              },1000)
           }
       })



  },
  curentTime(){
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
        return `${year}-${month}-${day} ${hh}:${mm}`;
    },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        return;
      }

      values.body = this.state.fullText;
      values.creatTime = this.curentTime();


      this.addData(values);
    });
  },


  render() {

    const { getFieldDecorator } = this.props.form;



    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    return (
      <Form horizontal >

          <FormItem
            {...formItemLayout}
            label="名称"
          >
          {getFieldDecorator('name', {
            initialValue:this.state.name,
            rules: [
              { required: true, message: '请输入名称' },
            ],
        })(<Input />)}

          </FormItem>


        <FormItem
        {...formItemLayout}
        label="内容"
        >

         <Fulledit obj = {this} />

          </FormItem>

        <FormItem
          wrapperCol={{ span:20, offset: 4 }}
        >
          <Button type="primary" onClick={this.handleSubmit}>确定</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>重置</Button>
        </FormItem>
      </Form>
    );
  },
});

Textsingle = createForm()(Textsingle);
module.exports = Textsingle;
