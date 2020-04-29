import React from "react";

import { Form, Input, Button } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from '../store/actions/auth'

class RegistrationForm extends React.Component {
    formRef = React.createRef();
    state = { confirmDirty: false };

    handleSubmit = () => {
        this.formRef.current.validateFields(['username', 'email', 'password', 'confirm'])
            .then( values => {
                console.log(values)
                console.log('No submission error detected.')
                this.props.onAuth(values.username, values.email, values.password, values.confirm)
                this.props.history.push("/");
            })
            .catch(err => console.log(err))
    }

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        // console.log('Blur detected.')
    };

    compareToFirstPassword = (rule, value) => {
        // console.log(this)
        // console.log('value: '+value)
        // console.log('password field: '+this.formRef.current.getFieldValue('password'))
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

    // validateToNextPassword = (rule, value) => {
    //     if (value && this.state.confirmDirty) {
    //         this.current.formRef.validateFields(["confirm"], { force: true });
    //     }
    // };

    render() {
        return (
            <Form ref={this.formRef} name="control-ref" onFinish={this.handleSubmit}>
                <Form.Item name="username" label="Username" rules={[{ required: true, message: "Input username" }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="email" label="Email" rules={[{type: "email", message: "Invalid E-mail!" },
                    {required: true, message: "Please input your E-mail!" }
                ]} validateTrigger={['onBlur']}>
                    <Input />
                </Form.Item>

                <Form.Item name="password" label="Password" rules={[{required: true, message: "Input password",
                    // validator: this.validateToNextPassword }
                    }
                ]}>
                    <Input.Password />
                </Form.Item>

                <Form.Item name="confirm" label="Confirm" rules={[{required: true, message: "Confirm password",
                    validator: this.compareToFirstPassword }]} validateTrigger= {['onBlur']}
                >
                    <Input.Password onBlur={this.handleConfirmBlur} />
                </Form.Item>

                <Form.Item>
                    <Button type="danger" onClick={this.test} style={{ marginRight: "10px" }}>
                        Test
                    </Button>
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
        onAuth: (username, email, password1, password2) =>
            dispatch(actions.authSignup(username, email, password1, password2))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);


