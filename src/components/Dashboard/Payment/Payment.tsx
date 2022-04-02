import React, {FormEvent, useState} from 'react';
import {loadStripe} from "@stripe/stripe-js";
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import stripeJs from "@stripe/stripe-js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Slide} from "@material-ui/core";
import {TransitionProps} from "@material-ui/core/transitions";
import "./payment.scss"
import {restfulApiConfig} from "../../../api/Config";
import axios from "axios";
import Cookies from "js-cookie";
import {useSnackbar} from "notistack";
import {Get} from "../../../api/Info";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function PaymentDialog(props: {
    itemID: number
    url: string
}) {
    const {itemID, url} = props;
    const [open, setOpen] = React.useState(false);
    const promise = loadStripe(restfulApiConfig.stripePublicKey!);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        Get().then();
        setOpen(false);
    };


    return (
        <div>
            <Button fullWidth variant={"contained"} color="primary" onClick={handleClickOpen}>支払い</Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">お支払い</DialogTitle>
                <DialogContent>
                    <Elements stripe={promise}>
                        <CheckoutForm itemID={itemID} url={url}/>
                    </Elements>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        閉じる
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function CheckoutForm(props: {
    itemID: number
    url: string
}) {
    const {itemID, url} = props;
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const stripe = useStripe();
    const elements = useElements();
    const {enqueueSnackbar} = useSnackbar();

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event: stripeJs.StripeCardElementChangeEvent) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
        // setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        setProcessing(true);

        axios.post(restfulApiConfig.apiURL + "/payment/" + url, {item_id: itemID}, {
            headers: {
                "Content-Type": "application/json",
                USER_TOKEN: Cookies.get('user_token')!,
                ACCESS_TOKEN: Cookies.get('access_token')!,
            },
        }).then(res => {
            console.log(res);
            stripe?.confirmCardPayment(res.data.client_secret, {
                payment_method: {
                    card: elements?.getElement(CardElement)!,
                },
            }).then(res => {
                if (res.error === undefined) {
                    console.log("success");
                    if (res.paymentIntent?.status === "succeeded") {
                        setSucceeded(true);
                        enqueueSnackbar("支払い成功", {variant: "success"});
                    }
                } else {
                    console.log("error");
                    console.log(res.error.message);
                    setError(res.error.message);
                    enqueueSnackbar(res.error.message, {variant: "error"});
                }
            }).catch(err => {
                console.log("error");
                console.log(err.response);
                setError(err.response.data.error);
                enqueueSnackbar(err.response.data.error, {variant: "error"});
            })
        }).catch(err => {
            console.log(err);
            console.log(err.response);
            setError(err.response.data.error);
            enqueueSnackbar(err.response.data.error, {variant: "error"});
        });
    };

    return (
        <div className={"stripe"}>
            <form id="payment-form" onSubmit={handleSubmit}>
                <CardElement id="card-element" options={cardStyle} onChange={handleChange}/>
                <button
                    disabled={processing || disabled || succeeded}
                    id="submit"
                >
        <span id="button-text">
          {processing ? (<div className="spinner" id="spinner"/>) : ("Pay now")}
        </span>
                </button>
                {error && (
                    <div className="card-error" role="alert">
                        {error}
                    </div>
                )}
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Thank you!
                    Payment succeeded.
                </p>
            </form>
        </div>
    );
}
