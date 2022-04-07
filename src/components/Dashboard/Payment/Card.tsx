import React, {FormEvent, useState} from 'react';
import {loadStripe} from "@stripe/stripe-js";
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js";
import stripeJs from "@stripe/stripe-js";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import "./payment.scss"
import {restfulApiConfig} from "../../../api/Config";
import axios from "axios";
import Cookies from "js-cookie";
import {useSnackbar} from "notistack";

export function PaymentCardChangeDialog() {
    const [open, setOpen] = React.useState(false);
    const promise = loadStripe(restfulApiConfig.stripePublicKey!);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <div>
            <Button variant={"contained"} color="primary" onClick={handleClickOpen}>お支払い方法の変更</Button>
            <Dialog
                open={open}
                keepMounted
                onClose={handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">お支払い方法の変更</DialogTitle>
                <DialogContent>
                    <Elements stripe={promise}>
                        <ChangeCardForm/>
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

function ChangeCardForm() {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [processing, setProcessing] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [paymentProcess, setPaymentProcess] = useState(true);
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
    };

    const handleSubmit = async (ev: FormEvent) => {
        ev.preventDefault();
        setPaymentProcess(true);
        setProcessing(true);
        axios.get(restfulApiConfig.apiURL + "/payment/card", {
            headers: {
                "Content-Type": "application/json",
                USER_TOKEN: Cookies.get('user_token')!,
                ACCESS_TOKEN: Cookies.get('access_token')!,
            },
        }).then(res => {
            console.log(res);
            stripe?.createPaymentMethod({
                type: "card",
                card: elements?.getElement(CardElement)!,
            }).then(res => {
                console.log("success");
                console.log(res.paymentMethod?.id);
                console.log(res.error);
                if (res.error === undefined) {

                    // if (res.paymentMethod. === "succeeded") {
                    axios.put(restfulApiConfig.apiURL + "/payment/card", {payment_method_id: res.paymentMethod?.id}, {
                        headers: {
                            "Content-Type": "application/json",
                            USER_TOKEN: Cookies.get('user_token')!,
                            ACCESS_TOKEN: Cookies.get('access_token')!,
                        },
                    }).then(res => {
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                        console.log(err.response);
                        setError(err.response.data.error);
                        enqueueSnackbar(err.response.data.error, {variant: "error"});
                    });
                    // setSucceeded(true);
                    // enqueueSnackbar("支払い成功", {variant: "success"});
                    // }
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
