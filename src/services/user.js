import { client } from './config'



export const userLogin = async (params) => await client.post('/auth/login', params)
export const sendOtp = async (params) => await client.post('/auth/sendotp', params)