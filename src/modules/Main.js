import React from "react";
import Header from "./Header";
import Home from "../components/Home";
import Article from "../components/Article";
import Footer from "./Footer";
import Login from "../components/Auth/Login";
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";

export default function Main(props) {
    return (
        <>
            <Header props />
            <Switch>
                <Route exact path="/">
                    <Redirect to="/home" />
                </Route>
                <Route exact path="/home" component={Home} />
                <Route exact path="/articles/:articleId">
                    <Article />
                </Route>
                <Route path="*" component={() => "404 NOT FOUND"} />
            </Switch>
            <Footer />
        </>
    );
}
