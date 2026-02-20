import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { type IResturant, type IMenuItem } from "../types";
import { resturantService } from "../main";
import axios from "axios";
import ResturantProfile from "../components/ResturantProfile";
import MenuItems from "../components/MenuItems";

const ResturantPage = () => {

    const {id}= useParams();

    const [resturant, setResturant]= useState<IResturant | null>(null);
    const [menuItems, setMenuItems]= useState<IMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchResturant = async()=>{
        try {
            const {data}=await axios.get(`${resturantService}/api/resturant/${id}`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            setResturant(data || null);
        } catch (error) {
            console.log(error);
        } finally{
            setLoading(false);
        }
    }

     const fetchMenuItems = async()=>{
        try{
            const { data }= await axios.get(`${resturantService}/api/item/all/${id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`,
                },
            });
            setMenuItems(data);
        } catch(error){
            console.log(error);
        }
    };

    useEffect(()=>{
        if(id){
            fetchResturant();
            fetchMenuItems();
        }
    },[id]);

    if(loading){
       return (<div className="flex h-[60vh] items-center justify-center">
      <p className="text-gray-500">loading resturant</p>
    </div>)
    }

    if(!resturant){
       return (<div className="flex h-[60vh] items-center justify-center">
      <p className="text-gray-500">No Resturant with this id</p>
    </div>)
    }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">
        <ResturantProfile resturant={resturant}
        onUpdate={setResturant}
        isSeller={false}
        />
        <div className="rounded-xl bg-white shadow-sm">
            <MenuItems isSeller={false}
                items={menuItems}
                onItemDeleted={()=>{}}
            />
        </div>
    </div>
  )
}

export default ResturantPage