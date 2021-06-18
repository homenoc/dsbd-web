import {makeStyles} from "@material-ui/core";

export default makeStyles(theme => ({
        rootInput: {
            minWidth: 100,
            marginBottom: 20,
        },
        root: {
            minWidth: 275,
            marginBottom: 5,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        cardHeader: {
            backgroundColor: theme.palette.grey[700],
        },
        cardPricing: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            marginBottom: theme.spacing(2),
        },
        heroContent: {
            padding: theme.spacing(8, 0, 6),
        },
    }),
);
