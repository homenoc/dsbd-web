import React, {useEffect, useRef, useState} from "react";
import {ChatData, TicketData, UserData} from "../../../interface";
import useStyles from "./styles";
import {Paper} from "@material-ui/core";
import {restfulApiConfig} from "../../../api/Config";
import useWebSocket from "react-use-websocket";
import {MessageLeft, MessageRight} from "./Message";
import {TextInput} from "./TextInput";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import store, {RootState} from "../../../store";
import Cookies from "js-cookie";
import {clearInfos, clearTemplates} from "../../../store/action/Actions";
import {Get} from "../../../api/Info";

export default function SupportDetail() {
    const classes = useStyles();
    let id: string;
    ({id} = useParams());
    const {sendMessage, lastMessage} = useWebSocket(restfulApiConfig.wsURL + "/support" +
        '?id=' + id + '&user_token=' + Cookies.get('user_token') + '&access_token=' +
        Cookies.get('access_token'), {
        onOpen: () => enqueueSnackbar("WebSocket接続確立", {variant: "success"}),
        onClose: () => enqueueSnackbar("WebSocket切断", {variant: "error"}),
        shouldReconnect: (closeEvent) => true,
    });
    const {enqueueSnackbar} = useSnackbar();
    const [baseChatData, setBaseChatData] = useState<ChatData[]>();
    const [inputChatData, setInputChatData] = useState("");
    const [tickets, setTickets] = useState<TicketData>();
    const [userList, setUserList] = useState<UserData[]>();
    const infos = useSelector((state: RootState) => state.infos);

    const [sendPush, setSendPush] = useState(false);
    const ref = useRef<HTMLDivElement>(null);


    useEffect(() => {
        // info
        console.log(infos);
        const length = infos.length;
        const tmpData = infos[length - 1];
        console.log(Cookies.get("access_token"))
        console.log(Cookies.get("user_token"))
        if (tmpData.error !== undefined || tmpData.data !== undefined) {
            if (tmpData.error !== undefined) {
                if (tmpData.error?.indexOf("[401]") !== -1) {
                    console.log("logout");
                    Cookies.remove('user_token');
                    Cookies.remove('access_token');
                    store.dispatch(clearInfos());
                    store.dispatch(clearTemplates());
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                } else {
                    enqueueSnackbar(tmpData.error, {variant: "error"});
                }
            } else if (tmpData.data !== undefined && tmpData.data?.ticket !== undefined) {
                console.log(tmpData)
                if (tmpData.data.user_list !== undefined) {
                    setUserList(tmpData.data.user_list);
                }
                const ticketOne = tmpData.data.ticket.filter(ticket => ticket.id === Number(id));

                if (ticketOne !== undefined) {
                    setTickets(ticketOne[0]);
                    if (ticketOne[0].chat !== undefined) {
                        setBaseChatData(ticketOne[0].chat);
                    }
                }
            }
        } else {
            Get().then();
            enqueueSnackbar("Info情報の更新: " + tmpData.lastUpdated, {variant: "info"});
        }
    }, [infos]);

    useEffect(() => {
        console.log(lastMessage)
        if (lastMessage !== null) {
            console.log(lastMessage?.data)
            const obj = JSON.parse(lastMessage?.data);
            console.log(obj)

            if (baseChatData !== undefined) {
                setBaseChatData([...baseChatData, {
                    ticket_id: Number(id),
                    admin: obj.admin,
                    data: obj.message,
                    created_at: obj.time,
                    user_id: obj.user_id,
                    user_name: obj.username
                }]);
            }
            // setBaseChatData(tmpChat => [...tmpChat, {
            //     admin: obj.admin,
            //     data: obj.message,
            //     time: obj.time,
            //     user_name: obj.username
            // }]);
            if (obj.admin) {
                enqueueSnackbar("送信しました。", {variant: "success"})
            } else {
                enqueueSnackbar("新規メッセージがあります", {variant: "success"})
            }
            ref.current?.scrollIntoView()
        }
    }, [lastMessage]);

    useEffect(() => {
        if (sendPush) {
            sendMessage(JSON.stringify({
                access_token: Cookies.get('access_token'),
                user_token: Cookies.get('user_token'),
                message: inputChatData
            }));
            setSendPush(false);
        }
    }, [sendPush]);

    const getUser = (id: number) => {
        const result = userList?.filter(user => user.id === id);
        console.log(result);
        if (result === undefined) {
            return "不明";
        }
        return result[0].name;
    }

    return (
        <div>
            <div className={classes.container}>
                <Paper className={classes.paper}>
                    <Paper id="style-1" className={classes.messagesBody}>
                        {
                            baseChatData !== undefined &&
                            baseChatData.map((chat, index) =>
                                !chat.admin ?
                                    <MessageRight key={index} message={chat.data} timestamp={chat.created_at}
                                                  displayName={getUser(chat.user_id)}/>
                                    :
                                    <MessageLeft key={index} message={chat.data} timestamp={chat.created_at}
                                                 displayName={"運営"}/>
                            )
                        }
                        <div ref={ref}/>
                    </Paper>
                    <TextInput key={"textInput"} inputChat={inputChatData} setInputChat={setInputChatData}
                               setSendPush={setSendPush}/>
                </Paper>
            </div>
        </div>
    );
}