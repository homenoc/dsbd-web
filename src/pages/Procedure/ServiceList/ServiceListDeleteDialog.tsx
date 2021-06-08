import React, {useEffect, useState} from 'react';
import useStyles from "../styles"
import {
    AppBar,
    Button,
    Card,
    CardActions,
    CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid,
    Tab, Tabs, TextField,
    Typography, useTheme
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {useHistory, useParams} from "react-router-dom";
import {DefaultSupportAddData, ServiceData, UserData} from "../../../interface";
import {useSnackbar} from "notistack";
import Cookies from "js-cookie";
import store, {RootState} from "../../../store";
import {clearInfos, clearTemplates} from "../../../store/action/Actions";
import {useSelector} from "react-redux";
import {Get} from "../../../api/Info";
import Dashboard from "../../../components/Dashboard/Dashboard";
import {Delete, Put} from "../../../api/User";
import shaJS from "sha.js";
import {Post} from "../../../api/Request";
import {ServiceGet} from "./Service";

export function ServiceListDeleteDialog(props: {
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
        setData({...data, title: "[" + service.service_id + " 廃止]サービス廃止手続き"});
    }, []);

    return (
        <div>
            <Button variant="outlined" color="secondary" onClick={() => setOpen(true)}>サービス廃止手続き</Button>
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
                            <div>「{data.title}」の理由について詳しく説明してください。</div>
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