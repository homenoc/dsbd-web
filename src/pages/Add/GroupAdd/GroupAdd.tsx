import React, {Fragment, useEffect} from "react";
import DashboardComponent from "../../../components/Dashboard/Dashboard";
import {Get} from "../../../api/Info";
import Cookies from "js-cookie";
import store, {RootState} from "../../../store";
import {clearInfos, clearTemplates} from "../../../store/action/Actions";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText, FormLabel,
    Grid, Radio, RadioGroup,
    TextField, Typography
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {
    StyledTextFieldLong, StyledTextFieldMedium,
    StyledTextFieldShort,
    StyledTextFieldVeryLong,
    StyledTextFieldVeryShort1
} from "../../../style";
import {ObjectShape} from "yup/lib/object";
import {LocalizationProvider} from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";
import {Post} from "../../../api/Group";

export default function GroupAdd() {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const infos = useSelector((state: RootState) => state.infos);

    const privacyPolicyURL = "https://www.homenoc.ad.jp/rules/privacy/";
    const usageURL = "https://www.homenoc.ad.jp/usage/";
    const feeURL = "https://www.homenoc.ad.jp/rules/fee/";

    useEffect(()=>{
        Get().then();
    },[])

    useEffect(() => {
        // info
        const tmpData = infos[infos.length - 1];

        if (tmpData.error != null || tmpData.data != null) {
            if (tmpData.error != null) {
                if (tmpData.error?.indexOf("[401]") !== -1) {
                    Cookies.remove('user_token');
                    Cookies.remove('access_token');
                    store.dispatch(clearInfos());
                    store.dispatch(clearTemplates());
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                    navigate('/login');
                } else {
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                }
            } else if (tmpData.data != null) {
                // add group
                if (tmpData.data.user?.group_id !== 0) {
                    navigate("/dashboard/add");
                }
            } else {
                console.log("Renew");
                Get().then();
                const date = new Date();
                enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
            }
        }
    }, [infos]);

    const validationSchema = Yup.lazy(values => {
        let obj: ObjectShape = {
            agree: Yup.bool().oneOf([true], '利用の規約に同意しないと次へ進めません。'),
            isMember: Yup.bool(),
            org: Yup.string()
                .required('Org is required')
                .max(255, 'Org must not exceed 255 characters'),
            org_en: Yup.string()
                .required('Org(English) is required')
                .max(255, 'Org(English) must not exceed 255 characters'),
            postcode: Yup.string()
                .required('PostCode is required')
                .min(8, 'PostCode must be at least 8 characters')
                .max(8, 'PostCode must not exceed 8 characters'),
            address: Yup.string()
                .required('Address is required')
                .min(6, 'Address must be at least 6 characters')
                .max(255, 'Address must not exceed 255 characters'),
            address_en: Yup.string()
                .required('Address(English) is required')
                .min(6, 'Address(English) must be at least 6 characters')
                .max(255, 'Address(English) must not exceed 255 characters'),
            tel: Yup.string()
                .required('Tel is required')
                .min(6, 'Tel must be at least 6 characters')
                .max(30, 'Tel must not exceed 30 characters'),
            country: Yup.string()
                .required('Country is required')
                .min(2, 'Country must be at least 2 characters')
                .max(40, 'Country must not exceed 40 characters'),
            contract: Yup.string()
                .required('通知方法を選択してください'),
            is_student: Yup.bool(),
            student_expired: Yup.date(),
        }
        if (!values.isMember) {
            obj["question1"] = Yup.string()
                .min(2, '2文字以上入力してください。')
            obj["question2"] = Yup.string()
                .min(10, '10文字以上入力してください。')
            obj["question3"] = Yup.string()
                .min(2, '2文字以上入力してください。')
            obj["question4"] = Yup.string()
                .min(2, '2文字以上入力してください。')
        }

        return Yup.object().shape(obj)
    });

    const {register, control, handleSubmit, formState: {errors}, watch} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            agree: false,
            isMember: false,
            question1: "",
            question2: "",
            question3: "",
            question4: "",
            org: "",
            org_en: "",
            postcode: "",
            address: "",
            address_en: "",
            tel: "",
            country: "",
            contract: "E-Mail",
            is_student: false,
            student_expired: new Date()
        }
    });
    const isMember = watch('isMember');
    const is_student = watch('is_student');
    const onSubmit = (data: any, e: any) => {
        console.log(data, e)
        // check question item
        let question: string;
        let request: any = {
            agree: data.agree,
            student: data.is_student,
            org: data.org,
            org_en: data.org_en,
            postcode: data.postcode,
            address: data.address,
            address_en: data.address_en,
            tel: data.tel,
            country: data.country,
            contract: data.contract,
            student_expired: data.student_expired
        };

        if (data.isExist) {
            question = "---------既存ユーザ---------\n\n" + data.question1
        } else {
            question = "1. どこで当団体のことを知りましたか？\n" + data.question1 + "\n\n" +
                "2. どのような用途で当団体のネットワークに接続しますか？\n" + data.question2 + "\n\n" +
                "3. アドレスを当団体から割り当てる必要はありますか？\n" + data.question3 + "\n\n" +
                "4. 情報発信しているSNS(Twitter,Facebook)やWebサイト、GitHub、成果物などがありましたら教えてください。\n" + data.question4;
        }
        request.question = question;

        console.log("OK");
        Post(request).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                Get().then();
                navigate("/dashboard/add");
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
        })
        enqueueSnackbar('OK', {variant: "success"});
        navigate("/dashboard/add");
    };
    const onError = (errors: any, e: any) => {
        console.log(errors, e)
        enqueueSnackbar("入力した内容を確認してください。", {variant: "error"});
    };


    return (
        <DashboardComponent title="Group情報の申請">
            <Fragment>
                <Grid container spacing={3}>
                    <br/>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel>0. 利用規約の同意</FormLabel>
                            <br/>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary"
                                            onClick={() => window.open(feeURL, "_blank")}>
                                        会費について
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button variant="contained" color="primary"
                                            onClick={() => window.open(usageURL, "_blank")}>
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
                                control={<Controller
                                    control={control}
                                    name="agree"
                                    render={({field: {onChange}}) => (
                                        <Checkbox
                                            color="primary"
                                            onChange={e => onChange(e.target.checked)}
                                        />
                                    )}/>
                                }
                                label={
                                    <Typography color={errors.agree ? 'error' : 'inherit'}>
                                        利用規約に同意する
                                    </Typography>
                                }
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.agree ? '(' + errors.agree.message + ')' : ''}
                            </Typography>
                            <br/>
                        </FormControl>
                        <FormControl component="fieldset">
                            <FormLabel>1. 申請内容</FormLabel>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <FormLabel>1.0. 既存会員ですか？</FormLabel>
                                    <Typography variant="subtitle1" gutterBottom component="div">
                                        既存会員の方は、こちらのチェックボックスを選択してください。
                                    </Typography>
                                </Grid>
                            </Grid>
                            <FormControlLabel
                                control={<Controller
                                    control={control}
                                    name="isMember"
                                    render={({field: {onChange}}) => (
                                        <Checkbox
                                            color="primary"
                                            onChange={e => {
                                                onChange(e.target.checked)
                                            }}
                                        />
                                    )}/>
                                }
                                label={<Typography>私は既存会員です</Typography>}
                            />
                        </FormControl>
                        <br/>
                        {
                            !isMember &&
                            <div>
                                <FormControl component="fieldset">
                                    <FormLabel>1.1. どこで当団体のことを知りましたか？</FormLabel>
                                    <Typography variant="subtitle1" gutterBottom component="div">
                                        当団体の運営委員より紹介を受けた方は紹介者の名前を記入してください。
                                    </Typography>
                                    <StyledTextFieldVeryLong
                                        id="question1"
                                        // name="question1"
                                        label="question1"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        {...register('question1')}
                                        error={!!errors.question1}
                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.question1?.message}
                                    </Typography>
                                </FormControl>
                                <br/>
                                <FormControl component="fieldset">
                                    <FormLabel>1.2. どのような用途で当団体のネットワークに接続しますか？</FormLabel>
                                    <Typography variant="subtitle1" gutterBottom component="div">
                                        例) 研究目的、勉強、自宅サーバ用途（商用利用は不可）[10文字以上]
                                    </Typography>
                                    <StyledTextFieldVeryLong
                                        id="question2"
                                        label="question2"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        {...register('question2')}
                                        error={!!errors.question2}

                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.question2?.message}
                                    </Typography>
                                </FormControl>
                                <br/>
                                <FormControl component="fieldset">
                                    <FormLabel>1.3. アドレスを当団体から割り当てる必要はありますか？</FormLabel>
                                    <Typography variant="subtitle1" gutterBottom component="div">
                                        PIアドレスやAS番号をお持ちの方は、それらをご利用いただくことも可能です。
                                    </Typography>
                                    <StyledTextFieldVeryLong
                                        id="question3"
                                        label="question3"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        {...register('question3')}
                                        error={!!errors.question3}

                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.question3?.message}
                                    </Typography>
                                </FormControl>
                                <br/>
                                <FormControl component="fieldset">
                                    <FormLabel>1.4. 情報発信しているSNS(Twitter,Facebook)やWebサイト、
                                        GitHub、成果物などがありましたら教えてください。</FormLabel>
                                    <Typography variant="subtitle1" gutterBottom component="div">
                                        (発信しているコンテンツなどがなければ、「なし」とお答えください)
                                    </Typography>
                                    <StyledTextFieldVeryLong
                                        id="question4"
                                        label="question4"
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                        {...register('question4')}
                                        error={!!errors.question4}

                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.question4?.message}
                                    </Typography>
                                </FormControl>
                            </div>
                        } {
                        isMember &&
                        <FormControl component="fieldset">
                            <FormLabel>1.1. 登録者の名前と既存のサービスコードを記入してください</FormLabel>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                登録者の名前と既存のサービスコードを記入してください。
                            </Typography>
                            <StyledTextFieldVeryLong
                                id="question1"
                                // name="question1"
                                label="question1"
                                multiline
                                rows={4}
                                variant="outlined"
                                {...register('question1')}
                                error={!!errors.question1}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.question1?.message}
                            </Typography>
                        </FormControl>
                    }
                        <br/>
                        <FormControl component="fieldset">
                            <FormLabel>2. 組織情報</FormLabel>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                個人利用で特に組織名がない方は名前をご記入ください。
                                JPNICに登録する情報を記入してください。
                            </Typography>
                            <br/>
                            <Grid container spacing={3}>
                                <Grid item xs={6}>
                                    <StyledTextFieldShort
                                        id="org"
                                        label="組織名"
                                        multiline
                                        variant="outlined"
                                        {...register('org')}
                                        error={!!errors.org}
                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.org?.message}
                                    </Typography>
                                    {/*</Grid>*/}
                                    {/*<Grid item xs={6}>*/}
                                    <StyledTextFieldShort
                                        id="org_en"
                                        label="組織名(英語)"
                                        multiline
                                        variant="outlined"
                                        {...register('org_en')}
                                        error={!!errors.org_en}
                                    />
                                    <Typography variant="inherit" color="textSecondary">
                                        {errors.org_en?.message}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <StyledTextFieldVeryShort1
                                id="postcode"
                                label="郵便番号"
                                multiline
                                variant="outlined"
                                {...register('postcode')}
                                error={!!errors.postcode}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.postcode?.message}
                            </Typography>
                            <StyledTextFieldLong
                                id="address"
                                label="住所(日本語)"
                                multiline
                                variant="outlined"
                                {...register('address')}
                                error={!!errors.address}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.address?.message}
                            </Typography>
                            <StyledTextFieldLong
                                id="address_en"
                                label="住所(英語)"
                                multiline
                                variant="outlined"
                                {...register('address_en')}
                                error={!!errors.address_en}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.address_en?.message}
                            </Typography>
                            <StyledTextFieldMedium
                                id="tel"
                                label="電話番号"
                                multiline
                                variant="outlined"
                                {...register('tel')}
                                error={!!errors.tel}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.tel?.message}
                            </Typography>
                            <StyledTextFieldMedium
                                id="country"
                                label="居住国"
                                multiline
                                variant="outlined"
                                {...register('country')}
                                error={!!errors.country}
                            />
                            <Typography variant="inherit" color="textSecondary">
                                {errors.country?.message}
                            </Typography>
                        </FormControl>
                        <br/>
                        <FormControl component="fieldset">
                            <FormLabel>3. 契約書</FormLabel>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                当団体は電気通信事業者として届出を行っておりますため、利用開始時に電気通信事業法 第26条2（書面の交付義務）に基づき、
                                ご利用内容をお知らせいたしますので、ご希望の交付方法をお知らせください。
                            </Typography>
                            <FormHelperText>
                                {errors?.contract && errors?.contract.message}
                            </FormHelperText>
                            <Controller
                                name="contract"
                                control={control}
                                render={({field, fieldState}) => (
                                    <RadioGroup
                                        aria-label="gender"
                                        onChange={(e) => {
                                            field.onChange(e.target.value)
                                        }}
                                        value={field.value === undefined ? '' : field.value}>
                                        <FormControlLabel value="E-Mail" control={<Radio color="primary"/>}
                                                          label="電子交付を希望する"/>
                                        <FormControlLabel value="Air Mail" control={<Radio color="primary"/>}
                                                          label="書面の郵送を希望する"/>
                                    </RadioGroup>
                                )}
                            />
                        </FormControl>
                        <br/>
                        <FormControl component="fieldset">
                            <FormLabel>4. 学生</FormLabel>
                            <Typography variant="subtitle1" gutterBottom component="div">
                                貴団体の会員が<b>全員学生の場合</b>は、規約により会費を無料とさせていただきます。
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Controller
                                        control={control}
                                        name="is_student"
                                        render={({field: {onChange}}) => (
                                            <Checkbox
                                                color="primary"
                                                onChange={e => onChange(e.target.checked)}
                                            />
                                        )}/>
                                }
                                label={
                                    <Typography color={errors.is_student ? 'error' : 'inherit'}>
                                        私は学生です
                                    </Typography>
                                }
                            />
                            {
                                is_student &&
                                <div>
                                    <br/>
                                    <div>確認のため在学を証明するもの（学生証）を提出していただく場合もありますが、ご了承ください。</div>
                                    <Box sx={{width: 200}}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                            <br/>
                                            <Controller
                                                name="student_expired"
                                                control={control}
                                                render={({
                                                             field: {onChange, value},
                                                             fieldState: {error, invalid}
                                                         }) => (
                                                    <DatePicker
                                                        label="Date of Student Expired"
                                                        disablePast
                                                        value={value}
                                                        onChange={(value) =>
                                                            onChange(moment(value).format("YYYY-MM-DD"))
                                                        }
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                )}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </div>
                            }
                        </FormControl>
                    </Grid>
                    <br/>
                </Grid>
                <br/>
                <br/>
                <Box mt={3}>
                    <Button variant="contained" onClick={handleSubmit(onSubmit, onError)}>
                        申請する
                    </Button>
                </Box>
            </Fragment>
        </DashboardComponent>
    )
}
