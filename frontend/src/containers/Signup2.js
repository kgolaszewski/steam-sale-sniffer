import React from "react";
import { Form, Input, Icon, Button, Select } from "antd";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as actions from "../store/actions/auth";

const FormItem = Form.Item;
const Option = Select.Option;

class RegistrationForm extends React.Component {
    state = {
        confirmDirty: false
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let is_student = false;
                if (values.userType === "student") is_student = true;
                this.props.onAuth(values.userName, values.email, values.password, values.confirm, is_student);
                // this.props.history.push("/");
            }
        });
    };

    handleConfirmBlur = e => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem>
                {getFieldDecorator("userName", {
                    rules: [{ required: true, message: "Please input your username!" }]
                })(
                    <Input placeholder="Username" />
                )}
                </FormItem>

                <FormItem>
                {getFieldDecorator("email", {
                    rules: [
                    {type: "email", message: "The input is not valid E-mail!" },
                    { required: true, message: "Please input your E-mail!" }
                    ]
                })(
                    <Input placeholder="Email" />
                )}
                </FormItem>

                <FormItem>
                {getFieldDecorator("password", {
                    rules: [
                    { required: true, message: "Please input your password!" },
                    { validator: this.validateToNextPassword }
                    ]
                })(
                    <Input type="password" placeholder="Password"
                    />
                )}
                </FormItem>

                <FormItem>
                {getFieldDecorator("confirm", {
                    rules: [
                    { required: true, message: "Please confirm your password!" },
                    { validator: this.compareToFirstPassword }
                    ]
                })(
                    <Input type="password" placeholder="Password" onBlur={this.handleConfirmBlur} />
                )}
                </FormItem>

                <FormItem>
                <Button type="primary" htmlType="submit" style={{ marginRight: "10px" }}>
                    Signup
                </Button>
                Or
                <NavLink style={{ marginRight: "10px" }} to="/login/">
                    login
                </NavLink>
                </FormItem>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RegistrationForm);

const mapStateToProps = state => {
return {
loading: state.auth.loading,
error: state.auth.error
};
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (username, email, password1, password2, is_student) =>
        dispatch(
            actions.authSignup(username, email, password1, password2, is_student)
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm);


