import React, {Dispatch, SetStateAction, useEffect} from "react";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    TextField,
} from "@material-ui/core";
import {
    DefaultGroupAddData, GroupAddData,
    UserData,
} from "../../../interface";
import useStyles from "../styles";
import {check, checkQuestion} from "./check";
import {useSnackbar} from "notistack";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {Post} from "../../../api/Group";
import {useHistory} from "react-router-dom";
import {Get} from "../../../api/Info";

export default function GroupAddDialogs(props: {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    userData: UserData
}) {
    const {open, setOpen, userData} = props
    const [data, setData] = React.useState(DefaultGroupAddData);
    const [question, setQuestion] = React.useState<{
        question1: string,
        question2: string,
        question3: string,
        question4: string
    }>(
        {
            question1: "",
            question2: "",
            question3: "",
            question4: ""
        }
    );
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    useEffect(() => {
        if (open && userData.group_id !== 0) {
            enqueueSnackbar('登録済みです。', {variant: "error"});
            history.push("/dashboard")
        }
    }, [open]);

    const request = () => {
        // check question item
        const errQuestion = checkQuestion(question);
        if (errQuestion !== "") {
            console.log("NG: " + errQuestion)
            enqueueSnackbar(errQuestion, {variant: "error"});
            return;
        }

        let sendData = data;
        sendData.question = "1. どこで当団体のことを知りましたか？\n" + question.question1 + "\n\n" +
            "2. どのような用途で当団体のネットワークに接続しますか？\n" + question.question2 + "\n\n" +
            "3. アドレスを当団体から割り当てる必要はありますか？\n" + question.question3 + "\n\n" +
            "4. 情報発信しているSNS(Twitter,Facebook)やWebサイト、GitHub、成果物などがありましたら教えてください。\n" + question.question4;
        console.log(sendData);

        const err = check(sendData);
        if (err === "") {
            console.log("OK");
            Post(sendData).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                    setOpen(false);
                    Get().then();
                } else {
                    console.log(res.error);
                    enqueueSnackbar(String(res.error), {variant: "error"});
                }
            })
            enqueueSnackbar('OK', {variant: "success"});
        } else {
            console.log("NG: " + err)
            enqueueSnackbar(err, {variant: "error"});
        }
    }

    return (
        <div>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    Group情報の追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <br/>
                        <Grid item xs={12}>
                            <TermAgreeAdd key={"term_agree_add_select"} data={data} setData={setData}/>
                            <br/>
                            <QuestionAdd key={"connection_add_type"} data={question} setData={setQuestion}/>
                            <br/>
                            <OrgInfoAdd key={"org_info_add"} data={data} setData={setData}/>
                            <br/>
                            <ContractSelectAdd key={"contact_select_add"} data={data} setData={setData}/>
                            <br/>
                            <StudentAdd key={"contact_select_add"} data={data} setData={setData}/>
                        </Grid>
                        <br/>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={() => request()} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function TermAgreeAdd(props: {
    data: GroupAddData
    setData: Dispatch<SetStateAction<GroupAddData>>
}) {
    const {data, setData} = props;
    const [checkBox, setCheckBox] = React.useState(false);
    const privacyPolicyURL = "https://www.homenoc.ad.jp/rules/privacy/";
    const usageURL = "https://www.homenoc.ad.jp/usage/";
    const feeURL = "https://www.homenoc.ad.jp/rules/fee/";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBox(event.target.checked);
        setData({...data, agree: event.target.checked});
    }

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">0. 利用規約の同意</FormLabel>
                <br/>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={() => window.open(feeURL, "_blank")}>
                            会費について
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" onClick={() => window.open(usageURL, "_blank")}>
                            実験ネットワーク利用規約
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary"
                                onClick={() => window.open(privacyPolicyURL, "_blank")}>
                            プライバシーポリシー
                        </Button>
                    </Grid>
                </Grid>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkBox}
                            onChange={handleChange}
                            name="monitor"
                            color="primary"
                        />
                    }
                    label="利用規約に同意します"
                />
            </FormControl>
        </div>
    )
}

export function QuestionAdd(props: {
    data: {
        question1: string,
        question2: string,
        question3: string,
        question4: string
    }
    setData: Dispatch<SetStateAction<{
        question1: string,
        question2: string,
        question3: string,
        question4: string
    }>>
}) {
    const {data, setData} = props;
    const classes = useStyles();

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">1. どこで当団体のことを知りましたか？</FormLabel>
                <div>当団体の運営委員より紹介を受けた方は紹介者の名前を記入してください。[10文字以上]</div>
                <br/>
                <TextField
                    className={classes.formVeryLong}
                    id="question1"
                    label=""
                    multiline
                    rows={4}
                    value={data.question1}
                    onChange={event => {
                        setData({...data, question1: event.target.value});
                    }}
                    variant="outlined"
                />
                <br/>
                <FormLabel component="legend">2. どのような用途で当団体のネットワークに接続しますか？</FormLabel>
                <div>例) 研究目的、勉強、自宅サーバ用途（商用利用は不可）[300文字以上]</div>
                <br/>
                <TextField
                    className={classes.formVeryLong}
                    id="question2"
                    label=""
                    multiline
                    rows={4}
                    inputProps={{
                        minLength: 300
                    }}
                    value={data.question2}
                    onChange={event => {
                        setData({...data, question2: event.target.value});
                    }}
                    variant="outlined"
                />
                <br/>
                <FormLabel component="legend">3. アドレスを当団体から割り当てる必要はありますか？</FormLabel>
                <div>PIアドレスやASS番号をお持ちの方は、それらをご利用いただくことも可能です。[5文字以上]</div>
                <br/>
                <TextField
                    className={classes.formVeryLong}
                    id="question3"
                    label=""
                    multiline
                    rows={4}
                    value={data.question3}
                    onChange={event => {
                        setData({...data, question3: event.target.value});
                    }}
                    variant="outlined"
                />
                <br/>
                <FormLabel component="legend">4.
                    情報発信しているSNS(Twitter,Facebook)やWebサイト、GitHub、成果物などがありましたら教えてください。</FormLabel>
                <div>[20文字以上]</div>
                <br/>
                <TextField
                    className={classes.formVeryLong}
                    id="question4"
                    label=""
                    multiline
                    rows={4}
                    value={data.question4}
                    onChange={event => {
                        setData({...data, question4: event.target.value});
                    }}
                    variant="outlined"
                />
            </FormControl>
        </div>
    )
}

