// import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { Menu, Dropdown } from 'antd';


import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';



class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wishlistitems: [],
            modal: false,
            activeItem: {
                game: '',
                user: localStorage.getItem('userId'),
                id: '',
            },    
        }
    }

    componentDidMount() {
        
        axios
            .get(`http://localhost:8001/api/wishlists/${this.state.activeItem.user}`)
            .then( res => {
                this.setState({wishlistitems: res.data.filter(e => e.purchased)})
                })
            .catch( err => console.log(err) )
    }

    toggle = (id, game) => { 
        let active_id = !this.state.modal ? id : ''
        let active_game = !this.state.modal ? game : ''
        this.setState({ 
            modal: !this.state.modal, 
            activeItem: {
                ...this.state.activeItem, 
                id: active_id,
                game: active_game,
            }
        }) 
        console.log(this.state)
    }

    handleDelete = (item_id) => {
        axios
            .delete(`http://localhost:8001/api/wishlistitems/${item_id}`)
            .then(res => { console.log(res) })
            .catch(err => { console.log('State of item during error'); console.log(err);})
        let updated_wishlist = this.state.wishlistitems.filter(e => e.id !== item_id && e.purchased)
        this.setState({ wishlistitems: updated_wishlist })
    }

    render() {
        return (
        <div className="App background">
            <h1>My Wishlist</h1>
            <div className="container">
            <div className="row">
                <div className="offset-1 col-md-10">
                { this.state.wishlistitems.map(item => {
                    let { game } = item
                    let menu = (
                        <Menu>
                            <Menu.Item>
                                <a href="/" id={game.id} onClick={() => this.handleDelete(item.id)}>Remove</a>
                            </Menu.Item>
                        </Menu>
                    )
                    return (
                    <div>
                    <div className="row game" key={game.id}>
                        <img className="offset-0" height="55" alt=""
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg`} 
                        />
                        <div className="col-md-5 game-title text">{game.title}</div>
                        <div className="offset-2 col-md-2 game-price text">${game.curr_price}</div>
                        <div className="col-md-1 text">
                            <Dropdown overlay={menu}>
                                <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <FontAwesomeIcon icon={faCog} size='1x' style={{color: '#fff'}} />
                                </a>
                            </Dropdown>
                        </div>
                        {/* <div>{item.id}</div> */}
                    </div>
                    </div>
                    )
                })}
                </div>
            </div>
            </div>
            { this.state.modal ? (
            <CustomModal activeItem={this.state.activeItem} toggle={this.toggle} onSave={this.handleEdit} />
            ) : null }
        </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId,
        token: state.auth.token,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
