import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faEnvelope,
  faUserCheck,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import "./style/Header.css";
import { useDispatch, useSelector } from "react-redux";
import Hamburger from "hamburger-react";
import {close} from '../features/closeNavBar'

export default function Header() {
  const userLocalstorage = localStorage.getItem("user");
  const dispatch = useDispatch()
  // state
  const [isPopup, setIsPopup] = useState(false);

  // isClose
  const isClosed = useSelector((state) => state.close.value);

  const navigate = useNavigate();
  //  handel Lougout
  const handelLoguot = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/login");
    } catch (e) {
      console.log("error: " + error);
    }
  };
  // navigate to create new student 
  const CreatNewStudent = ()=> {
    navigate('/newStudent')
  } 
  return (
    <header className={`${isClosed ? "close" : ""}`}>
      <div className="left-side" onClick={()=> {dispatch(close())}}>
      <Hamburger size={26} duration={0.4} hideOutline={true} />
      </div>
      <div className="right-side" >
        <div className={`popup ${isPopup ? "" : "hide"}`}>
          <div className="title">
            <img src="/mahdaralogo.jpg" alt="logo" />
            <h3> محمد إبراهيم عبدات </h3>
          </div>

          <div className="permession">
            <FontAwesomeIcon icon={faUserCheck} />
            <p>الصلاحيات : مدير المحظرة </p>
          </div>
          <div className="email">
            <FontAwesomeIcon icon={faEnvelope} />
            <p>
              الإيميل : <span>{userLocalstorage}</span>
            </p>
          </div>
          <button className="btn logout" onClick={handelLoguot}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <p>تسجيل الخروج</p>
          </button>
        </div>
        <FontAwesomeIcon icon={faPlus} onClick={CreatNewStudent} />
        <img src="/mahdaralogo.jpg" alt="mahdaralogo" onClick={() => setIsPopup((prev) => !prev)}/>
      </div>
    </header>
  );
}
