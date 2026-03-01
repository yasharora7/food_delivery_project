import { useEffect, useState } from "react"
import { type IMenuItem, type IResturant } from "../types";
import axios from "axios";
import { resturantService } from "../main";
import AddResturant from "../components/AddResturant";
import ResturantProfile from "../components/ResturantProfile";
import MenuItems from "../components/MenuItems";
import AddMenuItem from "../components/AddMenuItem";
import RestruantOrders from "../components/RestruantOrders";

type SellerTab= "menu" | "add-item" | "sales";

const Resturant = () => {
    const [resturant, setResturant]=useState<IResturant | null>(null);
    const [loading, setLoading]=useState<boolean>(true);
    const [tab,setTab]=useState<SellerTab>("menu")
    
    const fetchMyResturant = async()=>{
        try{
            const{ data}=await axios.get(`${resturantService}/api/resturant/my`,{
                headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setResturant(data.resturant || null)
            if(data.token){
                localStorage.setItem("token",data.token);
                window.location.reload();
            }
        } catch(error){
            console.log(error);
        } finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        fetchMyResturant();
    },[]);

    const [menuItems, setMenuItems]= useState<IMenuItem[]>([]);

    const fetchMenuItems = async(resturantId: string)=>{
        try{
            const { data }= await axios.get(`${resturantService}/api/item/all/${resturantId}`,{
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
        if(resturant?._id){
            fetchMenuItems(resturant._id);
        }
    },[resturant]);


    if(loading) return <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
            Loading your resturant...
        </p>
    </div>

    if(!resturant){
        return <AddResturant fetchMyResturant={fetchMyResturant}/>
    }
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 space-y-6">
        <ResturantProfile
            resturant={resturant}
            onUpdate={setResturant}
            isSeller={true}
        />


        <RestruantOrders resturantId={resturant._id}/>


        <div className="rounded-xl bg-white shadow-sm">
            <div className="flex border-b">
                {[
                    {key:"menu" , label:"Menu Items"},
                    {key:"add-item" , label:"Add Item"},
                    {key:"sales" , label:"Sales"},
                ].map((t)=>(
                    <button key={t.key} onClick={()=> setTab(t.key as SellerTab)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                        tab===t.key 
                        ?"border-b-2 border-red-500 text-red-500"
                    : "text-gray-500 hover:text-gray-700"}`}>{t.label}</button>
                ))
                }
            </div>
            <div className="p-5">
                {tab==="menu" && (<MenuItems items={menuItems} onItemDeleted={()=> fetchMenuItems(resturant._id)} isSeller={true}/>)}
                {tab==="add-item" && (<AddMenuItem onItemAdded={()=>fetchMenuItems(resturant._id)}/>)}
                {tab==="sales" && (<p>Sales Page</p>)}
            </div>
        </div>
    </div>
  )
}

export default Resturant