import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Icon, Button,Row,Col,Checkbox  } from 'antd';
import Ajaxselect from './Ajaxselect';
import Additem from './Additem';
const createForm = Form.create;
const FormItem = Form.Item;

let Addinput = React.createClass({

    getInitialState() {
      return {
        selectList: [],
         data:[],
         additemtype:'',
      }
    },
    getDefaultProps(){
     return {
       form:[],
       data:[],
       akeys:'0',
     };
    },

    remove(k){
       const { form,akeys } = this.props;


       // can use data-binding to get
       const keys = form.getFieldValue(`keys_${akeys}`);
       // We need at least one passenger
       if (keys.length === 1) {
         return;
       }


       // can use data-binding to set
       form.setFieldsValue({
         [`keys_${akeys}`]: keys.filter(key => key !== k),
         //keys: nkey,
       });
   },

   add(){

        const { form,akeys } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue(`keys_${akeys}`);

        const uuid = Number(keys[keys.length-1]) + 1;

        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          [`keys_${akeys}`]: nextKeys,
        });
    },
  changeType(k,value){

      const akeys = this.props.akeys;

      this.setState({
          [`additemtype-${akeys}-${k}`]:value
      })

  },

  render() {

     const  {form, data,akeys } = this.props;

     const { getFieldDecorator, getFieldValue } = form;
     const formItemLayout = {
       labelCol: { span: 4 },
       wrapperCol: { span: 20 },
     };
     const formItemLayoutWithOutLabel = {
       wrapperCol: { span: 20, offset: 4 },
     };

     const formSelectItemLayout = {
       labelCol: { span: 0 },
       wrapperCol: { span: 24 },
     };

     const iv = typeof(data[`keys_${akeys}`])==='object' ? data[`keys_${akeys}`] : [0] ;


     getFieldDecorator(`keys_${akeys}`, { initialValue:iv });

     const keys = getFieldValue(`keys_${akeys}`);

     const formItems = keys.map((k, index) => {

       return (
           <div className="addInputBox" key={`inputbox_${akeys}_${k}`}>
         <FormItem
           {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
           label={index === 0 ? '表单选项' : ''}
           required={false}
           key={k}

         >
         <Row>
          <Col span={10}>
              {getFieldDecorator(`names-${akeys}-${k}`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue:   data[`names-${akeys}-${k}`] || '',
                rules: [{
                  required: true,
                  whitespace: true,
                  message: "请输入名称",
                }],
              })(
                <Input placeholder="名称" style={{ width: '100%'}} />
              )}

          </Col>
          <Col span={10}>
              {getFieldDecorator(`sub-${akeys}-${k}`, {
                validateTrigger: ['onChange', 'onBlur'],
                initialValue:data[`sub-${akeys}-${k}`] || '',
                rules: [{
                  required: false,
                  whitespace: true,
                }],
              })(
                <Input placeholder="备注" style={{ width: '90%'}} />
              )}
          </Col>
          <Col span={2}> <Icon
             className="dynamic-delete-button"
             type="minus-circle-o"
             disabled={keys.length === 1}
             onClick={() => this.remove(k)}
           /></Col>
        </Row>


        <Row>
         <Col span={10}>
              <Ajaxselect
                  form={this.props.form}
                  path="/_Metadata"
                  name={`addtype-${akeys}-${k}`}
                  formItemLayout = {formSelectItemLayout}
                  defaultValue={data[`addtype-${akeys}-${k}`] || "text"}
                  obj ={this}
                  onChange={this.changeType.bind(null,k)}
                  option={["name","cname"]}
              />
        </Col>
        <Col span={10}>

             {getFieldDecorator(`required-${akeys}-${k}`, {
               initialValue: data[`required-${akeys}-${k}`],
               valuePropName: 'checked',
             })(
               <Checkbox style={{paddingLeft:12}}>必填</Checkbox>
             )}

        </Col>
        </Row>

        <Row>
            <Col span={24}>

             <Additem type={this.state[`additemtype-${akeys}-${k}`]} keys={[`${akeys}-${k}`]} data={data} form={this.props.form}/>

            </Col>
        </Row>
         </FormItem>
        </div>
       );
     });

     return(
         <span>
          {formItems}
              <FormItem {...formItemLayoutWithOutLabel}>
              <Button type="dashed" onClick={this.add} style={{ width: '80%' }}>
                <Icon type="plus" /> 添加输入项
              </Button>
            </FormItem>
          </span>
      )
  },
});


module.exports = Addinput;
