import React, {useEffect} from 'react';
import useStyles from "../styles"
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Grid,
    TextField,
} from "@material-ui/core";
import cssModule from "./ServiceList.module.scss";
import SwipeableViews from "react-swipeable-views";
import {useHistory, useParams} from "react-router-dom";
import {DefaultSupportAddData, ServiceData, UserData} from "../../../interface";
import {useSnackbar} from "notistack";
import {Get} from "../../../api/Info";
import {Post} from "../../../api/Request";
import {ServiceGet} from "./Service";

export function ServiceListChangeDialog(props: {
    service: ServiceData
}) {
    const {service} = props;
    const classes = useStyles();
    const history = useHistory();
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
                    history.push('/dashboard/support/' + res.data.id);
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
            title: "[" + service.service_id + " 変更]サービス変更手続き",
            data: "例)\n---JPNIC情報の変更---\nID: - \n変更理由: \n\n" +
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
                <DialogTitle id="customized-dialog-title">
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
                            <ServiceGet key={"serivce_get"} service={service}/>
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