import useRouteElements from "./useRouteElements";
import { ToastContainer } from "react-toastify";

function App() {
  const routeElements = useRouteElements();
  return (
    <div>
      {routeElements}
      <ToastContainer />
      console.log("hello");
    </div>
  );
}

export default App;
