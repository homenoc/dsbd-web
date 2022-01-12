import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {
    Button,
    Card,
    CardActions,
    CardContent, Chip,
    Grid, IconButton,
    Paper,
    Table, TableBody, TableCell,
    TableContainer, TableFooter, TableHead, TablePagination, TableRow,
    Typography, useTheme
} from "@material-ui/core";
import useStyles from "../Dashboard/styles"
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {InfoData, TicketData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get} from "../../api/Info";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";
import {UserAddDialog} from "./UserAddDialog/UserAddDialog";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import {RequestAddDialog} from "./RequestAddDialog/RequestAddDialog";
import {GroupChangeDialog} from "./Group/GroupChangeDialog";


export default function Procedure() {
    const classes = useStyles();
    const [data, setData] = React.useState<InfoData>();
    const infos = useSelector((state: RootState) => state.infos);
    const templates = useSelector((state: RootState) => state.templates);
    const history = useHistory();
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

    const UserListPage = () => history.push("/dashboard/procedure/user");
    const ServiceListPage = () => history.push("/dashboard/procedure/service");
    const ConnectionListPage = () => history.push("/dashboard/procedure/connection");

    return (
        <DashboardComponent title="各種手続き">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h3>申請状況</h3>
                    {
                        (data != null && data?.request == undefined) && <h2>申請履歴がありません</h2>
                    }
                    {
                        data != null && data.request != null &&
                        <StatusTable key={"status_table"} request={data?.request.sort((a, b) => b.id - a.id)}/>
                    }
                </Grid>
                <Grid item xs={12}>
                    {
                        data != null && data?.user != null && data.user?.group_id !== 0 &&
                        <Card key={"add_user"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    ユーザ追加手続き
                                </Typography>
                                <br/>
                                グループにユーザ追加を希望される方はお選びください。
                            </CardContent>
                            <CardActions>
                                <UserAddDialog groupID={data.user.group_id}/>
                            </CardActions>
                        </Card>
                    }
                    <Card key={"change_user"} className={classes.root}>
                        <CardContent>
                            <Typography variant="h5" component="h2">
                                ユーザ情報変更手続き
                            </Typography>
                            <br/>
                            メールアドレス、パスワード、ユーザ情報の変更を希望される方はお選びください。
                        </CardContent>
                        <CardActions>
                            <Button variant="outlined" onClick={UserListPage}> 次へ </Button>
                        </CardActions>
                    </Card>
                    {
                        data != null && data?.user != null && data.user?.group_id !== 0 && data.group != null &&
                        <Card key={"change_group"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    グループ情報変更手続き
                                </Typography>
                                <br/>
                                グループ情報の変更を希望される方はお選びください。
                            </CardContent>
                            <CardActions>
                                <GroupChangeDialog key={"request_abolished_group"} group={data.group}/>
                            </CardActions>
                        </Card>
                    }
                    {
                        data != null && data?.group != null && !data.group?.add_allow &&
                        <Card key={"add_service"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    サービス追加手続き
                                </Typography>
                                <br/>
                                サービス情報の追加を希望される方はお選びください。
                            </CardContent>
                            <CardActions>
                                <RequestAddDialog key={"request_add_service"} title={"[追加] サービス情報申請"}/>
                            </CardActions>
                        </Card>
                    }
                    {
                        data != null && data?.service != null && data.service?.filter(value => !value.pass).length > 0 &&
                        <Card key={"change_abolished_service"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    サービスの変更/廃止手続き
                                </Typography>
                                <br/>
                                サービス情報の変更（JPNIC管理者連絡窓口やJPNIC技術連絡窓口などのJPNICに登録している情報の変更、IPアドレス廃止をご希望の方）
                                <br/>
                                サービス情報の廃止（ご契約頂いているサービスごと廃止をご希望の方）
                                <br/>
                                以上に当てはまる方は、お選びください
                            </CardContent>
                            <CardActions>
                                <Button variant="outlined" onClick={ServiceListPage}>次へ</Button>
                            </CardActions>
                        </Card>
                    }
                    {
                        data != null && data?.service != null && data.service?.filter(value => value.add_allow).length > 0 &&
                        <Card key={"add_connection"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    接続追加手続き
                                </Typography>
                                <br/>
                                接続情報の追加を希望される方はお選びください。
                            </CardContent>
                            <CardActions>
                                <RequestAddDialog key={"request_add_connection"} title={"[追加] 接続情報申請"}/>
                            </CardActions>
                        </Card>
                    }
                    {
                        data != null && data?.connection != null && data.connection?.filter(value => !value.open).length > 0 &&
                        <Card key={"change_abolished_connection"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    接続の変更/廃止手続き
                                </Typography>
                                <br/>
                                接続情報の変更（IPアドレスやNOCの収容変更をご希望の方）
                                <br/>
                                接続情報の廃止（接続の廃止をご希望の方）
                                <br/>
                                以上に当てはまる方は、お選びください
                            </CardContent>
                            <CardActions>
                                <Button variant="outlined" onClick={ConnectionListPage}>次へ</Button>
                            </CardActions>
                        </Card>
                    }
                    {
                        data != null && data?.user != null && data.user?.group_id !== 0 &&
                        <Card key={"abolished_group"} className={classes.root}>
                            <CardContent>
                                <Typography variant="h5" component="h2">
                                    退会手続き
                                </Typography>
                                <br/>
                                退会をご希望の方はこちらをお選びください。
                            </CardContent>
                            <CardActions>
                                <RequestAddDialog key={"request_abolished_group"} title={"[退会] グループの退会申請"}/>
                            </CardActions>
                        </Card>
                    }
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export function StatusTable(props: {
    request: TicketData[]
}) {
    const {request} = props;
    const classes = useStyles2();
    const history = useHistory();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, request.length - page * rowsPerPage);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const ChatPage = (id: number) => history.push("/dashboard/support/" + id);

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell>申請内容</TableCell>
                        <TableCell align="right">作成日</TableCell>
                        <TableCell align="right">状況</TableCell>
                        <TableCell align="right">機能</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        (
                            rowsPerPage > 0
                                ? request.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : request
                        ).map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    {row.title}
                                </TableCell>
                                <TableCell style={{width: 300}} align="right">
                                    {row.created_at}
                                </TableCell>
                                <TableCell style={{width: 160}} align="right">
                                    {
                                        row.reject &&
                                        <Chip size="small" color="secondary" label="却下"/>
                                    }
                                    {
                                        !row.reject && !row.solved &&
                                        <Chip size="small" color="primary" label="申請中"/>
                                    }
                                    {
                                        !row.reject && row.solved &&
                                        <Chip size="small" color="primary" label="承諾/変更済み"/>
                                    }
                                </TableCell>
                                <TableCell style={{width: 100}} align="right">
                                    <Button size="small" variant="outlined"
                                            onClick={() => ChatPage(row.id)}>Chat</Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    {
                        emptyRows > 0 && (
                            <TableRow style={{height: 43 * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                            colSpan={4}
                            count={request.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {'aria-label': 'rows per page'},
                                native: true,
                            }}
                            onPageChange={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}/>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
