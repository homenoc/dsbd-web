import React, {Fragment, useEffect} from "react";
import DashboardComponent from "../../../components/Dashboard/Dashboard";
import {Get, GetTemplate} from "../../../api/Info";
import Cookies from "js-cookie";
import store, {RootState} from "../../../store";
import {clearInfos, clearTemplates} from "../../../store/action/Actions";
import {DefaultTemplateData, TemplateData} from "../../../interface";
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
    Grid, MenuItem, Radio, RadioGroup, Select,
    Typography
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {
    StyledFormControlFormSelect,
    StyledTextFieldLong,
} from "../../../style";
import {ObjectShape} from "yup/lib/object";
import {Post} from "../../../api/Connection";


export default function ConnectionAdd() {
    const {enqueueSnackbar} = useSnackbar();
    const [template, setTemplate] = React.useState<TemplateData>(DefaultTemplateData);
    const navigate = useNavigate();
    const infos = useSelector((state: RootState) => state.infos);
    const [serviceCode, setServiceCode] = React.useState("");
    const [serviceID, setServiceID] = React.useState(0);
    const [ipBGPRoute, setIPBGPRoute] = React.useState(false);
    const [ipv4BGPRoute, setIPv4BGPRoute] = React.useState(false);
    const [ipv6BGPRoute, setIPv6BGPRoute] = React.useState(false);
    const [isComment, setIsComment] = React.useState(false);
    const [isInternet, setIsInternet] = React.useState(false);


    useEffect(() => {
        Get().then();
        GetTemplate().then(res => {
            if (typeof res === "object") {
                setTemplate(res);
            } else {
                enqueueSnackbar(res, {variant: "error"});
                if (res.indexOf("[401]") !== -1) {
                    Cookies.remove('user_token');
                    Cookies.remove('access_token');
                    store.dispatch(clearInfos());
                    store.dispatch(clearTemplates());
                    enqueueSnackbar(res, {variant: "error"});
                    navigate('/login');
                }
            }
        })
    }, [])

    useEffect(() => {
        // info
        const tmpData = infos[infos.length - 1];

        if (tmpData.error !== undefined || tmpData.data != null) {
            if (tmpData.error !== undefined) {
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
                if (!(tmpData.data.service != null && tmpData.data.service?.filter(value => value.add_allow).length > 0)) {
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
            connection_template_id: Yup.number()
                .required('接続情報を選択してください')
                .moreThan(0, "接続情報を選択してください"),
            noc_id: Yup.number()
                .required('希望NOCを選択してください')
                .moreThan(0, "正しく選択してください"),
            monitor: Yup.bool(),
        }

        if (isComment) {
            obj["connection_comment"] = Yup.string()
                .required('その他の項目を入力してください')
        }
        if (isInternet) {
            obj["ntt_template_id"] = Yup.number()
                .required('希望NOCを選択してください')
                .moreThan(0, "正しく選択してください")
            obj["address"] = Yup.string()
                .required("終端先ユーザの市町村を入力してください")
            obj["term_ip"] = Yup.string()
                .required("終端アドレスを入力してください")
        }

        if (ipv4BGPRoute) {
            obj["ipv4_route_template_id"] = Yup.number()
                .required('IPv4経路広告方法を選択してください')
                .moreThan(0, "IPv4経路広告方法を選択してください")
        }
        if (ipv6BGPRoute) {
            obj["ipv6_route_template_id"] = Yup.number()
                .required('IPv4経路広告方法を選択してください')
                .moreThan(0, "IPv4経路広告方法を選択してください")
        }

        return Yup.object().shape(obj)
    });

    const {register, control, handleSubmit, formState: {errors}, watch} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            address: "",
            connection_template_id: 0,
            connection_comment: "",
            ipv4_route_template_id: 0,
            ipv6_route_template_id: 0,
            ntt_template_id: 0,
            noc_id: 0,
            term_ip: "",
            monitor: false
        }
    });
    const onSubmit = (data: any, e: any) => {
        console.log(data, e)
        let request: any = {
            connection_template_id: data.connection_template_id,
            noc_id: data.noc_id,
            monitor: data.monitor,
        };

        if (isComment) {
            request.connection_template_id = data.connection_template_id
        }
        if (isInternet) {
            request.ntt_template_id = data.ntt_template_id
            request.address = data.address
            request.term_ip = data.term_ip
        }

        if (ipv4BGPRoute) {
            request.ipv4_route_template_id = data.ipv4_route_template_id
        }
        if (ipv6BGPRoute) {
            request.ipv6_route_template_id = data.ipv6_route_template_id
        }

        // check
        if (serviceID <= 0) {
            enqueueSnackbar("サービスが指定されていません。", {variant: "error"});
            return
        }

        console.log("service_id: ", serviceID);
        console.log("send_data: ", request);

        Post(serviceID, request).then(res => {
            if (res.error === "") {
                console.log(res.data);
                enqueueSnackbar('Request Success', {variant: "success"});
                Get().then();
            } else {
                console.log(res.error);
                enqueueSnackbar(String(res.error), {variant: "error"});
            }
        })
    };

    const onError = (errors: any, e: any) => {
        console.log(errors, e);
        enqueueSnackbar("入力した内容を確認してください。", {variant: "error"});
    };

    const checkBgpRoute = (id: number) => {
        const dataExtra = infos[infos.length - 1]?.data?.service?.filter(item => item.id === id);
        console.log(dataExtra);
        if (dataExtra != null) {
            setIPBGPRoute(dataExtra[0].need_route);
            const dataIPv4 = dataExtra[0].ip?.filter(item => item.version === 4);
            if (dataIPv4 !== undefined && dataIPv4.length > 0) {
                setIPv4BGPRoute(true)
            }
            const dataIPv6 = dataExtra[0].ip?.filter(item => item.version === 6);
            if (dataIPv6 !== undefined && dataIPv6.length > 0) {
                setIPv6BGPRoute(true)
            }
        } else {
            enqueueSnackbar('Templateから情報が見つかりません。', {variant: "error"});
        }
    }

    return (
        <DashboardComponent title="接続情報の追加">
            <Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("service_code")}>
                            <FormLabel component="legend">1. 接続情報を登録するサービスコードを選択してください。</FormLabel>
                            <div>接続情報を登録するサービスコードを以下からお選びください。</div>
                            <Select
                                labelId="service_code"
                                id="service_code"
                                onChange={(event) => {
                                    checkBgpRoute(Number(event.target.value));
                                    const tmpService = infos[infos.length - 1]?.data?.service?.filter(data => data.id === Number(event.target.value));
                                    if (tmpService != null) {
                                        setServiceCode(tmpService[0].service_type);
                                    }
                                    setServiceID(Number(event.target.value));
                                }}
                            >
                                {
                                    infos[infos.length - 1]?.data?.service?.filter(tmp => tmp.add_allow).map((row, index) => (
                                        <MenuItem key={"service_code" + index}
                                                  value={row.id}>{row.service_id}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {
                        ipBGPRoute &&
                        <Grid item xs={12}>
                            <FormLabel component="legend">1.1. BGPで当団体から広報する経路種類を選択してください。</FormLabel>

                            {
                                ipBGPRoute && ipv4BGPRoute &&
                                <StyledFormControlFormSelect>
                                    <FormLabel component="legend">IPv4 BGP広報経路</FormLabel>
                                    <FormHelperText>
                                        {errors?.ipv4_route_template_id && errors.ipv4_route_template_id?.message}
                                    </FormHelperText>
                                    <Controller
                                        name="ipv4_route_template_id"
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <Select
                                                aria-label="gender"
                                                onChange={(e) => {
                                                    const value = Number(e.target.value)
                                                    if (!isNaN(value)) {
                                                        field.onChange(value)
                                                    }
                                                }}
                                                value={field.value === undefined ? '' : field.value}
                                            >
                                                {
                                                    template.ipv4_route?.map((row, index) => (
                                                        <MenuItem key={"ipv4_route_template_id_" + index}
                                                                  value={row.ID}>{row.name}</MenuItem>
                                                    ))

                                                }
                                            </Select>
                                        )}
                                    />
                                </StyledFormControlFormSelect>
                            }
                            {
                                ipBGPRoute && ipv6BGPRoute &&
                                <StyledFormControlFormSelect>
                                    <FormLabel component="legend">IPv6 BGP広報経路</FormLabel>
                                    <FormHelperText>
                                        {errors?.ipv6_route_template_id && errors.ipv6_route_template_id?.message}
                                    </FormHelperText>
                                    <Controller
                                        name="ipv6_route_template_id"
                                        control={control}
                                        render={({field, fieldState}) => (
                                            <Select
                                                aria-label="gender"
                                                onChange={(e) => {
                                                    const value = Number(e.target.value)
                                                    if (!isNaN(value)) {
                                                        field.onChange(value)
                                                    }
                                                }}
                                                value={field.value === undefined ? '' : field.value}
                                            >
                                                {
                                                    template.ipv6_route?.map((row, index) => (
                                                        <MenuItem key={"ipv6_route_template_id_" + index}
                                                                  value={row.ID}>{row.name}</MenuItem>
                                                    ))

                                                }
                                            </Select>
                                        )}
                                    />
                                </StyledFormControlFormSelect>
                            }
                        </Grid>
                    }

                    {
                        serviceCode !== "" &&
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={errors?.hasOwnProperty("connection_template_id")}>
                                <FormLabel>2. 接続方式をお選びください</FormLabel>
                                <div>接続情報を登録するサービスコードを以下からお選びください。</div>
                                <FormHelperText>
                                    {errors?.connection_template_id && errors.connection_template_id?.message}
                                </FormHelperText>
                                <Controller
                                    name="connection_template_id"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <RadioGroup
                                            aria-label="gender"
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value)
                                                if (!isNaN(value)) {
                                                    const con = template.connections?.filter(item => item.ID === value)
                                                    setIsComment(!(con === undefined || con.length !== 1 || !con[0].need_comment));
                                                    setIsInternet(!(con === undefined || con.length !== 1 || !con[0].need_internet));
                                                    field.onChange(value)
                                                }
                                            }}
                                            value={field.value === undefined ? '' : field.value}
                                        >
                                            {
                                                template.connections?.map(map => (
                                                    ((~serviceCode.indexOf("2") && map.l2) || (~serviceCode.indexOf("3") && map.l3)) &&
                                                    <FormControlLabel key={"connection_template_" + map.ID}
                                                                      value={map.ID} control={<Radio/>}
                                                                      label={(map.name) + ": (" + (map.comment) + ")"}/>
                                                ))
                                            }
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    }
                    {
                        isComment &&
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={errors?.hasOwnProperty("comment")}>
                                <FormLabel component="legend">2.1. その他</FormLabel>
                                <div> Cross Connectを選択された方は以下のフォームに詳しい情報(ラック情報など)をご記入ください。</div>
                                <FormHelperText>
                                    {errors?.connection_comment && errors.connection_comment?.message}
                                </FormHelperText>
                                <StyledTextFieldLong
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    label="ご希望の接続方式をご記入ください"
                                    id="comment"
                                    {...register(`connection_comment`, {required: true})}
                                    error={!!errors.connection_comment}
                                />
                            </FormControl>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("noc_id")}>
                            <FormLabel component="legend">3.1. 接続終端NOCをお選びください</FormLabel>
                            <FormHelperText>
                                {errors?.noc_id && errors.noc_id?.message}
                            </FormHelperText>
                            <Controller
                                name="noc_id"
                                control={control}
                                render={({field, fieldState}) => (
                                    <Select
                                        aria-label="gender"
                                        onChange={(e) => {
                                            const value = Number(e.target.value)
                                            if (!isNaN(value)) {
                                                field.onChange(value)
                                            }
                                        }}
                                        value={field.value === undefined ? '' : field.value}
                                    >
                                        {
                                            template.nocs?.map((row, index) => (
                                                <MenuItem key={"noc_id_" + index}
                                                          value={row.ID}>{row.name}</MenuItem>
                                            ))

                                        }
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <br/>
                        <div>(当団体のNOC一覧は https://www.homenoc.ad.jp/en/tech/backbone/ をご覧ください)</div>
                    </Grid>
                    {
                        isInternet &&
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={errors?.hasOwnProperty("address")}>
                                <FormLabel component="legend">3.2. 終端先ユーザの都道府県市町村</FormLabel>
                                <div>都道府県と市町村のみ記入してください。例) 大阪府貝塚市</div>
                                <FormHelperText>
                                    {errors?.address && errors.address?.message}
                                </FormHelperText>
                                <StyledTextFieldLong
                                    key={"address"}
                                    label="終端先ユーザの都道府県市町村"
                                    variant="outlined"
                                    {...register(`address`, {required: true})}
                                    error={!!errors.address}
                                />
                            </FormControl>
                        </Grid>
                    }
                    {
                        isInternet &&
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={errors?.hasOwnProperty("term_ip")}>
                                <FormLabel component="legend">3.3. トンネル終端IPアドレス</FormLabel>
                                <div>トンネル接続をご希望の方はトンネル終端先のIPv6アドレスをご記入ください</div>
                                <FormHelperText>
                                    {errors?.term_ip && errors.term_ip?.message}
                                </FormHelperText>
                                <StyledTextFieldLong
                                    key={"term_ip"}
                                    label="終端アドレス"
                                    variant="outlined"
                                    {...register(`term_ip`, {required: true})}
                                    error={!!errors.term_ip}
                                />
                            </FormControl>
                        </Grid>
                    }
                    {
                        isInternet &&
                        <Grid item xs={12}>
                            <FormControl component="fieldset" error={errors?.hasOwnProperty("ntt_template_id")}>
                                <FormLabel component="legend">3.4. 接続終端場所にNTTフレッツ光が利用可能かをお知らせください</FormLabel>
                                <div>接続方式に構内接続をご希望の方は何も選択せず次の項目に進んでください</div>
                                <div>当団体ではトンネル接続を利用する場合、フレッツのIPoE(IPv6)接続をご利用頂くことを推奨しております。</div>
                                <FormHelperText>
                                    {errors?.ntt_template_id && errors.ntt_template_id?.message}
                                </FormHelperText>
                                <Controller
                                    name="ntt_template_id"
                                    control={control}
                                    render={({field, fieldState}) => (
                                        <RadioGroup
                                            aria-label="gender"
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value)
                                                if (!isNaN(value)) {
                                                    field.onChange(value)
                                                }
                                            }}
                                            value={field.value === undefined ? '' : field.value}
                                        >
                                            {
                                                template.ntts?.map(map => (
                                                    <FormControlLabel key={"ntt_template_id_" + map.ID}
                                                                      value={map.ID} control={<Radio/>}
                                                                      label={(map.name) + ": (" + (map.comment) + ")"}/>
                                                ))
                                            }
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <FormControl component="fieldset" error={errors?.hasOwnProperty("monitor")}>
                            <FormLabel component="legend">4. ネットワーク監視</FormLabel>
                            <div>当団体によるネットワーク監視をご希望の場合はチェックを入れて下さい</div>
                            <div>検証用などで頻繁に接続断が発生する予定の場合は当団体からの監視はお断りいたします</div>
                            <FormHelperText>
                                {errors?.monitor && errors.monitor?.message}
                            </FormHelperText>
                            <FormControlLabel
                                control={<Controller
                                    control={control}
                                    name="monitor"
                                    render={({field: {onChange}}) => (
                                        <Checkbox
                                            color="primary"
                                            onChange={e => {
                                                onChange(e.target.checked)
                                            }}
                                        />
                                    )}/>
                                }
                                label={<Typography>希望する</Typography>}
                            />
                        </FormControl>
                    </Grid>
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
