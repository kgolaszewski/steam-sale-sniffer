import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component {
    render() {
        <Layout className='layout'>
            <Header>
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]} style={{lineHeight: "64px"}}>
                    <Menu.Item>Login</Menu.Item>
                </Menu>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                {this.props.children}
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2016 Created by Ant UED
            </Footer>
        </Layout>
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userID,
        token: state.auth.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default withRouter(mapStateToProps, mapDispatchToProps)(CustomLayout)