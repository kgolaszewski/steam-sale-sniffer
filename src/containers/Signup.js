import React from "react";

import { Form, Input, Button } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from '../store/actions/auth'

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 10 },
};

const tailLayout = {
    wrapperCol: { offset: 7, span: 10 },
};

class RegistrationForm extends React.Component {
    formRef = React.createRef();
    state = { confirmDirty: false };

    handleSubmit = () => {
        this.formRef.current.validateFields(['username', 'email', 'password', 'confirm'])
            .then( values => {
                console.log(values)
                console.log('No submission error detected.')
                this.props.onAuth(values.username, values.email, values.password, values.confirm)
                // this.props.history.push("/");
            })
            .catch(err => console.log(err))
    }

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value) => {
        if (value && value !== this.formRef.current.getFieldValue("password")) {
            return Promise.reject("Two passwords that you enter is inconsistent!")
        } else {
            return Promise.resolve()
        }
    };

    test = () => {
        this.formRef.current.validateFields(['username', 'email', 'password', 'confirm'])
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
            <h1>Create an Account</h1>
            <Form {...layout} ref={this.formRef} name="control-ref" onFinish={this.handleSubmit}>
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Input username" }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{type: "email", message: "Invalid E-mail!" },
                    {required: true, message: "Please input your E-mail!" }
                ]} validateTrigger={['onBlur']}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{required: true, message: "Input password",}
                ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="confirm" label="Confirm" validateTrigger= {['onBlur']} rules={[{
                    required: true, message: "Your passwords do not match.", validator: this.compareToFirstPassword 
                }]}>
                    <Input.Password onBlur={this.handleConfirmBlur} />
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit" className="loginButton" style={{ marginRight: "10px" }}>
                        Register
                    </Button>
                    Or <NavLink style={{ marginRight: "10px" }} to="/login/">Log In</NavLink>
                </Form.Item>
            </Form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2) =>
            dispatch(actions.authSignup(username, email, password1, password2))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);

