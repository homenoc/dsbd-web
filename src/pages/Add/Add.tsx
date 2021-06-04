import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Button, Grid, Step, StepLabel, Stepper} from "@material-ui/core";
import useStyles from "./styles"
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {DefaultTemplateData, InfoData, TemplateData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get, GetTemplate} from "../../api/Info";
import Cookies from "js-cookie";
import ServiceAddDialogs from "./ServiceAdd/ServiceAdd";
import ConnectionAddDialogs from "./ConnectionAdd/ConnectionAdd";
import {useHistory} from "react-router-dom";
import GroupAddDialogs from "./GroupAdd/GroupAdd";

function getSteps() {
    return ['グループ登録', 'サービス情報の登録', '接続情報の登録'];
}

export default function Add() {
    const classes = useStyles();
    const [data, setData] = React.useState<InfoData>();
    const [reload, setReload] = React.useState(false);
    const [openGroup, setOpenGroup] = React.useState(false);
    const [openService, setOpenService] = React.useState(false);
    const [openConnection, setOpenConnection] = React.useState(false);
    const [template, setTemplate] = React.useState<TemplateData>(DefaultTemplateData);
    const infos = useSelector((state: RootState) => state.infos);
    const history = useHistory();
    const {enqueueSnackbar} = useSnackbar();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();

    useEffect(() => {
        GetTemplate().then(res => {
            if (typeof res === "object") {
                setTemplate(res);
            } else {
                enqueueSnackbar(res, {variant: "error"});
                if (res.indexOf("[401]") !== -1) {
                    Cookies.remove('user_token');
                    Cookies.remove('access_token');
                    store.dispatch(clearInfos());
                    store.dispatch(clearTemplates());
                    enqueueSnackbar(res, {variant: "error"});
                    history.push('/login');
                }
            }
        })
    }, []);

    useEffect(() => {
        Get().then();
    }, [reload]);


    useEffect(() => {
        // info
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
                    setActiveStep(0);
                } else if (tmpData.data.group?.add_allow) {
                    setActiveStep(1);
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
                            setActiveStep(2);
                        }
                    } else {
                        setActiveStep(3);
                    }
                }

            } else {
                console.log("Renew");
                Get().then();
                const date = new Date();
                enqueueSnackbar("Info情報の更新: " + date.toLocaleString(), {variant: "info"});
            }
        }
    }, [infos]);

    return (
        <DashboardComponent title="申請手続き">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {
                            steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))
                        }
                    </Stepper>
                </Grid>
                <Grid item xs={12}>
                    {
                        activeStep === 0 && data?.user !== undefined &&
                        <div>
                            <div>アカウント登録後、以下の「グループ情報の申請」のボタンより申請を行ってください。</div>
                            <br/>
                            <Button variant="contained" color={"primary"}
                                    onClick={() => setOpenGroup(true)}>グループ情報の申請（初期申請）</Button>
                            <GroupAddDialogs open={openGroup} setOpen={setOpenGroup}
                                             userData={data.user} reload={setReload}/>
                        </div>
                    }
                </Grid>
                <Grid item xs={12}>
                    {
                        activeStep === 1 && data?.group !== undefined &&
                        <div>
                            <div>ネットワーク接続を希望の方は、「サービス情報の申請」申請ボタンより行ってください。</div>
                            <br/>
                            <Button variant="contained" color={"primary"}
                                    onClick={() => setOpenService(true)}>サービス情報の申請</Button>
                            <ServiceAddDialogs template={template} open={openService} setOpen={setOpenService}
                                               groupData={data?.group}
                                               reload={setReload}/>
                        </div>
                    }
                </Grid>
                <Grid item xs={12}>
                    {
                        activeStep === 2 && data?.group !== undefined && data?.service !== undefined &&
                        <div>
                            <div>接続先の情報を登録する必要があるため、「接続情報の申請」ボタンより申請を行ってください。</div>
                            <Button variant="contained" color={"primary"}
                                    onClick={() => setOpenConnection(true)}>接続情報の申請</Button>
                            <ConnectionAddDialogs open={openConnection} setOpen={setOpenConnection}
                                                  baseData={data?.group} serviceData={data?.service}
                                                  reload={setReload} template={template}/>
                        </div>
                    }
                </Grid>
            </Grid>
        </DashboardComponent>
    );
}