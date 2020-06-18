import React from "react";

import { Form, Input, Button } from "antd";
import { connect } from "react-redux";
import { NavLink, Redirect }  from 'react-router-dom';
import bad_passwords from '../bad_passwords';

import * as actions from '../store/actions/auth';

const password_list = bad_passwords()

const layout = {
    labelCol:   { xs: { span: 2 }, sm: { span: 7 }},
    wrapperCol: { xs: { span: 2 }, sm: { span: 10 }},
};

const tailLayout = {
    wrapperCol: {xs: { offset: 0, span: 2 }, sm: { offset: 8, span: 8 }}
};

class RegistrationForm extends React.Component {
    formRef = React.createRef();
    state = { confirmDirty: false };

    handleSubmit = () => {
        this.formRef.current.validateFields(['username', 'email', 'password', 'confirm'])
            .then( values => {
                this.props.onAuth(values.username, values.email, values.password, values.confirm)
            })
            .catch(err => console.log(err))
    }

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value) => {
        if (value && value !== this.formRef.current.getFieldValue("password")) {
            return Promise.reject("The two passwords you entered do not match!")
        } else {
            return Promise.resolve()
        }
    };

    checkLength = (rule, value) => {
        if (value && value.length < 8) {
            return Promise.reject("Your password must be at least 8 characters!")
        } else {
            return Promise.resolve()
        }
    };

    compareToBadPasswords = (rule, value) => {
        if (value && password_list.includes(value)) {
            return Promise.reject("This password is too common! Please use a different one.")
        } else {
            return Promise.resolve()
        }
    };

    render() {
        const { token } = this.props
        if (token) { return <Redirect to="/" /> }
        return (
            <div className='background'>
            <h1>Create an Account</h1>
            <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.handleSubmit} className='form-bkg' >
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Input username" }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{type: "email", message: "Invalid E-mail!" },
                    {required: true, message: "Please input your E-mail!" }
                ]} validateTrigger={['onBlur']}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" validateTrigger= {['onBlur']} rules={[
                    // {required: true, message: "Input password"},
                    {required: true, message: "Your password must be at least 8 characters.", validator: this.checkLength},
                    {
                        required: true, message: "This password is too common! Please use a different one.", 
                        validator: this.compareToBadPasswords
                    }

                ]}>
                    <Input.Password onBlur={this.handleConfirmBlur} />
                </Form.Item>

                <Form.Item name="confirm" label="Confirm" validateTrigger= {['onBlur']} rules={[{
                    required: true, message: "Your passwords do not match.", validator: this.compareToFirstPassword 
                }]}>
                    <Input.Password onBlur={this.handleConfirmBlur} />
                </Form.Item>

                <Form.Item {...tailLayout} className='submit-btn'>
                    <Button type="primary" htmlType="submit" className="loginButton" style={{ marginRight: "10px" }}>
                        Register
                    </Button>
                    <p className='form-redirect'>
                    or <NavLink style={{ marginRight: "10px" }} to="/login/">Log In</NavLink>
                    </p>
                </Form.Item>
            </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        token: state.auth.token,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) =>
            dispatch(actions.authSignup(username, email, password1, password2))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);


