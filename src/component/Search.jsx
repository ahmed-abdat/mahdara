import "./style/search.css";
import MonthSelecte from "./selecte/MonthSelecte";
import CategoryCreatebalSelect from "./selecte/CategoryCreatebalSelect";
import StatusSelect from "./selecte/StatusSelecte";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {filterUser , deleteAllUsers} from '../features/fireBase'
import { collection, deleteDoc, getDocs } from "firebase/firestore";
import {db} from '../config/firebase'

export default function Search() {
  const dispatch = useDispatch()
  // clear the text input
  const [isShow, setIsShow] = useState(false);
  const  {input }  = useSelector((state) => state.firebase);
  // handel change
  const handelChange = (e) => {
    const { value } = e.target;
    dispatch(filterUser(value))
    if (value.length > 0) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  };
  // hande Clear Input value
  const handelClearInput = () => {
    dispatch(filterUser(''))
    setIsShow(false);
  };
  const navigate = useNavigate();

  // dlelte all users

  const deleteAllUser = async () => {
    const collectionRef = collection(db, "students");
    const querySnapshot = await getDocs(collectionRef);
  
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });

    dispatch(deleteAllUsers())
  }
  

  return (
    <div className="search">
      <div className="search--input">
        <div className="input">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="إبحث باستخدام الإسم أو رقم القيد..."
            onChange={handelChange}
            value={input}
          />
          <div
            className={`${!isShow ? "hide" : ""} clear`}
            onClick={handelClearInput}
          >
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
        <div className="search--category">
          <h4>القسم : </h4>
          <CategoryCreatebalSelect />
        </div>
        <div className="search--months">
          <h4>الشهر : </h4>
          <MonthSelecte />
        </div>
        <div className="search--status">
          <h4>الحالة : </h4>
          <StatusSelect />
        </div>
      </div>

      <div className="search--btn">
        <div className="add" onClick={() => navigate("/newStudent")}>
          <button>أضف طالب(ة)</button>
          <FontAwesomeIcon icon={faPlus} />
        </div>
        <div className="delete" onClick={deleteAllUser}>
          <button>حذف الكل</button>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </div>
    </div>
  );
}
