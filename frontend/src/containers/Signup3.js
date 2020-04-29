import React from "react";

import { Form, Input, Button } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from '../store/actions/auth'

class RegistrationForm extends React.Component {
    formRef = React.createRef();
    state = { confirmDirty: false };

    handleSubmit = e => {
        e.preventDefault();
        this.current.formRef.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.props.onAuth(values.userName, values.email, values.password);
                // this.props.history.push("/");
            }
        });
    };

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        if (value && value !== this.formRef.current.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        if (value && this.state.confirmDirty) {
            this.current.formRef.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Input username" }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{type: "email", message: "Invalid E-mail!" },
                    {required: true, message: "Please input your E-mail!" }
                ]}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{required: true, message: "Input password"},
                    {validator: this.validateToNextPassword }
                ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="confirm" label="Confirm" rules={[{required: true, message: "Confirm password" },
                    {validator: this.compareToFirstPassword }
                ]}>
                    <Input.Password onBlur={this.handleConfirmBlur} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>
                        Signup
                    </Button>
                    Or
                    <NavLink style={{ marginRight: "10px" }} to="/login/">Log In</NavLink>
                </Form.Item>
            </Form>
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
        onAuth: (username, email, password) =>
            dispatch(
                actions.authSignup(username, email, password)
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);


