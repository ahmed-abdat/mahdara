import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./newStudent.css";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../features/fireBase";
import { updateConnectionStatus } from "../../features/fireBase";

export default function newStudent() {
  const isclosed = useSelector((state) => state.close.value);
  const { data } = useSelector((state) => state.firebase);
  const [isUpdated, setIsUpdated] = useState(false);
  const { category : categoryes } = useSelector((state) => state.category);

  let categoryOptions 

  if(categoryes.length > 0) {
    categoryOptions = categoryes.filter(category => {
      return category.label !== 'الكل'
    })
  }
  
    // random category 
    const randomCategory = Math.floor(Math.random() * categoryes.length);

  const categoryInitialValue = categoryOptions ? categoryOptions[randomCategory] : {value : '' , label : ''}
  const currentYear = new Date().getFullYear();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  // curent Date
  const curentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };


 

  // state form 
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");

  const [checkId, setChcekId] = useState(true);
  const [isValidID, setIsValidID] = useState(true);
  const [date, setDate] = useState(curentDate());
  const [checkDate, setChcekDate] = useState(true);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState(categoryInitialValue);

  const { connection } = useSelector((state) => state.firebase);

  // month

  const months = {
    [currentYear] : [
      { name: "يناير", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "فبراير", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "مارس", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "أبريل", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "مايو", status: "لم يتم الدفع", amountPaid : 0 },
      { name: "يونيو", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "يوليو", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "أغسطس", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "سبتمبر", status: "لم يتم الدفع" , amountPaid : 0},
      { name: "أكتوبر", status: "لم يتم الدفع", amountPaid : 0 },
      { name: "نوفمبر", status: "لم يتم الدفع", amountPaid : 0 },
      { name: "ديسمبر", status: "لم يتم الدفع" , amountPaid : 0},
    ]
  }

  const hanedlChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  // unique id
  const uniqueId = () => {
    if (data.length) {
      const allId = data.map((el) => +el.uid);
      const maxID = Math.max(...allId) + 1;
      return maxID;
    }

    return "1";
  };

  // selecte compoonent
  function CategorySelecte() {
    return (
      <Select options={categoryOptions} onChange={hanedlChange} value={category} />
    );
  }
  // ? handel form change
  const handelSubmit = (e) => {
    e.preventDefault();
    const isIdExist = validationID();
    const validField = validationInput();
    if (isIdExist && validField && connection) {
      createStudent(isIdExist);
    }
  };

  const validationID = () => {
    if (checkId) {
      setIsValidID(true);
      return uniqueId();
    } else if (id === "" || data.some((el) => +el.uid === +id) || +id === 0) {
      setIsValidID(false);
      return false;
    } else {
      setIsValidID(true);
      return id;
    }
  };

  const validationInput = () => {
    if (name !== "" && name.length > 2 && date !== "" && price !== 0)
      return true;
    return false;
  };

  // ...

  const createStudent = async (valideId) => {
    setIsUpdated(true);
    try {
      const studentsRef = collection(db, "students");
      const dataStudents = {
        uid: parseInt(valideId),
        name,
        phone,
        price,
        category,
        months,
        timestamp: serverTimestamp(),
        date,
        startedMonth : new Date(date).getMonth(),
        satrtedYear : new Date(date).getFullYear(),
        createdDate: new Date().getTime(),
      };
     
      await addDoc(studentsRef, dataStudents);

      dispatch(addUser(dataStudents));
      setTimeout(() => {
        navigate("/");
        setIsUpdated(false);
      }, 100);
    } catch (error) {
      setIsUpdated(false);
      console.error("Error adding document: ", error);
    }
  };

  // handel id input
  const handelValue = () => {
    if (checkId) {
      return uniqueId();
    } else {
      return id;
    }
  };

  // hande dates input
  const handelCheckDate = () => {
    if (checkDate) {
      return curentDate();
    } else {
      return date;
    }
  };

  // handel Price input 
  const handelPrice = (e) => {
    const {value} = e.target
    if(!isNaN(Number(value))) {
      setPrice(+value)
    }
  }

  // handel id input 
  const handelId = (e) => {
    const {value} = e.target
    if(!isNaN(Number(value))){
      setId(+value)
    }
  }
  // handel phone input 
  const handePhoneInput = (e) => {
    const {value} = e.target
    if(!isNaN(Number(value))){
      setPhone(+value)
    }
  }
  // connection status
  useEffect(() => {
    function handleOnline() {
      dispatch(updateConnectionStatus(true));
    }

    function handleOffline() {
      dispatch(updateConnectionStatus(false));
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <main className={`${isclosed ? "close" : ""} newStudent sm-p-initial`}>
      <div className="form">
        <form onSubmit={handelSubmit}>
          <div className="header">
            <h2>إضافة طالب(ة) جديد(ة) </h2>
          </div>
          <div className="input">
            <label htmlFor="inputID">رقم القيد</label>
            <div className={`id ${isValidID ? "" : "not-valid"}`}>
              <input
                type="text"
                onChange={handelId}
                id="inputID"
                disabled={checkId}
                value={handelValue()}
              />
              <label htmlFor="checkID">رقم قيد تلقائي</label>
              <input
                type="checkbox"
                name="checkId"
                id="checkID"
                checked={checkId}
                onChange={(e) => setChcekId(e.target.checked)}
              />
            </div>
            {!isValidID && (
              <p className="error-msg">عذرا رقم القيد هذا غير متاح</p>
            )}
          </div>
          <div className="input name">
            <label htmlFor="name">إسم الطالب(ة)</label>
            <input
              type="text"
              placeholder="أدخل إسم الطالب (ة)"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="input phone">
            <label htmlFor="phoneNumber">هاتف الوكيل</label>
            <input
              type="text"
              placeholder="أدخل رقم هاتف الوكيل"
              id="phoneNumber"
              onChange={handePhoneInput}
              value={phone}
            />
          </div>
          <div className="category">
            <h4>القسم :</h4>
            <CategorySelecte />
          </div>
          <div className="input phone">
            <label htmlFor="phoneNumber"> الرسوم</label>
            <div className="price">
              <span className="unit">MRU</span>
              <input
                type="text"
                placeholder="أدخل رسوم الطالب(ة)"
                id="phoneNumber"
                onChange={handelPrice}
                value={price}
              />
            </div>
          </div>
          
          <div className="input time">
            <label htmlFor="time">تاريخ تسجيل الطالب(ة)</label>
            <div className="dated">
              <input
                type="text"
                value={handelCheckDate()}
                disabled={checkDate}
                id="inputDates"
                onChange={(e) => setDate(e.target.value)}
              />
              <label htmlFor="checkDates">تاريخ تلقائي</label>
              <input
                type="checkbox"
                id="checkDates"
                onChange={(e) => setChcekDate(e.target.checked)}
                checked={checkDate}
              />
            </div>
          </div>
          <div className="btnes">
            <button
              type="button"
              className="cancel"
              onClick={() => navigate("/")}
            >
              إلغاء
            </button>
            <button className={`send ${isUpdated ? "disable" : ""}`}>
              {isUpdated ? "جاري الإضافة..." : "تسجيل الطالب(ة)"}
            </button>
          </div>
          {connection ? (
            ""
          ) : (
            <p className="offline"> عذرا يبدو بأنك غير متصل بالإنترنت </p>
          )}
        </form>
      </div>
    </main>
  );
}
