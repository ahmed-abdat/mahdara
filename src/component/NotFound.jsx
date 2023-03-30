
import './style/notFound.css'
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notFound">
        <h2>404 الصفحة غير موجودة ! </h2>
        <img src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?w=740&t=st=1680189947~exp=1680190547~hmac=3f2346c72cbbd2abccc3e4f736ae7624e0ce8273afff7ae0e40c163dd5cdbdcd" alt="notFound" />
        
        <h3><Link to='/'>رجوع إلى الصفحة الرئيسية </Link></h3>
    </div>
  )
}