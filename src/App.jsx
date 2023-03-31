import { lazy, Suspense, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./page/login";
import Home from "./page/Home";
import { UserContext } from "./context";
import Student from "./component/Student";
import Loader from "./page/Home/Loader";

const NewStudent = lazy(() => import("./page/newStudent"));
const UpdateStudent = lazy(() => import("./page/updateStudent"));
const StudentInfo = lazy(() => import("./page/StudentInfo"));
const NotFound = lazy(() => import('./component/NotFound'));

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
          <Route path="/newStudent" element={
            <Suspense fallback={<div><Loader /></div>}>
              <NewStudent />
            </Suspense>
          } />
          <Route path="/updateStudent" element={
            <Suspense fallback={<div><Loader /></div>}>
              <UpdateStudent />
            </Suspense>
          } />
          <Route path="/studentInfo" element={
            <Suspense fallback={<div><Loader /></div>}>
              <StudentInfo />
            </Suspense>
          } />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={
          <Suspense fallback={<div><Loader /></div>}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
}

export default App;
