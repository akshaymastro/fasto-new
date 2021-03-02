import * as UserAction from '../actionTypes/userActionTypes'

const initialstate = {
    vikas: 0,
    UserData: 'Shubham U'
}

export default (state = initialstate, action) => {
    switch (action.type) {
        case UserAction.LOGIN_USER:
            return {
                ...state,
                user: action.payload
            }
        case UserAction.SEND_OTP:
            return {
                ...state,
                otp: action.payload
            }
        case UserAction.SET_USER:
            return {
                ...state,
                userDetail: action.payload
            }
        default:
            return state
    }
} 