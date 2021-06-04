import React, {useEffect, useState} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {useSelector} from "react-redux";
import store, {RootState} from "../../store";
import {useHistory} from "react-router-dom";
import {useSnackbar} from "notistack";
import Cookies from "js-cookie";
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import {Get} from "../../api/Info";
import {InfosData} from "../../interface";
import {Card, CardContent, Grid, InputBase, Paper, Typography} from "@material-ui/core";
import useStyles from "../Dashboard/styles"
import classesCSS from "./style.module.scss";


export default function Info() {
    const classes = useStyles();
    const [infos, setInfos] = useState<InfosData[]>([]);
    const [initInfos, setInitInfos] = useState<InfosData[]>([]);
    const serviceInfos = useSelector((state: RootState) => state.infos);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        // info
        console.log(infos);
        const length = serviceInfos.length;
        const tmpData = serviceInfos[length - 1];

        if (tmpData.error !== undefined || tmpData.data !== undefined) {
            if (tmpData.error !== undefined) {
                if (tmpData.error?.indexOf("[401]") !== -1) {
                    Cookies.remove('user_token');
                    Cookies.remove('access_token');
                    store.dispatch(clearInfos());
                    store.dispatch(clearTemplates());
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                    history.push('/login');
                } else {
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                    Get().then();
                }
            } else if (tmpData.data !== undefined && tmpData.data?.info !== undefined) {
                console.log(tmpData.data?.info);
                setInitInfos(tmpData.data?.info);
                setInfos(tmpData.data?.info);
            }
        } else {
            console.log("Renew");
            Get().then();
            const date = new Date();
            enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
        }
    }, [serviceInfos]);

    const handleFilter = (search: string) => {
        console.log(infos);
        let tmp: InfosData[];
        if (search === "") {
            tmp = initInfos;
        } else {
            tmp = initInfos.filter((info: InfosData) => {
                return info.service.toLowerCase().includes(search.toLowerCase())
            });
        }
        setInfos(tmp);
    };

    return (
        <DashboardComponent title="Info">
            <Paper component="form" className={classes.rootInput}>
                <InputBase
                    className={classes.input}
                    placeholder="Search…"
                    inputProps={{'aria-label': 'search'}}
                    onChange={event => {
                        handleFilter(event.target.value)
                    }}
                />
            </Paper>
            {
                (infos === null) &&
                    <h3>現在、開通しているサービスがありません。</h3>
            }
            {
                (infos !== null) &&
                infos.map((info: InfosData, index) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {info.service_id}
                            </Typography>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                {info.asn}
                            </Typography>
                            <Typography variant="body2" component="p">
                                <div className={classesCSS.contract}>
                                    <br/>
                                    <table aria-colspan={2}>
                                        <thead>
                                        <tr>
                                            <th colSpan={2}>IP</th>
                                        </tr>
                                        <tr>
                                            <th>IP Version</th>
                                            <th>Address</th>
                                        </tr>
                                        {
                                            info.v4?.map((v4) =>
                                                <tr>
                                                    <td>IPv4</td>
                                                    <td>{v4}</td>
                                                </tr>
                                            )
                                        }
                                        {
                                            info.v6?.map((v6) =>
                                                <tr>
                                                    <td>IPv6</td>
                                                    <td>{v6}</td>
                                                </tr>
                                            )
                                        }
                                        </thead>
                                    </table>
                                    <br/>
                                    <table aria-colspan={2}>
                                        <thead>
                                        <tr>
                                            <th colSpan={2}>内容</th>
                                        </tr>
                                        <tr>
                                            <th>サービス種別</th>
                                            <td>{info.service}</td>
                                        </tr>
                                        <tr>
                                            <th>利用料金</th>
                                            <td>{info.fee}</td>
                                        </tr>
                                        <tr>
                                            <th>当団体からのIPアドレスの割当</th>
                                            {
                                                info.assign &&
                                                <td>当団体から割当</td>
                                            }
                                            {
                                                !info.assign &&
                                                <td>貴団体から割当</td>
                                            }
                                        </tr>
                                        </thead>
                                    </table>
                                    <br/>
                                    <table className={classesCSS.contract}>
                                        <thead>
                                        <tr>
                                            <th colSpan={3}>接続情報</th>
                                        </tr>
                                        <tr>
                                            <th>接続方式</th>
                                            <td colSpan={2}>{info.service}</td>
                                        </tr>
                                        <tr>
                                            <th>接続NOC</th>
                                            <td colSpan={2}>{info.noc}</td>
                                        </tr>
                                        <tr>
                                            <th>トンネル終端アドレス（貴団体側）</th>
                                            <td colSpan={2}>{info.term_ip}</td>
                                        </tr>
                                        <tr>
                                            <th>トンネル終端アドレス（HomeNOC側）</th>
                                            <td colSpan={2}>{info.noc_ip}</td>
                                        </tr>
                                        <tr>
                                            <th colSpan={3}>当団体との間の境界アドレス</th>
                                        </tr>
                                        <tr>
                                            <th/>
                                            <th>IPv4アドレス</th>
                                            <th>IPv6アドレス</th>
                                        </tr>
                                        <tr>
                                            <th>HomeNOC側</th>
                                            <td>{info.link_v4_our}</td>
                                            <td>{info.link_v6_our}</td>
                                        </tr>
                                        <tr>
                                            <th>貴団体側</th>
                                            <td>{info.link_v4_your}</td>
                                            <td>{info.link_v6_your}</td>
                                        </tr>
                                        </thead>
                                    </table>
                                    <br/>
                                    <div>本ページは電気通信事業法 第26条2（書面の交付義務）に基づく書面となります。</div>
                                    <div>なお、郵送での書面交付をご希望頂いた方は、お送りします書面が正式書面となり、本画面の表示は参考情報となります。</div>
                                </div>
                            </Typography>
                        </CardContent>
                        {/*<CardActions>*/}
                        {/*    <Button size="small">Learn More</Button>*/}
                        {/*</CardActions>*/}
                    </Card>
                ))
            }
        </DashboardComponent>
    );
}
