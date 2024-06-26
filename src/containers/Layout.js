import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSteam } from '@fortawesome/free-brands-svg-icons'

const { Header, Content, Footer } = Layout;
// const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

class CustomLayout extends React.Component {
    render() {
        return (
            <Layout className='layout'>
                <Header style={{display: 'inline-block'}}>

                    { this.props.isAuthenticated ? (
                        <Menu theme="dark" selectedKeys={[]} mode="horizontal" 
                            style={{lineHeight: "4em", width: '100%'}}
                        >
                            <Menu.Item key="0">
                                <FontAwesomeIcon icon={faSteam} size='3x' style={{
                                    color: '#fff', 
                                    verticalAlign: 'middle'
                            }}/>
                            </Menu.Item>

                            <Menu.Item key="1" onClick={this.props.logout}>
                                Logout
                            </Menu.Item>

                            <Menu.Item key="2">
                                <Link to="/">Browse</Link>
                            </Menu.Item>

                            <Menu.Item key="3">
                            <Link to="/wishlist">Wishlist</Link>
                            </Menu.Item>

                            <Menu.Item key="4">
                            <Link to="/collection">My Games</Link>
                            </Menu.Item>
                        </Menu>
                        ) : (
                        <Menu theme="dark" selectedKeys={[]} mode="horizontal" 
                            style={{lineHeight: "4em", width: '100%'}}
                        >
                            <Menu.Item key="0">
                                <FontAwesomeIcon icon={faSteam} size='3x' style={{
                                color: '#fff', 
                                verticalAlign: 'middle'
                            }}/>
                            </Menu.Item>

                            <Menu.Item key="1">
                                <Link to="/">Home</Link>
                            </Menu.Item>

                            <Menu.Item key="2">
                                <Link to="/login">Login</Link>
                            </Menu.Item>

                            <Menu.Item key="3">
                                <Link to="/signup">Sign Up</Link>
                            </Menu.Item>
                        </Menu>
                        ) 
                    }
                </Header>
                <Content>
                    {this.props.children}
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <div>STEAM SALE SNIFFER™</div>
                    <div id="disclaimer" style={{fontSize: "0.7em"}}>This site is not affiliated with Valve Corp.</div>
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