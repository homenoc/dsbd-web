import {colors} from "@material-ui/core";
import {createTheme} from "@material-ui/core/styles";

export const colorTheme = createTheme({
    palette: {
        primary: {
            main: colors.blue[800],
        },
        type: "dark",
    },
});
