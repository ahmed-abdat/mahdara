import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import "./updateStudent.css";
import { useNavigate } from "react-router-dom";
import {
  updateConnectionStatus,
  UpdateStudentCurentIndex,
  updateUser,
} from "../../features/fireBase";

export default function newStudent() {
  const isclosed = useSelector((state) => state.close.value);
  const { data } = useSelector((state) => state.firebase);
  const [isUpdated, setIsUpdated] = useState(false);

  // curent Date
  const curentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    return `${year}/${month}/${day}`;
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [newId, setNewId] = useState("");
  const [studetnId, setStudentId] = useState("");
  const [checkId, setChcekId] = useState(true);
  const [isValidID, setIsValidID] = useState(true);
  const [date, setDate] = useState(curentDate());
  const [newDate, setNewDate] = useState("");
  const [checkDate, setChcekDate] = useState(true);
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState({
    value: "التجويد",
    label: "التجويد",
  });

  const { connection, curentStudentUpdateIndex } = useSelector(
    (state) => state.firebase
  );

  const { category : categoryes } = useSelector((state) => state.category);

  let categoryOptions 

  if(categoryes.length > 0) {
    categoryOptions = categoryes.filter(category => {
      return category.label !== 'الكل'
    })
  }


  useEffect(() => {
    const storedIndex = localStorage.getItem("StudentCurentIndex");
    if (storedIndex) {
      dispatch(UpdateStudentCurentIndex(JSON.parse(storedIndex)));
    }
  }, []);

  useEffect(() => {
    const student = data.find(
      (student) => +student.uid === curentStudentUpdateIndex
    );
    if (student) {
      setNewId(student.uid);
      setPhone(student.phone);
      setNewDate(student.date);
      setCategory(student.category);
      setName(student.name);
      setPrice(student.price);
      setStudentId(student.id);
    }
  }, [curentStudentUpdateIndex]);

  // selecte
  const hanedlChange = (selectedOption) => {
    setCategory(selectedOption);
  };
  // selecte compoonent
  function CategorySelect() {
    return (
      <Select options={categoryOptions} onChange={hanedlChange} value={category} />
    );
  }

  const validationID = () => {
    if (checkId) {
      setIsValidID(true);
      return newId;
    } else if (id === "" || data.some((el) => +el.uid === +id) || +id === 0) {
      setIsValidID(false);
      return false;
    } else {
      setIsValidID(true);
      return id;
    }
  };

  // handel id input
  const handelValue = () => {
    if (checkId) {
      return newId;
    } else {
      return id;
    }
  };

  // hande dates input
  const handelCheckDate = () => {
    if (checkDate) {
      return newDate;
    } else {
      return date;
    }
  };

  // handel Price input
  const handelPrice = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value))) {
      setPrice(+value);
    }
  };

  // handel id input
  const handelId = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value))) {
      setId(+value);
    }
  };
  // handel phone input
  const handePhoneInput = (e) => {
    const { value } = e.target;
    if (!isNaN(Number(value))) {
      setPhone(+value);
    }
  };

  // ? handel form change
  const handelSubmit = (e) => {
    e.preventDefault();
    const isIdExist = validationID();
    const curentDate = handelCheckDate();

    if (isIdExist && connection) {
      updateStudent(isIdExist, studetnId, curentDate);
    }
  };

  //   update student
  const updateStudent = async (validId, studetnId, curentDate) => {
    setIsUpdated(true);
    console.log(studetnId );
    console.log("#########");
    console.log({
      uid: parseInt(validId),
      name,
      phone,
      price,
      category,
      timestamp: serverTimestamp(),
      date: curentDate,
      createdDate: new Date().getTime(), // add updated date field
    });
    try {
      const studentsRef = doc(db, "students", studetnId);
      const dataStudents = {
        uid: parseInt(validId),
        name,
        phone,
        price,
        category,
        timestamp: serverTimestamp(),
        date: curentDate,
        createdDate: new Date().getTime(), // add updated date field
      };

      await updateDoc(studentsRef, dataStudents);

      dispatch(updateUser({ id: studetnId, user: dataStudents }));
      localStorage.setItem('StudentCurentIndex', null)
      navigate("/");
      setIsUpdated(false);
    } catch (error) {
      setIsUpdated(false);
      console.error("Error updating document: ", error);
    }
  };
  // handel cancel 
  const handelCancel = ()=> {
    localStorage.setItem('StudentCurentIndex', null)
    navigate('/')
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
          <div className="input phone">
            <div className="category">
            <h4>القسم :</h4>
            <CategorySelect />
          </div>
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
              onClick={handelCancel}
            >
              إلغاء
            </button>
            <button className={`send ${isUpdated ? "disable" : ""}`}>
              {isUpdated ? "جاري التحديث..." : "تحدبث بيانات الطالب(ة)"}
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
