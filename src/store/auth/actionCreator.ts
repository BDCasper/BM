import { Dispatch } from "@reduxjs/toolkit"
import api from "../../api"
import { ILoginRequest, ILoginResponse } from "../../api/auth/authTypes"
import { loginStart, loginSucess, loginFailure, logoutSuccess,loadProfileStart, loadProfileFailure, loadProfileSucess } from "./authReducer"

export const loginUser =
  (data: ILoginRequest) =>
    async (dispatch: Dispatch<any>): Promise<void> => {
      try {
        dispatch(loginStart())

        const res = await api.auth.login(data)

        dispatch(loginSucess(res.data.accessToken))
        
      } catch (e: any) {
        console.error(e)

        dispatch(loginFailure(e.message))
      }
    }
