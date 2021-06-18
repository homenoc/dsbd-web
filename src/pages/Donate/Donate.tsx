import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Card, CardActions, CardContent, CardHeader, Container, Grid, Typography} from "@material-ui/core";
import useStyles from "./styles"
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {TemplateData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get, GetTemplate} from "../../api/Info";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";
import {PaymentDialog} from "../../components/Dashboard/Payment/Payment";


export default function Donate() {
    const classes = useStyles();
    const [template, setTemplate] = React.useState<TemplateData>();
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
                    history.push('/login');
                }
            }
        })
    }, []);

    return (
        <DashboardComponent title="Donate">
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    寄付
                </Typography>
            </Container>
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {
                        template?.payment_donate_template?.map((donate, index) => (
                            <Grid item xs={12} sm={6} md={3}>
                                <Card>
                                    <CardHeader
                                        title={donate.name}
                                        titleTypographyProps={{align: 'center'}}
                                        subheaderTypographyProps={{align: 'center'}}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <div className={classes.cardPricing}>
                                            <Typography component="h2" variant="h3" color="textPrimary">
                                                {/*${tier.price}*/}
                                            </Typography>
                                            <Typography variant="h6" color="textSecondary">
                                                {donate.fee}円
                                            </Typography>
                                        </div>
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