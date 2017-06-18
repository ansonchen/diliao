import React from 'react';
import ReactDOM from 'react-dom';
import rest from '../../utils/rest';
import { Select,Input,Form } from 'antd';
import db from '../../config/data';

const Option = Select.Option;
const createForm = Form.create;
const FormItem = Form.Item;

let Selectajax = React.createClass({

    getDefaultProps(){
     return {
       path:'',
       name:'',
       label:'',
       defaultValue:'1',
       option:['id','name'],
       form:[],
       formItemLayout:{
                     labelCol: { span: 4 },
                     wrapperCol: { span: 20 },
        },
        required:true,
        //multiple:false,
        onChange:()=>{},
        obj:'',
     };
    },

    getInitialState() {
      return {
        value:[],
      }
    },

   getList(){

      const path = this.props.path;
      rest.ajax({
          url: ajaxPath + path,
          cb:(data)=>{
              const records = db.toRecords(path,data);
              this.setState({
                value: records,
              });
              //设置缓存
              if(this.props.obj !==''){
                  this.props.obj.setState({
                    selectList: records,
                  });
              }
          }
      })

  },

  componentDidMount() {
      const mobj = this.props.obj;

      if(mobj !== '' && mobj.state.selectList.length > 0){
          this.setState({
            value: mobj.state.selectList,
          });

      }else{
          //console.log(mobj.state.selectList)
          this.getList();

      }

  },

//  componentWillReceiveProps(){
//    // this.getList();
//  },

  render() {

    const thatp = this.props;
    const { getFieldDecorator } = thatp.form;
    const formItemLayout = thatp.formItemLayout;

    //const multiple = thatp.multiple ? 'multiple' : '';

    return (
          <FormItem
             {...formItemLayout}
             label={thatp.label}
            >
             {getFieldDecorator(thatp.name, {
               initialValue : `${thatp.defaultValue}`,
               rules: [
                 { required: thatp.required, message:`请选择${thatp.label}`},
               ],
             })(
               <Select placeholder={`请选择${thatp.label}`} onChange={thatp.onChange}>
                 {this.state.value.map((x,k)=>[<Option value={`${x[thatp.option[0]]}`}>{x[thatp.option[1]]}</Option>])}
               </Select>
             )}
       </FormItem>
    );
  },
});


module.exports = Selectajax;
