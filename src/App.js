import Register from "./components/Register";
// import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout"
import Thanks from "./components/Thanks"
import Adventures from "./components/Adventures";
export const config = {
  // endpoint:`http://13.126.57.172:8082/v1`,
  endpoint:`https://qkart-node-selva.herokuapp.com/v1`,
  // endpoint: `https://qkart-frontend-selva.herokuapp.com/api/v1`,
};

function App() {
  return (
    <Switch>
         <Route exact path="/"><Products /></Route>
         <Route path="/adventures/:adventureId"><Adventures /></Route>
         <Route path="/login"><Login /></Route>
         <Route path="/register"><Register/></Route>
         <Route path="/checkout"><Checkout/></Route>
         <Route path="/thanks"><Thanks/></Route>
    </Switch>
  );
}

export default App;
