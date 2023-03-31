import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";

import "./style/Table.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser , UpdateStudentCurentIndex} from "../features/fireBase";
import {  TableFooter, TablePagination, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function BasicTable() {
  const { data  , filterData } = useSelector((state) => state.firebase);
  const { currentMonth  } = useSelector((state) => state.selecte);
  
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()

  const handelUpdateStudent = (uid) => {
    dispatch(UpdateStudentCurentIndex(uid))
    localStorage.setItem('StudentCurentIndex', JSON.stringify(uid))
    setTimeout(() => {
      navigate('/updateStudent')
    }, 300);
  }

  const handelStudentInfo = (uid) => {
    dispatch(UpdateStudentCurentIndex(uid))
    localStorage.setItem('StudentCurentIndex', JSON.stringify(uid))
    setTimeout(() => {
      navigate('/studentInfo')
    }, 300);
  }


  
  


  const deleteStudent = async (id, uid) => {
    dispatch(deleteUser({ uid }));
    await deleteDoc(doc(db, "students", `${id}`));
  };

  // ? pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

const handleChangePage = (event, newPage) => {
  setPage(Number(newPage));
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(Number(event.target.value));
};

  

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    // ? handeling filter by input

    const month = new Date().getMonth()

  return (
    <TableContainer component={Paper} dir="rtl" style={{ padding: 0 }}>
      <Table sx={{ minWidth: 450 }} aria-label="simple table">
      <TableHead className="table-head" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
          <TableRow className="table-head">
            <TableCell align="center">رقم القيد</TableCell>
            <TableCell align="center">الإسم</TableCell>
            <TableCell align="center">رقم هاتف الوكيل</TableCell>
            <TableCell align="center"> الرسوم</TableCell>
            <TableCell align="center">القسم</TableCell>
            <TableCell align="center">الحالة</TableCell>
            <TableCell align="center">عرض</TableCell>
            <TableCell align="center">تعديل</TableCell>
            <TableCell align="center">حذف</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0
            ? filterData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : filterData
          ).map((row) => (
            <TableRow
              hover
              key={row.uid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell align="center" className="table-row">
                {row.uid}
              </TableCell>
              <TableCell align="center" className="table-row">
                {row.name}
              </TableCell>
              <TableCell align="center" className="table-row">
                {row.phone}
              </TableCell>
              <TableCell align="center" className="table-row">
                {`${row.price} MRU`}
              </TableCell>
              <TableCell align="center" className="table-row">
                {row?.category?.label}
              </TableCell>
              <TableCell
                align="center"
                className={`table-row ${
                  row.months[currentYear][currentMonth]?.status  !== "لم يتم الدفع" ? "paid" : "unpaide"
                }`}
              >
                { month === currentMonth ? '' : row.months[currentYear][currentMonth]?.status }
              </TableCell>
              <TableCell align="center">
                <FontAwesomeIcon icon={faEye} className="icon-cell view" onClick={()=> handelStudentInfo(row.uid)}  />
              </TableCell>
              <TableCell align="center">
                <FontAwesomeIcon icon={faEdit} className="icon-cell edit" onClick={()=> handelUpdateStudent(row.uid)} />
              </TableCell>
              <TableCell align="center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon-cell delete"
                  onClick={() => deleteStudent(row.id, row.uid)}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TablePagination
            rowsPerPageOptions={[5, 7, 15, { label: "الجميع", value: -1 }]}
            colSpan={3}
            count={filterData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            SelectProps={{ inputProps: { "aria-label": "rows per page" } }}
            labelDisplayedRows={({ from, to, count }) => (
            <div style={{ fontSize: '16px' }}>
                {from}-{to} من {count !== -1 ? count : `أكثر من ${to}`}
              </div>
            )
            }
            labelRowsPerPage={
              <Typography style={{ color: '#222', fontWeight: 'bold' , fontFamily : 'Amiri' }}>
                عدد الصفوف في الصفحة :
              </Typography>
            }
          />
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
