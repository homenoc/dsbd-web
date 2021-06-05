import {GroupAddData} from "../../../interface";

export function check(data: GroupAddData): string {
    // check agree
    if (!data.agree) {
        return "規約に同意されていません。";
    }

    // check question word count
    if (data.question.length > 310) {
        return "[項目1,項目2,項目3,項目4]質問欄の文字数が足りません。";
    }

    // check org info form
    if (data.org.length === 0) {
        return "1.2.1. 団体名が入力されていません。";
    }
    if (data.org_en.length === 0) {
        return "1.2.1. 団体名(English)が入力されていません。";
    }
    if (data.postcode.length === 0) {
        return "1.2.1. 郵便番号が入力されていません。";
    }
    if (data.address.length === 0) {
        return "1.2.1.住所が入力されていません。";
    }
    if (data.address_en.length === 0) {
        return "住所(English)が入力されていません。";
    }
    if (data.tel.length === 0) {
        return "電話番号が入力されていません。";
    }
    if (data.country.length === 0) {
        return "居住国が入力されていません。";
    }

    return "";
}
