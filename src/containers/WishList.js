// import { withRouter } from 'react-router-dom'
import React, { Component } from 'react';
import '../App.css';
import CustomModal from  '../components/Modal';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Menu, Dropdown } from 'antd';


import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'steam-sale-sniffer.herokuapp.com' : 'localhost:8000'

// const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
// const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wishlistitems: [],
            modal: false,
            activeItem: {
                game: '',
                user: +localStorage.getItem('userId'),
                target_price: "",
                purchased: false,
                id: '',
            },    
        }
    }

    componentDidMount() {
        
        axios
            .get(`http://${BASE_URL}/api/wishlists/${this.state.activeItem.user}/`)
            .then( res => {
                console.log(res.data.filter(game => !game.purchased))
                this.setState({wishlistitems: res.data.filter(game => !game.purchased)})
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
    }

    handleDelete = (item_id) => {
        axios
            .delete(`http://${BASE_URL}/api/wishlistitems/${item_id}/`)
            .then(res => { console.log() })
            .catch(err => { console.log(err);})
        let updated_wishlist = this.state.wishlistitems.filter(e => e.id !== item_id && !e.purchased)
        this.setState({ wishlistitems: updated_wishlist })
    }

    handleEdit = (item) => {
        // item = { ...item, target_price: parseFloat(item.target_price) }
        axios
            .put(`http://${BASE_URL}/api/wishlistitems/${item.id}/`, item)
            .then(res => { console.log(item) })
            .catch(err => { console.log('State of item during error'); console.log(item); console.log(err);})
        let updated_wishlist = this.state.wishlistitems.map(e => {
            if (e.id === item.id) {
                return {
                    ...e, 
                    target_price: item.target_price
                }
            } else { 
                return e
            }
        })
        this.setState({ wishlistitems: updated_wishlist })
        this.toggle();
    }

    addToCollection = (item) => {
        let purchased = { ...item, purchased: true, game: item.game.id, user: +this.state.activeItem.user }
        axios
            .put(`http://${BASE_URL}/api/wishlistitems/${item.id}/`, purchased)
            .then(res => { console.log() })
            .catch(err => { console.log(err);})
        let updated_wishlist = this.state.wishlistitems.filter(e => e.id !== item.id && !e.purchased)
        this.setState({ wishlistitems: updated_wishlist })
        // console.log(item)
        // console.log(purchased)
        // console.log(this.state.wishlistitems)
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
                                <a href="/" 
                                    onClick={(e) => {e.preventDefault(); this.toggle(item.id, game.id)} }
                                >Edit</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a href="/" id={game.id} 
                                    onClick={(e) => {e.preventDefault(); this.handleDelete(item.id)}}
                                >Remove</a>
                            </Menu.Item>
                            <Menu.Item>
                                <a href="/" id={game.id} 
                                    onClick={(e) => {e.preventDefault(); this.addToCollection(item)}}
                                >Mark as Purchased</a>
                            </Menu.Item>
                        </Menu>
                    )
                    let saleIndicator = +game.curr_price <= +item.target_price ? 'on_sale' : ''
                    let checkCircle   = +game.curr_price <= +item.target_price ? 
                                (<FontAwesomeIcon icon={faCheckCircle} size='2x' style={{color: '#90b90c'}} />) : 
                                null
                    return (
                    <div key={game.id}>
                    <div className={`row game`} key={game.id}>
                        <img className="offset-0" height="55" alt=""
                        src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.steam_id}/capsule_184x69.jpg`} 
                        />
                        <div className="col-md-5 game-title text ">{game.title}</div>
                        <div className={`col-md-2 game-price text`}>
                            ${item.target_price}
                        </div>
                        <div className={`offset-0 col-md-2 game-price text ${saleIndicator}`}> 
                            <div>{checkCircle} ${game.curr_price}</div>
                        </div>
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
