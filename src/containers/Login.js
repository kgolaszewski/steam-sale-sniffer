import { Form, Input, Button } from 'antd';

import React        from 'react'
import { connect }  from 'react-redux'
import { NavLink }  from 'react-router-dom'
import * as actions from '../store/actions/auth'

// wrapperCol:   { xs: { span: 2 }, sm: { span: 15 }, md: { span: 15 }, lg: { span: 15 } },

const layout = {
    labelCol:   { xs: { span: 2 }, sm: { span: 1 }, md: { span: 7 }},
    wrapperCol: { xs: { span: 2 }, sm: { span: 1 }, md: { span: 10 }},
};

const tailLayout = {
    wrapperCol: {xs: { offset: 0, span: 2 }, sm: { offset: 8, span: 8 }}
};

class Demo extends React.Component {
    formRef = React.createRef();

    handleSubmit = () => {
        this.props.onAuth(
            this.formRef.current.getFieldValue('username'), 
            this.formRef.current.getFieldValue('password') 
        )
        this.props.history.push('/')
    }


    render() {
        return (
        <div>
            <h1 >Sign In</h1>
        <Form 
            // {...layout} 
            layout={'horizontal'}
            ref={this.formRef} name="control-ref" onFinish={this.handleSubmit} 
            // style={{ overflow: 'hidden'}}
        >
            <Form.Item 
                {...layout} 
                name="username" label="Username" rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>
            <Form.Item 
                {...layout} 
                name="password" label="Password" rules={[{ required: true }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" className="loginButton">
                    Sign In
                </Button>
                <br />Or <NavLink style={{marginRight: '10px'}} to='/signup'> Sign Up</NavLink>
            </Form.Item>
        </Form>
        </div>
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