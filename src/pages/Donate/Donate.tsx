import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Card, CardActions, CardContent, Container, Grid, Typography} from "@mui/material";
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {TemplateData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get, GetTemplate} from "../../api/Info";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";
import {PaymentDialog} from "../../components/Dashboard/Payment/Payment";
import {StyledCardHeader1, StyledDivCardPricing} from "../Membership/styles";
import {StyledContainer1} from "../../style";


export default function Donate() {
    const [template, setTemplate] = React.useState<TemplateData>();
    const infos = useSelector((state: RootState) => state.infos);
    const templates = useSelector((state: RootState) => state.templates);
    const navigate = useNavigate();
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
                    navigate('/login');
                } else {
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                }
            } else if (tmpData.data != null) {

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
                    navigate('/login');
                }
            }
        })
    }, []);

    return (
        <DashboardComponent title="Donate">
            <StyledContainer1 maxWidth="sm">
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    寄付
                </Typography>
            </StyledContainer1>
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {
                        template?.payment_donate_template?.map((donate, index) => (
                            <Grid key={"donate_template_id_" + donate.ID} item xs={12} sm={6} md={3}>
                                <Card>
                                    <StyledCardHeader1
                                        title={donate.name}
                                        titleTypographyProps={{align: 'center'}}
                                        subheaderTypographyProps={{align: 'center'}}
                                    />
                                    <CardContent>
                                        <StyledDivCardPricing>
                                            <Typography component="h2" variant="h3" color="textPrimary">
                                                {/*${tier.price}*/}
                                            </Typography>
                                            <Typography variant="h6" color="textSecondary">
                                                {donate.fee}円
                                            </Typography>
                                        </StyledDivCardPricing>
                                        <ul>
                                            {donate.comment}
                                        </ul>
                                    </CardContent>
                                    <CardActions>
                                        <PaymentDialog key={"payment_" + donate.ID} itemID={donate.ID} url={"donate"}/>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
            <h5>決済システムとして、stripeを使用しております。</h5>
        </DashboardComponent>
    );
}
