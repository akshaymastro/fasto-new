import * as userApis from '../../services/user';
import * as userActions from '../actionTypes/userActionTypes';

export const userLogin = (params) => async (dispatch) => {
  const response = await userApis.userLogin(params);

  dispatch({
    type: userActions.LOGIN_USER,
    payload: response?.data,
  });
  return response?.data;
};

export const sendOtp = (params) => async (dispatch) => {
  const response = await userApis.sendOtp(params);
  console.log(response, 'responseeee');
  dispatch({
    type: userActions.SEND_OTP,
    payload: response?.data?.data,
  });
  return response?.data?.data;
};

export const setUserDetail = (params) => async (dispatch) => {
  dispatch({
    type: userActions.SET_USER,
    payload: params,
  });
};
