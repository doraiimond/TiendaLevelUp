import {BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/pages/Home";
import PerfilCliente from "../components/pages/PerfilCliente";
import PerfilAdmin from "../components/pages/PerfilAdmin";

const RouterConfig = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/perfil-cliente" component={PerfilCliente}/>
            <Route path="/perfil-admin" component={PerfilAdmin}/>
        </Switch>
    </Router>
);

export default RouterConfig;