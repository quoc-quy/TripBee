import useRouteElements from './useRouteElements'
import { ToastContainer } from 'react-toastify'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const routeElements = useRouteElements()
  return (
    <div>
      <ScrollToTop />
      {routeElements}
      <ToastContainer limit={1} />
    </div>
  )
}

export default App

