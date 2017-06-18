import React from 'react';
import ReactDOM from 'react-dom';
import rest from '../../../utils/rest';
import db from '../../../config/data';


const Textsingle = React.createClass({
    getInitialState() {
       return {
         detail:'加载中',
       };
     },
     getDefaultProps(){
      return {
        id:'',
      };
     },
     getDetail(){
         let id = this.props.id ;

         rest.ajax({
            url: ajaxPath + `/textsingle/${id}`,
             cb:(data)=>{
                 this.setState({
                   detail: data.body,
                 });
             }
         })

     },

     componentWillMount(){

         this.getDetail();
     },

     componentWillReceiveProps(){

         this.getDetail();
     },

      render() {


        return (
            <div key="boxDetail" className="addressDetail" dangerouslySetInnerHTML={{__html: this.state.detail}} />
        );
      }
})

module.exports = Textsingle
