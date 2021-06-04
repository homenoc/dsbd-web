import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Button, Card, CardActions, CardContent, Chip, Grid, Typography} from "@material-ui/core";
import useStyles from "../Dashboard/styles"
import {clearInfos, clearTemplates, getInfos} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {InfoData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get, GetTemplate} from "../../api/Info";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";


export default function Dashboard() {
    const classes = useStyles();
    const [data, setData] = React.useState<InfoData>();
    const infos = useSelector((state: RootState) => state.infos);
    const templates = useSelector((state: RootState) => state.templates);
    const history = useHistory();
    const [status, setStatus] = React.useState(3);
    const {enqueueSnackbar} = useSnackbar();

    useEffect(() => {
        // info
        console.log(infos);
        const length = infos.length;
        const tmpData = infos[length - 1];

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
                }
            } else if (tmpData.data !== undefined) {
                setData(tmpData.data);
                // add group
                if (tmpData.data.user?.group_id === 0) {
                    setStatus(0);
                } else if (tmpData.data.group?.add_allow) {
                    setStatus(1);
                } else {
                    if (tmpData.data.service !== undefined) {
                        let addAllow = false;
                        for (const tmpService of tmpData.data.service) {
                            if (tmpService.add_allow) {
                                addAllow = true;
                                break;
                            }
                        }
                        if (addAllow) {
                            setStatus(2);
                        }
                    } else {
                        setStatus(3);
                    }
                }
            }

        } else {
            console.log("Renew");
            Get().then();
            const date = new Date();
            enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
        }

        // template
        console.log(templates);

    }, [infos, templates]);

    const getStringFromDate = (before: string): string => {
        let str = '無期限';
        if (!before.match(/9999-12-31/)) {
            let date = new Date(Date.parse(before));
            str = date.getFullYear() + '-' + ('0' + (1 + date.getMonth())).slice(-2) + '-' +
                ('0' + date.getDate()).slice(-2) + ' ' + ('0' + date.getHours()).slice(-2) + ':' +
                ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
        }
        return str;
    }

    const moveAddPage = () => {
        history.push("/dashboard/add");
    }

    return (
        <DashboardComponent title="Dashboard">
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    {
                        status !== 3 &&
                        <Card key={"add_notice"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    申請手続きのお知らせ
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    <Chip
                                        label="重要"
                                        color="secondary"
                                    />
                                </Typography>
                                <br/>
                                以下の「申請ページはこちら」ボタンより手続きを進めてください

                            </CardContent>
                            <CardActions>
                                <Button size="small" variant="outlined" onClick={moveAddPage}>
                                    申請ページはこちら
                                </Button>
                            </CardActions>
                        </Card>
                    }
                    {
                        data?.notice?.map((notice, index) =>
                            <Card key={index} className={classes.root}>
                                <CardContent>
                                    <Typography variant="h5" component="h2">
                                        {notice.title}
                                    </Typography>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        ({getStringFromDate(notice.start_time)} - {getStringFromDate(notice.end_time)})
                                    </Typography>
                                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                                        {
                                            notice.info &&
                                            <Chip
                                                label="情報"
                                                color="primary"
                                            />
                                        }
                                        {
                                            notice.important &&
                                            <Chip
                                                label="重要"
                                                color="secondary"
                                            />
                                        }
                                        {
                                            notice.fault &&
                                            <Chip
                                                label="障害"
                                                color="secondary"
                                            />
                                        }
                                    </Typography>
                                    <br/>
                                    {notice.data}
                                </CardContent>
                                <CardActions>
                                    {/*<Button color="secondary" size="small" variant="outlined"*/}
                                    {/*        onClick={() => noticeDelete(notice.ID)}>*/}
                                    {/*    Delete*/}
                                    {/*</Button>*/}
                                </CardActions>
                            </Card>
                        )
                    }
                </Grid>
                <Grid item xs={4}>
                    {/*<Button onClick={() => test1()}>Test1</Button>*/}
                    {/*<Button onClick={() => test2()}>Test2</Button>*/}
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}