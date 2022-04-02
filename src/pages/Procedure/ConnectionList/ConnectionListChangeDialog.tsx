import React, {useEffect} from 'react';
import useStyles from "../styles"
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid,
    TextField,
} from "@material-ui/core";
import {useNavigate} from "react-router-dom";
import {DefaultSupportAddData, InfosData} from "../../../interface";
import {useSnackbar} from "notistack";
import {Get} from "../../../api/Info";
import {Post} from "../../../api/Request";
import {InfoGet} from "../../../components/Dashboard/Info/Info";

export function ConnectionListChangeDialog(props: {
    info: InfosData
}) {
    const {info} = props;
    const classes = useStyles();
    const navigate = useNavigate();
    const [data, setData] = React.useState(DefaultSupportAddData);
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const request = () => {
        if (data.data === "") {
            enqueueSnackbar("本文が入力されていません。", {variant: "error"});
        }
        Post(data).then(res => {
            if (res.error === undefined) {
                Get().then(() => {
                    navigate('/dashboard/support/' + res.data.id);
                });
                setOpen(false);
            } else {
                enqueueSnackbar(res.error, {variant: "error"});
            }
        })
    }

    useEffect(() => {
        setData({
            ...data,
            title: "[" + info.service_id + " 変更]接続変更手続き",
            data: "例)\n---終端アドレスの変更---\nID: - \n変更理由: \n\n" +
                "---変更前---\n\n---変更後---\n"
        });
    }, []);

    return (
        <div>
            <Button variant="outlined" onClick={() => setOpen(true)}>サービス変更手続き</Button>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="connection_list_change_dialog">
                    {data.title}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <br/>
                            <TextField
                                className={classes.formVeryLong}
                                disabled={true}
                                id="title"
                                label="Title"
                                multiline
                                rows={1}
                                value={data.title}
                                onChange={event => setData({...data, title: event.target.value})}
                                variant="outlined"
                            />
                            <br/>
                            <div>変更前、変更後のことも詳しく説明してください。</div>
                            <div>内容によりまして、承諾できない可能性がありますがご了承ください。</div>
                            <br/>
                            <TextField
                                className={classes.formVeryLong}
                                id="data"
                                label="内容"
                                multiline
                                rows={10}
                                value={data.data}
                                onChange={event => setData({...data, data: event.target.value})}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InfoGet key={"info_get"} info={info}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                    <Button autoFocus onClick={request} color="primary">
                        登録
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
