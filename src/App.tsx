import React from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import SignIn from "./pages/Login/SignIn";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignUp from "./pages/Login/SignUp";
import PasswordRecovery from "./pages/Login/PasswordRecovery";
import PrivateRoute from "./routes/PrivateRoute";
import Info from "./pages/Info/Info";
import Support from "./pages/Support/Support";
import SupportDetail from "./pages/Support/SupportDetail/SupportDetail";
import Add from "./pages/Add/Add";
import Procedure from "./pages/Procedure/Procedure";
import UserList from "./pages/Procedure/UserList/UserList";
import UserDetail from "./pages/Procedure/UserList/UserDetail/UserDetail";

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Redirect from="/" to="/login" exact/>
                <Route exact path="/login" component={SignIn}/>
                <Route exact path="/register" component={SignUp}/>
                <Route exact path="/forget" component={PasswordRecovery}/>
                <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                <PrivateRoute exact path="/dashboard/add" component={Add}/>
                <PrivateRoute exact path="/dashboard/info" component={Info}/>
                <PrivateRoute exact path="/dashboard/support" component={Support}/>
                <PrivateRoute exact path="/dashboard/support/:id" component={SupportDetail}/>
                <PrivateRoute exact path="/dashboard/procedure" component={Procedure}/>
                <PrivateRoute exact path="/dashboard/procedure/user" component={UserList}/>
                <PrivateRoute exact path="/dashboard/procedure/user/:id" component={UserDetail}/>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
