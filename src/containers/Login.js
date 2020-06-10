import { Form, Input, Button } from 'antd';

import React        from 'react'
import { connect }  from 'react-redux'
import { NavLink, Redirect }  from 'react-router-dom'
import * as actions from '../store/actions/auth'

const layout = {
    labelCol:   { xs: { span: 2 }, sm: { span: 7 }},
    wrapperCol: { xs: { span: 2 }, sm: { span: 10 }},
};

const tailLayout = {
    wrapperCol: {xs: { offset: 0, span: 2 }, sm: { offset: 8, span: 8 }}
};

class Demo extends React.Component {
    formRef = React.createRef();
    state = { submitted: false }

    handleSubmit = () => {
        this.props.onAuth(
            this.formRef.current.getFieldValue('username'), 
            this.formRef.current.getFieldValue('password') 
        )
        this.setState({ submitted: true })
    }


    render() {
        const { token, error } = this.props
        if (token) { return <Redirect to="/" /> }
        return (
        <div className='background'>
            <h1 >Sign In</h1>
            {this.state.submitted && error && 
                <p className='error'>{'The account name or password that you have entered is incorrect.'}</p>
            }
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
            <Form.Item {...tailLayout} className='submit-btn'>
                <Button type="primary" htmlType="submit" className="loginButton">
                    Sign In
                </Button>
                <br />
                <p className='form-redirect'>
                or <NavLink style={{marginRight: '10px'}} to='/signup'> Sign Up</NavLink>
                </p>
            </Form.Item>
        </Form>
        </div>
        );
    }
}

const WrappedNormalLoginForm = Demo

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (username, password) => dispatch(actions.authLogin(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WrappedNormalLoginForm)