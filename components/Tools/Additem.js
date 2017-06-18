import React from 'react';
import ReactDOM from 'react-dom';
import {Form, Input, Icon, Button,Row,Col } from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;

let Additem = React.createClass({

    getDefaultProps(){
     return {
       form:[],
       type:'',
       data:[],
       keys:'',
     };
    },

    add(){

        const { form,keys } = this.props;

        const { getFieldDecorator, getFieldValue,setFieldsValue } = form;
        // can use data-binding to get
        const keyss = getFieldValue(`additemtypekeys-${keys}`);

        const uuid = Number(keyss[keyss.length-1]) + 1;

        const nextKeys = keyss.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        setFieldsValue({

          [`additemtypekeys-${keys}`]: nextKeys,

        });
    },
    remove(k){
       const { form,keys } = this.props;
       // can use data-binding to get
       const keyss = form.getFieldValue(`additemtypekeys-${keys}`);
       // We need at least one passenger
       if (keyss.length === 2) {
         return;
       }

       // can use data-binding to set
       form.setFieldsValue({
          [`additemtypekeys-${keys}`]: keyss.filter(key => key !== k),
         //keys: nkey,
       });
   },

    render() {

        const { form,keys,data,type } = this.props;

        const { getFieldDecorator, getFieldValue } = form;


        let additemtype = type || data[`addtype-${keys}`];

        if(['Radio','checkbox','droplist'].indexOf(additemtype) < 0) return false;

        const iv = typeof(data[`additemtypekeys-${keys}`])==='object' ? data[`additemtypekeys-${keys}`] : [0,1];

        getFieldDecorator(`additemtypekeys-${keys}`, { initialValue:iv });

        const keyss = getFieldValue(`additemtypekeys-${keys}`);

        const formItems = keyss.map((k, index) => {

                return (
                    <Row key={`Row_${keys}_${k}`} style={{height:32,marginTop:8}}><Col span={10}>
                     <FormItem>
                        {getFieldDecorator(`keys-${keys}-names-${k}`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            initialValue:   data[`keys-${keys}-names-${k}`] || '',
                            rules: [{
                              required: true,
                              whitespace: true,
                              message: "请输入选项",
                            }],
                          })(
                            <Input placeholder="选项" style={{ width: '100%'}} />
                          )}
                        </FormItem>
                    </Col><Col span={10}>
                    <Icon
                     className="dynamic-delete-button"
                     style={{marginLeft:10}}
                     type="minus-circle-o"
                     disabled={keyss.length === 2}
                     onClick={() => this.remove(k)}
                   /></Col></Row>
                    )
                })

        return(
            <div key="additemkey">
                {formItems}
                <Button type="dashed" onClick={this.add} style={{ width: '41.66667%',marginTop:10}}>
                        <Icon type="plus" /> 添加选项
                </Button>
                </div>
        )
     }


});


module.exports = Additem;
