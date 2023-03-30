
import { addDoc, collection } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import Creatable from 'react-select/creatable';
import {setCurentCategory} from '../../features/Selcte'
import {db} from '../../config/firebase'
import {addCategory} from '../../features/category'

export default function CategoryCreatebalSelect() {
    const { currentCategory } = useSelector((state) => state.selecte);
    const { category } = useSelector((state) => state.category);
    const dispatch = useDispatch()
    const hanedlChange = async (selectedOption) => {
      const categoryRef = collection(db, "category");
      if(selectedOption.__isNew__){
        const {label , value} = selectedOption
        const categoryId = new Date().getTime()
        const categoryDataFirebase = {label , value}
        const categoryData = {label, value , id : `${categoryId}`}
       try{
        await addDoc(categoryRef, categoryDataFirebase);
        dispatch(addCategory(categoryData))
       }catch(e){
        console.error(e)
       }
      }
        dispatch(setCurentCategory(selectedOption))
    }

    let options

    if (category.length > 0) {
      const sortedCategories = category.slice().sort((a, b) => {
        if (a.label === "الكل") {
          return -1;
        } else if (b.label === "الكل") {
          return 1;
        } else {
          return a.label.localeCompare(b.label);
        }
      });
    
      options = sortedCategories.map((category) => ({
        label: category.label,
        value: category.value,
      }));
    }

    

  return (
    <Creatable options={options} onChange={hanedlChange}  value={currentCategory}/>
  )
}