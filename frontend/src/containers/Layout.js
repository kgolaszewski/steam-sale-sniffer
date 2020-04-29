import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSteam } from '@fortawesome/free-brands-svg-icons'

const { Header, Content, Footer } = Layout;

class CustomLayout extends React.Component {
    render() {
        return (
            <Layout className='layout'>
                <Header style={{display: 'inline-block'}}>
                    <Menu theme="dark" mode="horizontal" style={{lineHeight: "64px", width: '70%'}}>
                        <Menu.Item key="0">
                            <FontAwesomeIcon icon={faSteam} size='3x' style={{color: '#fff', display: 'inline-block'}}/>
                        </Menu.Item>
                        <Menu.Item key="1">
                            <Link to="/">Home</Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/login">Login</Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content>
                    {this.props.children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>
        )
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomLayout))