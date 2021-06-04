import axios from "axios";
import {restfulApiConfig} from "./Config";
import {ConnectionAddData, GroupAddData} from "../interface";
import Cookies from "js-cookie";

export function Post(data: GroupAddData): Promise<{ error: string; data: any }> {
    return axios.post(restfulApiConfig.apiURL + "/group", data, {
        headers: {
            'Content-Type': 'application/json',
            USER_TOKEN: Cookies.get('user_token'),
            ACCESS_TOKEN: Cookies.get('access_token'),
        }
    }).then(res => {
        return {
            error: "",
            data: res.data.group
        };
    }).catch(err => {
        console.log(err);
        return {
            error: err,
            data: null
        };
    })
}