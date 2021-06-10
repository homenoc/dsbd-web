import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Card, CardActions, CardContent, Grid, Typography} from "@material-ui/core";
import useStyles from "../Dashboard/styles"
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {InfoData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get} from "../../api/Info";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";


export default function UserProfile() {
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

        if (tmpData.error !== undefined || tmpData.data != null) {
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
            } else if (tmpData.data != null) {
                setData(tmpData.data);
                // add group
                if (tmpData.data.user?.group_id === 0) {
                    setStatus(0);
                } else if (tmpData.data.group?.add_allow) {
                    setStatus(1);
                } else {
                    if (tmpData.data.service != null) {
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

    return (
        <DashboardComponent title="Setting/各種手続き">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {
                        status !== 3 &&
                        <Card key={"add_notice"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    ユーザ追加手続き
                                </Typography>
                                <Typography className={classes.title} color="textSecondary" gutterBottom>
                                    Add user
                                </Typography>
                                <br/>
                                グループにユーザ追加を希望される方はお選びください。
                            </CardContent>
                            <CardActions>
                                {/*<Button size="small" variant="outlined" onClick={moveAddPage}>*/}
                                {/*    申請ページはこちら*/}
                                {/*</Button>*/}
                            </CardActions>
                        </Card>
                    }
                </Grid>
                <Grid item xs={12}>
                    {/*<Button onClick={() => test1()}>Test1</Button>*/}
                    {/*<Button onClick={() => test2()}>Test2</Button>*/}
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}