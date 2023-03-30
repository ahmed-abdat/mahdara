import "./login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context";



export default function Login() {
  const { logIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  const inpute = useRef();



  // students ref db

  const handelSubmit = (e) => {
    e.preventDefault();
    setPending(true);
    getData();
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const getData = async () => {
    if (!validateEmail(email)) {
      setError("! أدخل عنوان بريد إلكتروني صالح");
      setPending(false);
      return;
    }
    if (!validatePassword(password)) {
      setError("! يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
      setPending(false);
      return;
    }

    try {
      const res = await logIn(email, password);
      const emailes = res.user.email;
      localStorage.setItem("user", emailes);
      setPending(false);
      navigate("/");
    } catch (e) {
      setPending(false);
      console.log(e.message);
      if (
        e.message == "Firebase: Error (auth/network-request-failed)." ||
        e.message == "Firebase: Error (auth/internal-error)."
      ) {
        setError("تأكد من إتصالك بالإنترنت و حاول مرة أخرى");
      } else {
        setError("! إسم المستخدم أو كلمة المرور خطأ");
      }
    }
  };

  useEffect(() => {
    localStorage.clear();
    inpute.current.focus();
  }, []);

  return (
    <div className="login">
      <form onSubmit={handelSubmit}>
        <img src="./logo.jpg" alt="" />
        <h1>تسجيل الدخول</h1>
        <label htmlFor="username">إسم المستخدم</label>
        <div className={`input ${error ? "input-error" : ""}`}>
          <FontAwesomeIcon icon={faUser} />
          <input
            ref={inpute}
            type="text"
            placeholder="إسم المستخدم"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <FontAwesomeIcon icon={faExclamationCircle} />}
        </div>
        <label htmlFor="password">كلمة السر</label>
        <div className={`input ${error ? "input-error" : ""}`}>
          <FontAwesomeIcon icon={faLock} />
          <input
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <FontAwesomeIcon icon={faExclamationCircle} />}
        </div>
        <button className={`${pending ? "disable" : ""}`}>تسجيل الدخول</button>
        {error && (
          <>
            <div className="error">
              <p>{error}</p>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
