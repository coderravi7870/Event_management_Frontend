import {BrowserRouter,Routes,Route} from "react-router-dom"
import { ToastContainer } from "react-toastify";
import Register from "./components/Register"
import Login from "./components/Login.jsx"

import EventDashboard from "./components/Dashboard/EventDashboard.jsx";
import CreateEvent from "./components/CreateEvent.jsx";
import EventAttendees from "./components/EventAttendees.jsx";


function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<EventDashboard/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/create-event" element={<CreateEvent/>}/>
      <Route path="/event/:eventId" element={<EventAttendees/>}/>
    </Routes>
    <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
    </BrowserRouter>
  )
}

export default App
