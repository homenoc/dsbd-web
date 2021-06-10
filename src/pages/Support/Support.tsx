import React, {useEffect, useState} from 'react';
import Dashboard from "../../components/Dashboard/Dashboard";
import useStyles from "../Dashboard/styles"
import {
    Button,
    Card,
    CardActions,
    CardContent, Chip,
    FormControl, FormControlLabel,
    InputBase,
    Paper, Radio, RadioGroup,
    Typography
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {TicketData} from "../../interface";
import {useSnackbar} from "notistack";
import {Solved} from "../../components/Dashboard/Solved/Open";
import Cookies from "js-cookie";
import store, {RootState} from "../../store";
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import {useSelector} from "react-redux";
import {Get} from "../../api/Info";
import {SupportAddDialog} from "./SupportAddDialog";
import {Put} from "../../api/Support";


export default function Support() {
    const classes = useStyles();
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [initTickets, setInitTickets] = useState<TicketData[]>([]);
    const [group, setGroupID] = useState(0);
    const infos = useSelector((state: RootState) => state.infos);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [value, setValue] = React.useState(false);

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
            } else if (tmpData.data !== undefined && tmpData.data?.ticket !== undefined) {
                setInitTickets(tmpData.data?.ticket);
                setTickets(tmpData.data?.ticket);
                if (tmpData.data.user !== undefined) {
                    setGroupID(tmpData.data.user?.group_id)
                }
            }
        } else {
            console.log("Renew");
            Get().then();
            const date = new Date();
            enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
        }
    }, [infos]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value === "true")
    };

    const handleFilter = (search: string) => {
        let tmp: TicketData[];
        if (search === "") {
            tmp = initTickets;
        } else {
            tmp = initTickets.filter((grp: TicketData) => {
                return grp.title.toLowerCase().includes(search.toLowerCase())
            });
        }
        setTickets(tmp);
    };

    const clickSolvedStatus = (id: number, solved: boolean) => {
        Put(id, {solved}).then(res => {
            if (res.error === undefined) {
                enqueueSnackbar("OK", {variant: "success"});
                Get().then();
            } else {
                enqueueSnackbar(res.error, {variant: "error"});
            }
        })
    }

    const clickDetailPage = (id: number) => {
        history.push('/dashboard/support/' + id);
    }

    return (
        <Dashboard title="Ticket Info">
            <SupportAddDialog key={"support_add_dialog"} groupEnable={group !== 0}/>
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
            <FormControl component="fieldset">
                <RadioGroup row aria-label="gender" name="gender1" value={value} onChange={handleChange}>
                    <FormControlLabel value={false} control={<Radio color="primary"/>} label="未解決"/>
                    <FormControlLabel value={true} control={<Radio color="primary"/>} label="解決済"/>
                </RadioGroup>
            </FormControl>
            {
                tickets === null &&
                <h3>現在、有効なチケットはありません。</h3>
            }
            {
                tickets !== null &&
                tickets.filter(ticket => ticket.solved === value).map((ticket: TicketData, index) => (
                    <Card className={classes.root}>
                        <CardContent>
                            <Typography className={classes.title} color="textSecondary" gutterBottom>
                                ID: {ticket.id}
                            </Typography>
                            <Typography variant="h5" component="h2">
                                {ticket.title}
                            </Typography>
                            <br/>
                            {
                                ticket.group_id === 0 &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="個人チャット"
                                />
                            }
                            {
                                ticket.group_id !== 0 &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="グループチャット"
                                />
                            }
                            &nbsp;&nbsp;
                            <Solved key={index} solved={ticket.solved}/>
                            &nbsp;&nbsp;
                            {
                                ticket.admin &&
                                <Chip
                                    size="small"
                                    color="primary"
                                    label="管理者作成"
                                />
                            }
                            <br/>
                            {/*作成者: {ticket.user?.name}*/}
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => clickDetailPage(ticket.id)}>Detail</Button>
                            {
                                ticket.solved &&
                                <Button size="small" color="primary"
                                        onClick={() => clickSolvedStatus(ticket.id, false)}>未解決</Button>
                            }
                            {
                                !ticket.solved &&
                                <Button size="small" color="secondary"
                                        onClick={() => clickSolvedStatus(ticket.id, true)}>解決済み</Button>
                            }
                        </CardActions>
                    </Card>
                ))
            }
        </Dashboard>
    );
}
