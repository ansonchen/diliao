import React from 'react'
import auth from '../utils/auth'

const Logout = React.createClass({

    linkTo(){
        let that = this;
        setTimeout(()=>{
            that.props.router.replace('/')
        },1000)
    },
    componentDidMount() {
        auth.logout();
        this.linkTo();
    },

    render() {

        return <div className="logoutBox"><p>成功退出1秒后跳转</p></div>
    }
})

module.exports = Logout
