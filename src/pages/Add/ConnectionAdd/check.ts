import {ConnectionAddData, TemplateData} from "../../../interface";

export function check(serviceID: number, data: ConnectionAddData, template: TemplateData): string {
    // check connection template id
    if (serviceID === 0) {
        return "service codeが選択されていません。";
    }

    if (data.connection_template_id === 0) {
        return "接続方法が選択されていません。";
    }

    // check
    // if(data.)

    // if no error
    return "";
}
