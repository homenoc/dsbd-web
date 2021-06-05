import React from 'react';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel,
    Grid, Radio, RadioGroup,
    TextField,
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {DefaultSupportAddData} from "../../interface";
import {useSnackbar} from "notistack";
import useStyles from "./styles";
import {Post} from "../../api/Support";
import {Get} from "../../api/Info";


export function SupportAddDialog(props: {
    groupEnable: boolean
}) {
    const {groupEnable} = props;
    const classes = useStyles();
    const history = useHistory();
    const [data, setData] = React.useState(DefaultSupportAddData);
    const [open, setOpen] = React.useState(false);
    const {enqueueSnackbar} = useSnackbar();

    const request = () => {
        if (data.title === "") {
            enqueueSnackbar("タイトルが入力されていません。", {variant: "error"});
        }
        if (data.data === "") {
            enqueueSnackbar("本文が入力されていません。", {variant: "error"});
        }
        Post(data).then(res => {
            if (res.error === undefined) {
                Get().then(() => {
                    history.push('/dashboard/support/' + res.data.id);
                });
            } else {
                enqueueSnackbar(res.error, {variant: "error"});
            }
        })
    }

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                チケットの作成
            </Button>
            <Dialog onClose={() => setOpen(false)} fullScreen={true} aria-labelledby="customized-dialog-title"
                    open={open}
                    PaperProps={{
                        style: {
                            backgroundColor: "#2b2a2a",
                        },
                    }}>
                <DialogTitle id="customized-dialog-title">
                    Support情報の追加
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <h3>ユーザチャットとグループチャットの違い</h3>
                            <div>ユーザチャット: ログインユーザと1対1のチャットになります。</div>
                            <div>グループチャットチャット: ログインユーザのグループとのチャット（基本はこちらでお願いします。）</div>
                            <RadioGroup row aria-label="position" name="position" defaultValue="top"
                                        onChange={(event) => {
                                            setData({...data, is_group: event.target.value === "group"})
                                        }}>
                                <FormControlLabel value={"user"} control={<Radio color="primary"/>} label="ユーザチャット"/>
                                <FormControlLabel value={"group"} control={<Radio color="primary"/>}
                                                  disabled={!groupEnable} label="グループチャット"/>
                            </RadioGroup>
                            <br/>
                            <TextField
                                className={classes.formVeryLong}
                                id="title"
                                label="Title"
                                multiline
                                rows={1}
                                value={data.title}
                                onChange={event => setData({...data, title: event.target.value})}
                                variant="outlined"
                            />
                            <br/>
                            <TextField
                                className={classes.formVeryLong}
                                id="data"
                                label="内容"
                                multiline
                                rows={6}
                                value={data.data}
                                onChange={event => setData({...data, data: event.target.value})}
                                variant="outlined"
                            />
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
