import {
    GET_INFOS_REQUEST,
    GET_INFOS_SUCCESS,
    GET_INFOS_FAILURE,
    GET_TEMPLATES_FAILURE,
    GET_TEMPLATES_SUCCESS,
    GET_TEMPLATES_REQUEST, CLEAR_INFOS
} from "./action/Actions"
import {InfoData, TemplateData} from "../interface";

const initialInfoState = {
    isFetching: false,
}

export type RootInfoState = {
    isFetching: boolean,
    data?: InfoData,
    lastUpdated?: string,
    error?: string
}

const infos = (state = [initialInfoState], action: any): RootInfoState[] => {
    switch (action.type) {
        case GET_INFOS_REQUEST:
            return [
                ...state,
                {
                    isFetching: true,
                }
            ]
        case GET_INFOS_SUCCESS:
            return [
                ...state,
                {
                    isFetching: false,
                    data: action.data,
                    lastUpdated: action.receivedAt
                }
            ]
        case GET_INFOS_FAILURE:
            return [
                ...state,
                {
                    isFetching: false,
                    error: action.error
                }
            ]
        case CLEAR_INFOS:
            return [{isFetching: false}]
        default:
            return state
    }
}

export default infos