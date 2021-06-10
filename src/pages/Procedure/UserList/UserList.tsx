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
import {UserData} from "../../../interface";
import {useSnackbar} from "notistack";
import Cookies from "js-cookie";
import store, {RootState} from "../../../store";
import {clearInfos, clearTemplates} from "../../../store/action/Actions";
import {useSelector} from "react-redux";
import {Get} from "../../../api/Info";
import Dashboard from "../../../components/Dashboard/Dashboard";


export default function UserList() {
    const classes = useStyles();
    const [users, setUsers] = useState<UserData[]>([]);
    const [initUsers, setInitUsers] = useState<UserData[]>([]);
    const infos = useSelector((state: RootState) => state.infos);
    const history = useHistory();
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
                    history.push("/");
                } else {
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                    Get().then();
                }
            } else if (tmpData.data !== undefined && tmpData.data?.user_list !== undefined) {
                setInitUsers(tmpData.data?.user_list);
                setUsers(tmpData.data?.user_list);
            }
        } else {
            console.log("Renew");
            Get().then();
            const date = new Date();
            enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
        }
    }, [infos]);

    const handleFilter = (search: string) => {
        let tmp: UserData[];
        if (search === "") {
            tmp = initUsers;
        } else {
            tmp = initUsers.filter((user: UserData) => {
                const name = user.name + user.name_en
                return name.toLowerCase().includes(search.toLowerCase())
            });
        }
        setUsers(tmp);
    };

    const clickDetailPage = (id: number) => {
        history.push('/dashboard/procedure/user/' + id);
    }

    return (
        <Dashboard title="ユーザ追加">
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
                users === null &&
                <h3>現在、有効なユーザはありません。</h3>
            }
            {
                users !== null &&
                users.map((user: UserData, index) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {user.id} ({user.email})
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {user.name}({user.name_en})
                            </Typography>
                            <br/>
                            &nbsp;&nbsp;
                            <MailVerify key={"mail_verify_" + index} mailVerify={user.mail_verify}/>
                            <br/>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => clickDetailPage(user.id)}>Detail</Button>
                            {/*{*/}
                            {/*    user.solved &&*/}
                            {/*    <Button size="small" color="primary"*/}
                            {/*            onClick={() => clickSolvedStatus(user.id, false)}>未解決</Button>*/}
                            {/*}*/}
                            {/*{*/}
                            {/*    !user.solved &&*/}
                            {/*    <Button size="small" color="secondary"*/}
                            {/*            onClick={() => clickSolvedStatus(user.id, true)}>解決済み</Button>*/}
                            {/*}*/}
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}

function MailVerify(props: { mailVerify: boolean }): any {
    const {mailVerify} = props;
    if (mailVerify) {
        return (
            <Chip
                size="small"
                color="primary"
                label="メール確認済"
            />
        );
    } else {
        return (
            <Chip
                size="small"
                color="secondary"
                label="メール未確認"
            />
        );
    }
}
