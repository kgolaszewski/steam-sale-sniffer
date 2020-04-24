import { Form, Input, Button, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';

import React        from 'react'
import { connect }  from 'react-redux'
import { NavLink }  from 'react-router-dom'
import * as actions from '../store/actions/auth'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault()
        // this.props.form is created by Form.create() at the bottom of the file
        this.props.form.validateFields((err, values) => {
            if (!err) { this.props.onAuth(values.username, values.password) }
            this.props.history.push('/')
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        let errorMessage = null
        // error will only be rendered if authFail was dispatched 
        if (this.props.error) { errorMessage = ( <p>{this.props.error.message}</p> ) }
        let user_rules = [{required: true, message: 'Input your Username!'} ]
        let pass_rules = [{ required: true, message: 'Input your Password!'} ]

        return (
            <div>
                { errorMessage }
                { this.props.loading ? (<Spin indicator={antIcon} />) : (

                <Form name="normal_login" className="login-form" initialValues={{ remember: true }} 
                      onFinish={(values) => this.handleSubmit(values)} 
                >
                    <Form.Item name="username" rules={user_rules}>
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item name="password" rules={pass_rules} >
                        <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>Login</Button>
                        Or 
                        <NavLink style={{marginRight: '10px'}} to='/signup'> Sign Up</NavLink>
                    </Form.Item>
                </Form>
                )}
            </div>
        );
    }
};

const WrappedNormalLoginForm = Form.create()(NormalLoginForm)

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm)