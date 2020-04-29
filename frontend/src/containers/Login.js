import { Form, Input, Button } from 'antd';

import React        from 'react'
import { connect }  from 'react-redux'
import { NavLink }  from 'react-router-dom'
import * as actions from '../store/actions/auth'


class Demo extends React.Component {
    formRef = React.createRef();

    onReset = () => { this.formRef.current.resetFields(); };

    handleSubmit = () => {
        this.props.onAuth(
            this.formRef.current.getFieldValue('username'), 
            this.formRef.current.getFieldValue('password') 
        )
        this.props.history.push('/')
    }


    render() {
        return (
        <Form ref={this.formRef} name="control-ref" onFinish={this.handleSubmit}>
            <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button> Or 
                <NavLink style={{marginRight: '10px'}} to='/signup'> Sign Up</NavLink>
            </Form.Item>
        </Form>
        );
    }
}

const WrappedNormalLoginForm = Demo

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