export function OrgInfoAdd(props: {
    data: GroupAddData
    setData: Dispatch<SetStateAction<GroupAddData>>
}) {
    const {data, setData} = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <FormLabel component="legend">5. 組織情報</FormLabel>
            <div>個人利用で特に組織名がない方は名前をご記入ください。</div>
            <br/>
            <div>JPNICに登録する情報を記入してください。</div>
            <br/>
            <form className={classes.rootForm} noValidate autoComplete="off">
                <TextField
                    className={classes.formShort}
                    required
                    id="org"
                    label="組織名"
                    value={data.org}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, org: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formShort}
                    required
                    id="org_en"
                    label="組織名(英語)"
                    value={data.org_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, org_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formVeryShort}
                    required
                    id="postcode"
                    label="郵便番号"
                    value={data.postcode}
                    variant="outlined"
                    inputProps={{
                        maxLength: 8,
                    }}
                    onChange={event => {
                        setData({...data, postcode: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formLong}
                    required
                    id="address"
                    label="住所(日本語)"
                    value={data.address}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, address: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formLong}
                    required
                    id="address_en"
                    label="住所(英語)"
                    value={data.address_en}
                    variant="outlined"
                    inputProps={{
                        maxLength: 128,
                    }}
                    onChange={event => {
                        setData({...data, address_en: event.target.value});
                    }}
                />
                <br/>
                <TextField
                    className={classes.formMedium}
                    required
                    id="tel"
                    label="電話番号"
                    value={data.tel}
                    variant="outlined"
                    onChange={event => {
                        setData({...data, tel: event.target.value});
                    }}
                />
                <TextField
                    className={classes.formMedium}
                    required
                    id="country"
                    label="居住国"
                    value={data.country}
                    variant="outlined"
                    onChange={event => {
                        setData({...data, country: event.target.value});
                    }}
                />
            </form>
        </div>
    );
}


export function ContractSelectAdd(props: {
    data: GroupAddData
    setData: Dispatch<SetStateAction<GroupAddData>>
}) {
    const {data, setData} = props;

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">6. 契約書</FormLabel>
                <br/>
                <div>当団体は電気通信事業者として届出を行っておりますため、利用開始時に電気通信事業法 第26条2（書面の交付義務）に基づき、
                    ご利用内容をお知らせいたしますので、ご希望の交付方法をお知らせください。
                </div>
                <RadioGroup row aria-label="position" name="position" defaultValue="top"
                            onChange={(event) => {
                                setData({...data, contract: event.target.value})
                            }}>
                    <FormControlLabel value="E-Mail" control={<Radio color="primary"/>} label="電子交付を希望する"/>
                    <FormControlLabel value="Air Mail" control={<Radio color="primary"/>} label="書面の郵送を希望する"/>
                </RadioGroup>
            </FormControl>
        </div>
    )
}

export function StudentAdd(props: {
    data: GroupAddData
    setData: Dispatch<SetStateAction<GroupAddData>>
}) {
    const {data, setData} = props;
    const [checkBox, setCheckBox] = React.useState(false);
    const nowDate = new Date()
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(nowDate);

    useEffect(() => {
        let tmpEndDate = nowDate;
        tmpEndDate.setDate(tmpEndDate.getDate() + 30);
        setSelectedDate(tmpEndDate);
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBox(event.target.checked);
        setData({...data, student: event.target.checked});
    }

    const handleStudentExpiredChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date !== null) {
            setData({
                ...data, student_expired: date.getFullYear() + '-' + ('00' + (date.getMonth() + 1)).slice(-2) +
                    '-' + ('00' + (date.getDate())).slice(-2)
            });
        }
    };


    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">7. 学生</FormLabel>
                <br/>
                <div>貴団体の会員が<b>全員学生の場合</b>は、規約により会費を無料とさせていただきます。</div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={checkBox}
                            onChange={handleChange}
                            name="monitor"
                            color="primary"
                        />
                    }
                    label="私は学生です"
                />
                {
                    checkBox &&
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <br/>
                        <div>確認のため在学を証明するもの（学生証）を提出していただく場合もありますが、ご了承ください。</div>
                        <br/>
                        <KeyboardDatePicker
                            required
                            margin="normal"
                            id="student_expired_date-picker-dialog"
                            label="卒業予定"
                            format="yyyy/MM/dd"
                            value={selectedDate}
                            onChange={handleStudentExpiredChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                }
            </FormControl>
        </div>
    )
}
