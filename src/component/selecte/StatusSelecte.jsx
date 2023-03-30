import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { setCurentStatus } from "../../features/Selcte";

export default function CategoryCreatebalSelect() {
  const { status, currentStatus } = useSelector((state) => state.selecte);
  const dispatch = useDispatch();

  const hanedlChange = (selectedOption) => {
    dispatch(setCurentStatus(selectedOption));
  };

  return (
    <Select options={status} onChange={hanedlChange} value={currentStatus} />
  );
}
