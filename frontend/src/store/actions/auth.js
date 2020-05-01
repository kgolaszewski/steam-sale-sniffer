// Define all methods that will take place on receiving the actions from actionTypes.js 
import axios from 'axios'
import * as actionTypes from './actionTypes'

export const authStart   = () => { return { type: actionTypes.AUTH_START } }
export const authSuccess = (token) => { return { type: actionTypes.AUTH_SUCCESS, token: token } }
export const authFail    = (error) => { return { type: actionTypes.AUTH_FAIL, error: error } }

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('userId')
    return { type: actionTypes.AUTH_LOGOUT }
}

export const checkAuthTimeout = (expirationTime) => {
    return (dispatch) => {
        setTimeout(() => { dispatch(logout()) }, expirationTime * 1000)
    }
}

export const authLogin =  (username, password) => {
    return (dispatch) => {
        dispatch(authStart())
        const user = {
            username: username, 
            password: password
        }
        axios.post('http://localhost:8001/rest-auth/login/', user)
        .then(res => {
            const token = res.data.key
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
            const userId = res.data.user
            localStorage.setItem('token',          token)
            localStorage.setItem('expirationDate', expirationDate)
            localStorage.setItem('userId', userId)
            dispatch(authSuccess(token))
            dispatch(checkAuthTimeout(3600))
            // console.log(JSON.stringify(res))
            // this.props.history.push('/')
        })
        .catch(err => {dispatch(authFail(err)); console.log(err) })
    }
}

export const authCheckState = () => {
    return (dispatch) => {
        const token = localStorage.getItem('token')
        if (token === undefined) { 
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if ( expirationDate <= new Date() ) {
                dispatch(logout)
            } else {
                dispatch(authSuccess(token))
                dispatch(checkAuthTimeout( 
                    ( expirationDate.getTime()-new Date().getTime() ) / 1000 )
                )
            }
        }
    }
}

export const authSignup = (username, email, password1, password2) => {
    return (dispatch) => {
        dispatch(authStart())
        const user = {
            username:  username, 
            email:     email,
            password1: password1,
            password2: password2,
        }
        axios.post('http://localhost:8001/rest-auth/registration/', user)
        .then(res => {
            console.log('User POSTED to /rest-auth/registration')
            const token = res.data.key
            const expirationDate = new Date(new Date().getTime() + 3600 * 1000)
            localStorage.setItem('token',          token)
            localStorage.setItem('expirationDate', expirationDate)
            dispatch(authSuccess(token))
            dispatch(checkAuthTimeout(3600))
        })
        .catch(err => {dispatch(authFail(err)); console.log(err) })
    }
}