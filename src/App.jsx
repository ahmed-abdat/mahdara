import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./page/login";
import Home from "./page/Home";
import { useContext } from "react";
import { UserContext } from "./context";
import Student from "./component/Student";
import NewStudent from "./page/newStudent";
import UpdateStudent from "./page/updateStudent";
import StudentInfo from "./page/StudentInfo";
import NotFound from './component/NotFound'

function App() {
  const { user } = useContext(UserContext);
  const userLocalstorage =  localStorage.getItem("user");
  const RequireAuth = ({ children }) => {
    return (userLocalstorage || user)  ? children : <Navigate to={"/login"} />;
  };

  return (

    <Router>
      <Routes>
        <Route path="/" element={<RequireAuth><Home /></RequireAuth> }>
          <Route path="/" element={<Student />} />
          <Route path="/newStudent" element={<NewStudent />} />
          <Route path="/updateStudent" element={<UpdateStudent />} />
          <Route path="/studentInfo" element={<StudentInfo />} />
        </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
