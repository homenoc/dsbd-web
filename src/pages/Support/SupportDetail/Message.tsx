import React, {useRef} from 'react'
import remarkGfm from "remark-gfm";
import {StyledMessageTimeStampRight, StyledReactMarkdownMessageContent} from "./styles";
import {Avatar, Box} from '@mui/material';
import {StyledBlueMessage, StyledOrangeMessage} from "../../../style";
import { deepOrange } from '@mui/material/colors';

export const MessageLeft = (props: { message: string; timestamp: string; displayName?: string; }) => {
    const message = props.message ? props.message : 'no message';
    const timestamp = props.timestamp ? props.timestamp : '';
    const displayName = props.displayName ? props.displayName : '不明';
    const divRef = useRef<HTMLDivElement>(null);

    return (
        <Box sx={{display: 'flex'}}>
            <Avatar sx={{ bgcolor: deepOrange[500] }}>{displayName}</Avatar>
            <StyledBlueMessage>
                <div
                    ref={divRef}
                    style={{
                        borderRadius: 15,
                        width: '50vw',
                    }}
                >
                    <StyledReactMarkdownMessageContent
                        children={message}
                        skipHtml={true}
                        remarkPlugins={[remarkGfm]}
                    />
                </div>
                <StyledMessageTimeStampRight>{timestamp}</StyledMessageTimeStampRight>
            </StyledBlueMessage>
        </Box>
    )
}

export const MessageRight = (props: { message: string; timestamp: string; displayName?: string; }) => {
    const message = props.message ? props.message : 'no message';
    const displayName = props.displayName ? props.displayName : '不明';
    const timestamp = props.timestamp ? props.timestamp : '';
    const divRef = useRef<HTMLDivElement>(null);

    // @ts-ignore
    return (
        <Box sx={{display: "flex", justifyContent: "flex-end"}}>
            <StyledOrangeMessage>
                <div
                    ref={divRef}
                    style={{
                        borderRadius: 15,
                        width: '50vw',
                    }}
                >
                    <StyledReactMarkdownMessageContent
                        children={message}
                        skipHtml={true}
                        remarkPlugins={[remarkGfm]}
                        // escapeHtml={false}
                    />
                </div>
                <StyledMessageTimeStampRight>({displayName}) {timestamp}</StyledMessageTimeStampRight>
            </StyledOrangeMessage>
        </Box>
    )
}
