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

const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://steam-sale-sniffer.herokuapp.com' : 'http://localhost:8000'
const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wishlistitems: [],
            modal: false,
            activeItem: {
                game: '',
                user: +localStorage.getItem('userId'),
                id: '',
            },    
        }
    }

    componentDidMount() {
        if (this.props.token) {
            axios.defaults.headers = {
                "Content-Type": "application/json",
                'Authorization': `Token ${this.props.token}`
            }
            axios
                .get(`${BASE_URL}/api/collections/${this.state.activeItem.user}/`)
                .then( res => {
                    this.setState({wishlistitems: res.data.filter(game => game.purchased)})
                })
                // .catch( err => console.log(err) )
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.token !== prevProps.token) {
            axios.defaults.headers = {
                "Content-Type": "application/json",
                'Authorization': `Token ${this.props.token}`
            }
            axios
                .get(`${BASE_URL}/api/collections/${localStorage.getItem('userId')}/`)
                .then( res => {
                    this.setState({wishlistitems: res.data.filter(game => game.purchased)})
                })
                // .catch( err => console.log(err) )
        }
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
        axios.defaults.headers = {
            "Content-Type": "application/json",
            'Authorization': `Token ${this.props.token}`
        }
        axios
            .delete(`${BASE_URL}/api/wishlistitems/${item_id}/`)
            // .then(res => { console.log('Success') })
            // .catch(err => { console.log('State of item during error'); console.log(err);})
        let updated_wishlist = this.state.wishlistitems.filter(e => e.id !== item_id && e.purchased)
        this.setState({ wishlistitems: updated_wishlist })
    }

    render() {
        const { wishlistitems } = this.state;

        let tableHeaders = (
            <div className="row">
              <div className="offset-lg-1 col-lg-10 col-12">
                <div className='row'>
                <div className='col-lg-5 col-md-5 col-sm-4 col-3 game-title collection-header table-header text'>
                  <strong>Game Title</strong>
                </div>
                <div className={`col-sm-2 col-1 game-price table-header curr-header text collection-price1`} id='price1'><strong>Purchase Price</strong></div>
                <div className={`col-2 game-price table-header base-header text collection-price2`} id='price2'><strong>Base Price</strong></div>
                </div>
              </div>
            </div>
        )

        return (
        <div className="App background">
            <h1>My Collection</h1>
            <div className="container">
            { wishlistitems.length && tableHeaders }
            <div className="row">
                <div className="offset-lg-1 col-lg-10 col-12">
                { this.state.wishlistitems.map(item => {
                    let { game } = item
                    let menu = (
                        <Menu>
                            <Menu.Item>
                                <a href="/" id={game.id} onClick={(e) => { e.preventDefault(); this.handleDelete(item.id)} }>Remove</a>
                            </Menu.Item>
                        </Menu>
                    )
                    let imgSrc = (id) => `https://steamcdn-a.akamaihd.net/steam/apps/${id}/capsule_184x69.jpg`
                    let gameTitle = (vw > 500 || game.title.length <= 35) ? game.title : 
                                        game.title.slice(0,35).split(" ").slice(0, -1).join(" ")+"..."
                    let steamUrl = `https://store.steampowered.com/app/${game.steam_id}/`
                    return (
                    <div key={game.id} id='collection'>
                        <div className="row game" key={game.id}>
                            <img className='game-img' alt={game.title} height={55} width={149} src={imgSrc(game.steam_id)} />
                            <div className={`col-lg-5 col-md-5 col-sm-4 col-3 game-title text`}>
                                <a href={steamUrl}>{gameTitle}</a>
                            </div>

                            <div className={`col-sm-2 col-1 game-price text collection-price1`} id='price1'>
                                ${item.target_price}
                            </div>

                            <div className={`col-2 game-price text collection-price2`} id='price2'>
                                ${game.curr_price}
                            </div>

                            <div className="col-0 text cog">
                                <Dropdown overlay={menu}>
                                    <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                        <FontAwesomeIcon icon={faCog} size='1x' style={{color: '#fff'}} />
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    )
                })}
                </div>
            </div>

            { this.state.wishlistitems.length === 0 && 
                <div className='row game blank-search text'>
                    <div>You haven't add any games to your Collection!</div>
                </div>  
            }

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
