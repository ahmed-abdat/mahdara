import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UpdateStudentCurentIndex } from "../../features/fireBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyCheckDollar,
  faFileEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./studentinfo.css";
import {updateUser} from '../../features/fireBase'
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

export default function index() {
  const isclosed = useSelector((state) => state.close.value);
  const { data } = useSelector((state) => state.firebase);
  const [isUpdated, setIsUpdated] = useState(false);

  

  // curent year
  const currentYear = new Date().getFullYear()


  // state
  const [studente, setStudente] = useState(null);
  const [allMonths, setAllMonths] = useState(null);
  const [unpaidMonths, setUnpaidMonths] = useState(null);
  const [unpaidYears , setUnpaidYears] = useState(currentYear);
  const [selecteUnpaidYear , setSelecteUnpaidYear] = useState({label : currentYear , value : currentYear});
  const [selcteUnpaidMonths , setSelecteUnpaidMonths] = useState(null);
  const [allSelecteUnpaidMonths , setAllSelcteUnpaidMonths] = useState(null)
  const [totalPaid, setTotalPaid] = useState(0);
  const [isPayShow , setIsPayShow] = useState(false)


  const dispatch = useDispatch();
  const navigate = useNavigate()

  const { connection, curentStudentUpdateIndex } = useSelector(
    (state) => state.firebase
  );

    // const selecte option 
    const selecteOptions = (selecte)=> {
      return selecte.map(el => ({value : el , label : el}))
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
      setStudente(student);
      const months = howManyMonth(student.date);
      setAllMonths(months);
      const {totalPaid , unpaidMonthNames} = countUnpaidMonths(student)
      setTotalPaid(totalPaid)
      setUnpaidMonths(unpaidMonthNames)
      setAllSelcteUnpaidMonths(selecteOptions(unpaidMonthNames))
      setUnpaidYears(selecteOptions(getUnpaidYears(student)));
    }
  }, [curentStudentUpdateIndex , data]);



  // how many month
  const howManyMonth = (date) => {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let currentDay = currentDate.getDate();

    let createdDate = new Date(date);
    let createdMonth = createdDate.getMonth() + 1;
    let createdYear = createdDate.getFullYear();
    let createdDay = createdDate.getDate();

    let months =
      (currentYear - createdYear) * 12 + (currentMonth - createdMonth);
    if (currentDay < createdDay) {
      months--;
    }
    return months;
  };

  // count unpaid month
  const countUnpaidMonths = (student) => {
    const unpaidMonthNames = [];
    const registrationDate = new Date(student.date);
    const registrationMonth = registrationDate.getMonth() + 1;
    const registrationYear = registrationDate.getFullYear();
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    let totalPaid = 0;
  
    for (let year = registrationYear; year <= currentYear; year++) {
      let startMonth = year === registrationYear ? registrationMonth : 1;
      let endMonth = year === currentYear ? currentMonth : 12;
  
      for (let month = startMonth; month <= endMonth; month++) {
        // Skip the current month
        if (year === currentYear && month === currentMonth) {
          continue;
        }
  
        const monthObj = student.months[year][month - 1];
        if (monthObj.status === "لم يتم الدفع") {
          unpaidMonthNames.push(monthObj.name);
        } else {
          totalPaid += student.price;
        }
      }
    }

    return { unpaidMonthNames, totalPaid };
  };

  // unpaid years 
  const getUnpaidYears = (student) => {
    const unpaidYears = [];
    const registrationDate = new Date(student.date);
    const registrationYear = registrationDate.getFullYear();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
  
    for (let year = registrationYear; year <= currentYear; year++) {
      let isYearPaid = true;
  
      for (let month = 0; month < student.months[year].length; month++) {
        const monthObj = student.months[year][month];
        if (monthObj.status === "لم يتم الدفع") {
          isYearPaid = false;
          break;
        }
      }
  
      if (!isYearPaid) {
        unpaidYears.push(year);
      }
    }
  
    return unpaidYears;
  };
  

  // handel  selcte months and years
  const handelMonthsChange = (selectedOption) => {
    setSelecteUnpaidMonths(selectedOption)
  };

  // selecte Month compoonent
  function MonthsUnpaid() {
    return (
      <Select options={allSelecteUnpaidMonths} onChange={handelMonthsChange} value={selcteUnpaidMonths} />
    );
  }

  // hande Year change
  const handelYearsChange = (selectedOption) => {
    setSelecteUnpaidYear(selectedOption)
  };

  // selecte Year component
    // selecte compoonent
    function YearsUnpaid() {
      return (
        <Select options={unpaidYears} onChange={handelYearsChange} value={selecteUnpaidYear} />
      );
    }
    // is arrays are the same
    function arraysAreEqual(arr1, arr2) {
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    }
    

    // ! handelPayment
    const handelPayment = async ()=> {
      const updatedMonthse = {months :  {[selecteUnpaidYear.label] : studente.months[selecteUnpaidYear.label].map(month => {
        if (month.name === selcteUnpaidMonths?.label) {
          return { ...month, status: 'تم الدفع' , amountPaid : studente.price};
        }
        return month;
      })} , timestamp : serverTimestamp(), createdDate: new Date().getTime()}


      if(connection && selcteUnpaidMonths){
        setIsUpdated(true);
      try {
        const studentsRef = doc(db, "students", studente.id);
        await updateDoc(studentsRef, updatedMonthse);
        dispatch(updateUser({id : studente.id , user : updatedMonthse}))
        navigate("/");
        setIsUpdated(false);
      }catch(e){
        setIsUpdated(false);
        console.error(e);
      }
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
    <main className={`${isclosed ? "close" : ""} newStudent ${isPayShow ? 'p-initial' : ''}`}>
      <div className="container--studentInfo">
        <div className="title">
          <h3>معلومات الطالب(ة)</h3>
        </div>
        <div className="info">
          <p>الإسم : <span>{studente?.name}</span></p>
          <p>رقم القيد :  <span>{studente?.uid}</span></p>
          <p>رقم هاتف الوكيل : <span>{studente?.phone}</span></p>
          <p> القسم : <span>{studente?.category?.label}</span></p>
          <p> الرسوم : <span>{studente?.price} MRU</span></p>
          <p> تاريخ التسجيل : <span>{studente?.date}</span></p>
          <p>عدد الأشهر من التسجيل حتى الآن : <span>{allMonths}</span></p>
          <p>
             المتأخرات : <span>{unpaidMonths && unpaidMonths.length > 0
              ? unpaidMonths.join(" , ")
              : "لاتوجد أي متأخرات"}</span>
          </p>
          <p> المبلغ الإجمالي المدفوع : <span>{totalPaid} MRU</span></p>

        </div>
        <div className="btns">
          <button className="pay" onClick={()=> setIsPayShow(true)}>المخالصة <FontAwesomeIcon icon={faMoneyCheckDollar} /> </button>
          <button className="edit" onClick={()=> navigate('/updateStudent')}>تعديل معلومات الطالب <FontAwesomeIcon icon={faFileEdit} /></button>
        </div>
        {/* !popup pays */}
        <div className={`wrapper ${isPayShow ? '' : 'hide'}`}>
         <div className="pays">
         <div className="title">
            <h3>المخالصة</h3>
          </div>
          <div className="info">
            <p>إسم الطالب (ة) :  <span>{studente?.name}</span></p>
            <p>رقم القيد :  <span>{studente?.uid}</span></p>
          </div>
          <div className="time">
            <div className="months">
              <h4>الشهر :</h4>
              <MonthsUnpaid />
            </div>
            <div className="months">
              <h4>السنة :</h4>
              <YearsUnpaid />
            </div>
          </div>
          <div className="btns">
            <button className="cancel" onClick={()=> setIsPayShow(false)}>إلغاء</button>
            <button className={`pay ${isUpdated ? "disable" : ""}`} onClick={handelPayment}>{isUpdated ? "جاري المخالصة..." : "المخالصة"} <FontAwesomeIcon icon={faMoneyCheckDollar} /></button>
          </div>
          {unpaidMonths && unpaidMonths.length > 0 ? "" : <p className="offline"> عذرا يبدو بأنه لاتوجد أي متأخرات على الطالب(ة) </p>}
          {connection ? (
            ""
          ) : (
            <p className="offline"> عذرا يبدو بأنك غير متصل بالإنترنت </p>
          )}
         </div>
        </div>
      </div>
    </main>
  );
}
