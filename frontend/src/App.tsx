import useRouteElements from "./useRouteElements";
import { ToastContainer } from "react-toastify";

function App() {
  const routeElements = useRouteElements();
  return (
    <div>
      {routeElements}
      <ToastContainer limit={1} />
      console.log("hello");
    </div>
  );
}

export default App;
