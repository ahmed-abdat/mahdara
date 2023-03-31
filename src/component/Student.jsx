import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Search from "./Search";
import Table from "./Table";
import { updateConnectionStatus, filtereData } from "../features/fireBase";

export default function Main() {
  // filter option chosen by user
  const isclosed = useSelector((state) => state.close.value);
  const { data, input, connection, filterData } = useSelector(
    (state) => state.firebase
  );
  const { currentMonth, currentStatus, currentCategory } = useSelector(
    (state) => state.selecte
  );
  // currentYear 
  const currentYear = new Date().getFullYear()
  const dispatch = useDispatch();
  // State
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isInputNumber, setIsInputNumber] = useState(true);

  useEffect(() => {
    const filterByInput = isNaN(Number(input))
      ? data.filter((student) => student.name.includes(input))
      : data.filter((student) => student.uid == input);

    const filterByStatusAndCategory = data.filter((student) => {
      if (currentStatus.value && currentCategory.value) {
        return (
          student.months[currentYear][currentMonth].status ===
            currentStatus.label &&
          student.category.label === currentCategory.label
        );
      } else if (currentStatus.value) {
        return (
          student.months[currentYear][currentMonth].status ===
          currentStatus.label
        );
      } else if (currentCategory.value) {
        return student.category.label === currentCategory.label;
      } else {
        return true;
      }
    });

    const filteredStudents =
      input === "" ? filterByStatusAndCategory.filter(el => el.startedMonth <= currentMonth) : filterByInput;
    setFilteredStudents(filteredStudents);
    setIsInputNumber(!isNaN(Number(input)));
  }, [data, input, currentStatus, currentCategory, currentMonth]);

  useEffect(() => {
    dispatch(filtereData(filteredStudents));
  }, [dispatch, filteredStudents]);

  useEffect(() => {
    function handleOnline() {
      data.length < 1 && location.reload();
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

  // console.log(filterData);

  return (
    <main className={`${isclosed ? "close" : ""}`}>
      <Search />

      {connection ? (
        <>
          {filterData.length > 0 ? (
            <Table />
          ) : filterData.length === 0 ? (
            <div className="no-table ">
              <h3>
                {input.length > 0 && isInputNumber ? (
                  <span>لايوجد اي طالب يحمل الرقم</span>
                ) : input.length > 0 && !isInputNumber ? (
                  <span>لايوجد اي طالب يحمل الإسم </span>
                ) : currentCategory.value && currentStatus.value ? (
                  <span> لايوجد أي طلاب في هذا القسم يحملون الحالة :</span>
                ) : currentCategory.value ? (
                  <span>لايوجد أي طلاب في هذا القسم</span>
                ) : currentStatus.label ? (
                  <span>لايوجد أي طلاب يحملون هذه الحالة</span>
                ) : (
                  <span></span>
                )}
                "
                <span>
                  {input ||
                    currentStatus.label && currentCategory.value ? currentStatus.label : currentCategory.value ||
                    currentCategory.value ||
                    currentStatus.label}
                </span>
                "
              </h3>
              <p>حاول مرة أخرى يمكنك البحث بستخدام الإسم أو الرقم</p>
            </div>
          ) : data.length > 0 ? (
            <Table />
          ) : (
            <div className="no-table">
              <h3>لايوجد أي طلاب !</h3>
              <p>يمكنك إضافة طالب(ة) من خلال ضغض على زر إضافة طالب(ة)</p>
            </div>
          )}
        </>
      ) : (
        <div className="offline no-table">
          <h3>لا يوجد اتصال بالإنترنت. يرجى التحقق من الاتصال بالشبكة.</h3>
          <p>قم بالإتصال بالشبكة وسيتم إعادة تحميل بيانات الطلاب تلقائيا</p>
        </div>
      )}
    </main>
  );
}
