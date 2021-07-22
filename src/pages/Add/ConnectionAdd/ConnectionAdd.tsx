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
    Grid, InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from "@material-ui/core";
import {
    ConnectionAddData,
    DefaultConnectionAddData,
    ServiceData,
    TemplateData,
} from "../../../interface";
import useStyles from "../styles";
import {check} from "./check";
import {useSnackbar} from "notistack";
import {Post} from "../../../api/Connection";
import {useHistory} from "react-router-dom";

export default function ConnectionAddDialogs(props: {
    template: TemplateData
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    serviceData: ServiceData[]
    reload: Dispatch<SetStateAction<boolean>>
}) {
    const {template, open, setOpen, serviceData, reload} = props
    const [data, setData] = React.useState(DefaultConnectionAddData);
    const [internet, setInternet] = React.useState(false);
    const [serviceCode, setServiceCode] = React.useState("");
    const [serviceID, setServiceID] = React.useState(0);
    const {enqueueSnackbar} = useSnackbar();
    const history = useHistory();

    useEffect(() => {
        if (open) {
            let addAllow = false;
            for (const tmpService of serviceData) {
                if (tmpService.add_allow) {
                    addAllow = true;
                    break
                }
            }
            if (!addAllow) {
                enqueueSnackbar('登録が許可されていません。', {variant: "error"});
                history.push("/dashboard")
            }
        }
    }, [open]);

    const request = () => {
        console.log(data);
        const err = check(data, template);
        if (err === "") {
            console.log("OK")
            Post(serviceID, data).then(res => {
                if (res.error === "") {
                    console.log(res.data);
                    enqueueSnackbar('Request Success', {variant: "success"});
                    setOpen(false);
                    reload(true);
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
                    接続情報の追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <ConnectionAddServiceSelect key={"connection_add_service_select"} serviceData={serviceData}
                                                    data={data} setData={setData} setServiceID={setServiceID}
                                                    setServiceCode={setServiceCode} template={template}/>
                        <br/>
                        <Grid item xs={12}>
                            <ConnectionAddType key={"connection_add_type"} template={template}
                                               data={data} setData={setData} serviceCode={serviceCode}
                                               setInternet={setInternet}/>
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <ConnectionAddNOC key={"connection_add_noc"} template={template}
                                              data={data} setData={setData}/>
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            {
                                internet &&
                                <ConnectionAddTermIP key={"connection_term_ip"} template={template} data={data}
                                                     setData={setData}/>
                            }
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            {
                                internet &&
                                <ConnectionAddAddress key={"connection_add_address"} data={data} setData={setData}/>
                            }
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <ConnectionAddMonitor key={"connection_add_monitor"} data={data} setData={setData}/>
                        </Grid>
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

export function ConnectionAddServiceSelect(props: {
    serviceData: ServiceData[]
    data: ConnectionAddData
    setData: Dispatch<SetStateAction<ConnectionAddData>>
    template: TemplateData,
    setServiceID: Dispatch<SetStateAction<number>>
    setServiceCode: Dispatch<SetStateAction<string>>
}) {
    const {serviceData, setServiceID, template, data, setData, setServiceCode} = props;
    const [ipBGPRoute, setIPBGPRoute] = React.useState(false);
    const [ipv4BGPRoute, setIPv4BGPRoute] = React.useState(false);
    const [ipv6BGPRoute, setIPv6BGPRoute] = React.useState(false);
    const classes = useStyles();
    const {enqueueSnackbar} = useSnackbar();

    const selectData = (id: number) => {
        const dataExtra = serviceData.filter(item => item.id === id);
        setServiceID(id);
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
        <div>
            <Grid item xs={12}>
                <FormLabel component="legend">1. 接続情報を登録するサービスコードを選択してください。</FormLabel>
                <br/>
                <InputLabel>接続情報を登録するサービスコードを以下からお選びください。</InputLabel>
                <FormControl className={classes.formSelect}>
                    <InputLabel>Service Code</InputLabel>
                    <Select
                        labelId="connection_add_select_service_code"
                        id="connection_add_select_service_code"
                        onChange={(event) => {
                            selectData(Number(event.target.value));
                            const tmpData = serviceData.filter(data => data.id === Number(event.target.value));
                            if (tmpData != null) {
                                setServiceCode(tmpData[0].service_type);
                            }
                            setData({...data, connection_template_id: Number(event.target.value)})
                        }}
                    >
                        {
                            serviceData.filter(tmp => tmp.add_allow).map((row, index) => (
                                <MenuItem key={"connection_add_select_service_code" + index}
                                          value={row.id}>{row.service_id}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
                <br/>
                {
                    ipBGPRoute &&
                    <FormLabel component="legend">1.1. 広報するBGPの方法を選択してください。</FormLabel>
                }
            </Grid>
            <Grid item xs={6}>
                {
                    ipBGPRoute && ipv4BGPRoute &&
                    <FormControl className={classes.formSelect}>
                        <FormLabel component="legend">IPv4 BGP広報経路</FormLabel>
                        <Select
                            labelId="connection_add_select_ipv4_route"
                            id="connection_add_select_ipv4_route"
                            value={data.ipv4_route_template_id || undefined}
                            onChange={(event) => {
                                setData({...data, ipv4_route_template_id: Number(event.target.value)})
                            }}
                        >
                            {
                                template.ipv4_route?.map((row, index) => (
                                    <MenuItem key={"connection_add_select_ipv4_route_" + index}
                                              value={row.ID}>{row.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                }
            </Grid>
            <Grid item xs={6}>
                {
                    ipBGPRoute && ipv6BGPRoute &&
                    <FormControl className={classes.formSelect}>
                        <FormLabel component="legend">IPv6 BGP広報経路</FormLabel>
                        <Select
                            labelId="connection_add_select_ipv6_route"
                            id="connection_add_select_ipv6_route"
                            value={data.ipv6_route_template_id || undefined}
                            onChange={(event) => {
                                setData({...data, ipv6_route_template_id: Number(event.target.value)})
                            }}
                        >
                            {
                                template.ipv6_route?.map((row, index) => (
                                    <MenuItem key={"connection_add_select_ipv6_route_" + index}
                                              value={row.ID}>{row.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                }
                <br/>
            </Grid>
        </div>
    )
}

export function ConnectionAddType(props: {
    template: TemplateData,
    data: ConnectionAddData,
    setData: Dispatch<SetStateAction<ConnectionAddData>>
    setInternet: Dispatch<SetStateAction<boolean>>
    serviceCode: string
}) {
    const {template, data, setData, setInternet, serviceCode} = props
    const [comment, setComment] = React.useState(false);
    const classes = useStyles();

    console.log(serviceCode);

    const getComment = (templateID: number) => {
        const con = template.connections?.filter(item => item.ID === templateID)
        setComment(!(con === undefined || con.length !== 1 || !con[0].need_comment));
        setInternet(!(con === undefined || con.length !== 1 || !con[0].need_internet));
    }

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">2. 接続方式をお選びください</FormLabel>
                <RadioGroup aria-label="gender" name="gender1" value={data.connection_template_id}
                            onChange={(event) => {
                                setData({...data, connection_template_id: parseInt(event.target.value)})
                                getComment(parseInt(event.target.value));
                            }}>
                    {
                        template.connections?.map(map =>
                            ((~serviceCode.indexOf("2") && map.l2) || (~serviceCode.indexOf("3") && map.l3)) &&
                            <FormControlLabel key={map.ID} value={map.ID} control={<Radio/>}
                                              label={(map.name) + ": (" + (map.comment) + ")"}/>
                        )

                    }
                </RadioGroup>
                {
                    comment &&
                    <div>
                        <br/>
                        <FormLabel component="legend">2.1. その他</FormLabel>
                        <div> Cross Connectを選択された方は以下のフォームに詳しい情報(ラック情報など)をご記入ください。</div>
                        <TextField
                            className={classes.formLong}
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="ご希望の接続方式をご記入ください"
                            label="ご希望の接続方式をご記入ください"
                            id="comment"
                            value={data.connection_comment}
                            onChange={event => setData({...data, connection_comment: event.target.value})}
                        />
                    </div>
                }
            </FormControl>
        </div>
    )
}


export function ConnectionAddNOC(props: {
    template: TemplateData,
    data: ConnectionAddData,
    setData: Dispatch<SetStateAction<ConnectionAddData>>
}) {
    const {template, data, setData} = props;
    const classes = useStyles();

    return (
        <div>
            <FormLabel component="legend">3.1. 接続終端NOCをお選びください</FormLabel>
            <br/>
            <div>当団体のNOC一覧は https://www.homenoc.ad.jp/en/tech/backbone/ をご覧ください</div>
            <br/>
            <FormControl className={classes.formSelect}>
                <InputLabel>NOC</InputLabel>
                <Select
                    labelId="connection_add_select_noc"
                    id="connection_add_select_noc"
                    value={data.noc_id}
                    onChange={(event) => {
                        setData({...data, noc_id: Number(event.target.value)})
                    }}
                >
                    {
                        template.nocs?.map((row, index) => (
                            <MenuItem key={"connection_add_select_noc" + index} value={row.ID}>{row.name}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <br/>
        </div>
    )
}

export function ConnectionAddAddress(props: {
    data: ConnectionAddData,
    setData: Dispatch<SetStateAction<ConnectionAddData>>
}) {
    const {data, setData} = props;
    const classes = useStyles();

    return (
        <div>
            <FormLabel component="legend">3.2. 終端先ユーザの都道府県市町村</FormLabel>
            <br/>
            <div>都道府県と市町村のみ記入してください。例) 大阪府貝塚市</div>
            <br/>
            <TextField
                className={classes.formLong}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="終端先ユーザの都道府県市町村"
                label="終端先ユーザの都道府県市町村"
                id="connection_add_text_address"
                value={data.address}
                onChange={event => setData({...data, address: event.target.value})}
            />
            <br/>
        </div>
    )
}

export function ConnectionAddTermIP(props: {
    template: TemplateData,
    data: ConnectionAddData,
    setData: Dispatch<SetStateAction<ConnectionAddData>>
}) {
    const {template, data, setData} = props;
    const classes = useStyles();

    return (
        <div>
            <FormLabel component="legend">3.1. トンネル終端IPアドレス</FormLabel>
            <br/>
            <div>トンネル接続をご希望の方はトンネル終端先のIPv6アドレスをご記入ください</div>
            <br/>
            <TextField
                className={classes.formLong}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="終端IPアドレス"
                label="終端IPアドレス"
                id="connection_add_text_term_ip"
                value={data.term_ip}
                onChange={event => setData({...data, term_ip: event.target.value})}
            />
            <br/>
            <FormLabel component="legend">3.2. 接続終端場所にNTTフレッツ光が利用可能かをお知らせください</FormLabel>
            <br/>
            <div>接続方式に構内接続をご希望の方は何も選択せず次の項目に進んでください</div>
            <br/>
            <div>当団体ではトンネル接続を利用する場合、フレッツのIPoE(IPv6)接続をご利用頂くことを推奨しております。</div>
            <br/>
            <FormControl className={classes.formSelect}>
                <RadioGroup
                    id="connection_add_select_noc"
                    name="connection_add_select_noc"
                    value={data.ntt_template_id}
                    onChange={(event) => {
                        setData({...data, ntt_template_id: Number(event.target.value)})
                    }}
                >
                    {
                        template.ntts?.map((row) => (
                                <FormControlLabel key={"connection_add_select_noc_" + row.ID} value={row.ID}
                                                  control={<Radio/>}
                                                  label={(row.name) + ": (" + (row.comment) + ")"}/>
                            )
                        )
                    }
                </RadioGroup>
            </FormControl>
            <br/>
        </div>
    )
}

export function ConnectionAddMonitor(props: {
    data: ConnectionAddData,
    setData: Dispatch<SetStateAction<ConnectionAddData>>
}) {
    const {data, setData} = props;
    const [checkBox, setCheckBox] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCheckBox(event.target.checked);
        setData({...data, monitor: event.target.checked});
    }

    return (
        <div>
            <FormLabel component="legend">4. ネットワーク監視</FormLabel>
            <br/>
            <div>当団体によるネットワーク監視をご希望の場合はチェックを入れて下さい</div>
            <div>検証用などで頻繁に接続断が発生する予定の場合は当団体からの監視はお断りいたします</div>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={checkBox}
                        onChange={handleChange}
                        name="monitor"
                        color="primary"
                    />
                }
                label="希望する"
            />
        </div>
    )
}
