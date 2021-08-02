import {GroupAddData} from "../../../interface";

export function check(data: GroupAddData): string {
    // check agree
    if (!data.agree) {
        return "規約に同意されていません。";
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

export function checkQuestion(data: {
    question1: string,
    question2: string,
    question3: string,
    question4: string
}): string {
    // check question1 word count
    if (data.question1.length < 10) {
        return "[項目1]「どこで当団体のことを知りましたか」の文字数が足りません。";
    }

    // check question2 word count
    if (data.question2.length < 300) {
        return "[項目2]「どのような用途で当団体のネットワークに接続しますか」の文字数が足りません。";
    }

    // check question3 word count
    if (data.question3.length < 5) {
        return "[項目3]「アドレスを当団体から割り当てる必要はありますか」の文字数が足りません。";
    }

    // check question2 word count
    if (data.question4.length < 20) {
        return "[項目4]「情報発信しているSNS(Twitter,Facebook)やWebサイト、GitHub、成果物などがありましたら教えてください」の文字数が足りません。";
    }

    return "";
}