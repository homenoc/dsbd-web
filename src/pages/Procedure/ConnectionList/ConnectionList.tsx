import React, {useEffect, useState} from 'react';
import useStyles from "../styles"
import {
    Button,
    Card,
    CardActions,
    CardContent, Chip,
    InputBase,
    Paper,
    Typography
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {InfosData} from "../../../interface";
import {useSnackbar} from "notistack";
import Cookies from "js-cookie";
import store, {RootState} from "../../../store";
import {clearInfos, clearTemplates} from "../../../store/action/Actions";
import {useSelector} from "react-redux";
import {Get} from "../../../api/Info";
import Dashboard from "../../../components/Dashboard/Dashboard";
import {ConnectionListDeleteDialog} from "./ConnectionListDeleteDialog";
import {ConnectionListChangeDialog} from "./ConnectionListChangeDialog";


export default function ConnectionList() {
    const classes = useStyles();
    const [infos, setInfos] = useState<InfosData[]>([]);
    const [initInfos, setInitInfos] = useState<InfosData[]>([]);
    const info = useSelector((state: RootState) => state.infos);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        // info
        console.log(info);
        const length = info.length;
        const tmpData = info[length - 1];

        if (tmpData.error !== undefined || tmpData.data !== undefined) {
            if (tmpData.error !== undefined) {
                if (tmpData.error?.indexOf("[401]") !== -1) {
                    Cookies.remove('user_token');
                    Cookies.remove('access_token');
                    store.dispatch(clearInfos());
                    store.dispatch(clearTemplates());
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                    history.push("/");
                } else {
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                    Get().then();
                }
            } else if (tmpData.data !== undefined && tmpData.data?.info !== undefined) {
                setInitInfos(tmpData.data?.info);
                setInfos(tmpData.data?.info);
            }
        } else {
            console.log("Renew");
            Get().then();
            const date = new Date();
            enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
        }
    }, [info]);

    const handleFilter = (search: string) => {
        let tmp: InfosData[];
        if (search === "") {
            tmp = initInfos;
        } else {
            tmp = initInfos.filter((tmpInfo: InfosData) => {
                const serviceId = tmpInfo.service_id
                return serviceId.toLowerCase().includes(search.toLowerCase())
            });
        }
        setInfos(tmp);
    };

    return (
        <Dashboard title="接続変更/廃止手続き">
            <Card className={classes.root}>
                <CardContent>
                    接続変更手続き（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報を変更、IPアドレスの廃止をご希望の方もお選びください。）
                    <br/>
                    接続削除手続き（サービスに属している接続も廃止になりますのでご注意ください。）
                </CardContent>
            </Card>
            <br/>
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
                infos === null &&
                <h3>現在、有効なサービスはありません。</h3>
            }
            {
                infos !== null &&
                infos.map((tmpInfo: InfosData, index) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                {tmpInfo.service_id}
                            </Typography>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                {/*ID: {tmpInfo.id}*/}
                            </Typography>
                            &nbsp;
                            {/*<Pass key={"pass" + index} pass={connection.open}/>*/}
                            <br/>
                        </CardContent>
                        <CardActions>
                            <ConnectionListChangeDialog key={"connection_list_change_dialog"} info={tmpInfo}/>
                            <ConnectionListDeleteDialog key={"connection_list_delete_dialog"} info={tmpInfo}/>
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}

function Pass(props: { pass: boolean }): any {
    const {pass} = props;
    if (pass) {
        return (
            <Chip
                size="small"
                color="primary"
                label="審査済み"
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="未審査"
            />
        );
    }
}
