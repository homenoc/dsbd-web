import React, {useEffect} from 'react';
import DashboardComponent from "../../components/Dashboard/Dashboard";
import {Button, Card, CardActions, CardContent, CardHeader, Container, Grid, Typography} from "@material-ui/core";
import useStyles from "./styles"
import {clearInfos, clearTemplates} from "../../store/action/Actions";
import store, {RootState} from "../../store";
import {InfoData, TemplateData} from "../../interface";
import {useSnackbar} from "notistack";
import {useSelector} from "react-redux";
import {Get, GetTemplate} from "../../api/Info";
import Cookies from "js-cookie";
import {useHistory} from "react-router-dom";
import "./membership.scss";
import {PaymentDialog} from "../../components/Dashboard/Payment/Payment";
import {PaymentCardChangeDialog} from "../../components/Dashboard/Payment/Card";


export default function Membership() {
    const classes = useStyles();
    const [data, setData] = React.useState<InfoData>();
    const [template, setTemplate] = React.useState<TemplateData>();
    const infos = useSelector((state: RootState) => state.infos);
    const templates = useSelector((state: RootState) => state.templates);
    const history = useHistory();
    const [isStatus, setIsStatus] = React.useState(0);
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

                if (tmpData.data.user?.group_id == null) {
                    setIsStatus(1);
                } else if (tmpData.data.group?.discount_rate === 100) {
                    setIsStatus(2);
                } else if (tmpData.data.info?.length == null) {
                    setIsStatus(3);
                } else if (tmpData.data.group?.paid) {
                    setIsStatus(4);
                }
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

    const DonatePage = () => {
        history.push("/dashboard/donate");
    }

    return (
        <DashboardComponent title="Membership">
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                {/*<Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>*/}
                {/*    Membership*/}
                {/*</Typography>*/}
                <Typography variant="h5" align="center" color="textSecondary" component="p">
                    当団体ではネットワーク接続などをご利用頂いている皆様に「会費」として運営費用の一部を2021年から負担して頂くことになりました。
                    {/*今後も継続して活動を続けていくために、運営費用の一部を利用者の皆様に負担していただく予定です。*/}
                </Typography>
            </Container>
            {
                isStatus === 1 &&
                <h2>グループ未登録のため、この操作は出来ません。</h2>
            }
            {
                isStatus === 2 &&
                <h2>{data?.group?.member_info}のため、費用は免除されます。</h2>
            }
            {
                isStatus === 3 &&
                <h2>開通処理後、会費の支払いを行ってください。</h2>
            }
            {
                isStatus === 4 &&
                <div>
                    <h3>定期支払いを解約する場合は、解約になりますので、「各種手続き ⇛ 退会手続き」をお選びください。</h3>
                    <br/>
                    <h2>支払い済みです。</h2>
                    <h2>有効期限: {data?.group?.member_expired}</h2>
                    <h2>Plan: {data?.group?.payment_membership_template}</h2>
                    {
                        data?.group?.discount_rate !== 100 && data?.group?.discount_rate !== 0 &&
                        <h2>{data?.group?.member_info}</h2>
                    }
                    {
                        data?.group?.automatic_update &&
                        <div>
                            <h2>自動更新が有効</h2>
                            <PaymentCardChangeDialog key={"payment_card_change_dialog"}/>
                        </div>
                    }
                    {
                        !data?.group?.automatic_update &&
                        <div>
                            <h2>自動更新が無効</h2>
                        </div>
                    }
                </div>
            }
            {
                isStatus === 0 &&
                <Container maxWidth="md" component="main">
                    <h3>支払いを行うと自動定期支払いになりますので、ご注意ください。</h3>
                    <Grid container spacing={5} alignItems="flex-end">
                        {
                            template?.payment_membership_template?.map((membership, index) => (
                                <Grid item xs={12} sm={6} md={6} key={index}>
                                    <Card>
                                        <CardHeader
                                            title={membership.title}
                                            // subheader={tier.subheader}
                                            titleTypographyProps={{align: 'center'}}
                                            subheaderTypographyProps={{align: 'center'}}
                                            // action={tier.title === 'Pro' ? <StarIcon/> : null}
                                            className={classes.cardHeader}
                                        />
                                        <CardContent>
                                            <div className={classes.cardPricing}>
                                                <Typography component="h2" variant="h3" color="textPrimary">
                                                    {/*${tier.price}*/}
                                                </Typography>
                                                <Typography variant="h6" color="textSecondary">
                                                    {membership.plan}
                                                </Typography>
                                            </div>
                                            <ul>
                                                {membership.comment}
                                            </ul>
                                        </CardContent>
                                        <CardActions>
                                            <PaymentDialog key={"payment_" + membership.ID} itemID={membership.ID}
                                                           url={"membership"}/>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                </Container>
            }
            <br/>
            <br/>
            <Container>
                <h3>寄付をしてくださる方はこちらからお願いいたします。</h3>
                <Button variant={"contained"} color="primary" onClick={DonatePage}>
                    寄付をご希望の方はこちらから
                </Button>
            </Container>

            <h5>決済システムとして、stripeを使用しております。</h5>
        </DashboardComponent>
    );
}