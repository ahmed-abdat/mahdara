import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select'
import {setCurentMont} from '../../features/Selcte'

export default function Selecte() {

  const {allMonths ,currentMonth , startedMonth} = useSelector((state) => state.selecte);
  const dispatch = useDispatch()


    const hanedlChange = selectedOption => {
        let curentmonth = [...allMonths].findIndex(monthe => monthe === selectedOption.value)
        dispatch(setCurentMont(curentmonth))
    }

    const curetnMonthe = new Date().getMonth() + 1





      const option = allMonths.slice(startedMonth, curetnMonthe).map((month) => ({
        value: month,
        label: month,
      }));
    

  return (
    <Select options={option} onChange={hanedlChange} value={{value : allMonths[currentMonth] , label : allMonths[currentMonth]}}/>
  )
}