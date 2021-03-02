import {combineReducers} from 'redux'
import userReducer from './SignInReducer'



export default combineReducers({
    user: userReducer
})