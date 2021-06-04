import axios from "axios";
import {restfulApiConfig} from "./Config";
import {ConnectionAddData} from "../interface";
import Cookies from "js-cookie";

export function Post(id: number, data: ConnectionAddData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/service/" + id + "/connection", data, {
        headers: {
            'Content-Type': 'application/json',
            USER_TOKEN: Cookies.get('user_token'),
            ACCESS_TOKEN: Cookies.get('access_token'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.service
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}