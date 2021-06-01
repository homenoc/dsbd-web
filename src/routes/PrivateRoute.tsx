import React from "react";
import {Route, Redirect} from "react-router-dom";

const PrivateRoute: React.FC<{
    component: React.FC;
    path: string;
    exact: boolean;
}> = (props) => {
    const condition = loginStatus();

    return condition ? (<Route path={props.path} exact={props.exact} component={props.component}/>) :
        (<Redirect to="/login"/>);
};

const loginStatus = () => {
    return sessionStorage.getItem("access_token") !== null && sessionStorage.getItem("user_token") !== null;
}

export default PrivateRoute;