import {create} from zustand
import axios from "../lib/axios"
import toast from "react-hot-toast"

const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,
    signup:async ({name,email,password,confirmPassword})=>{
        set({loading:true})
        if(password !== confirmPassword){
            set({loading:false})
            return toast.error("Passwords do not match")
    }
    try{
        const res = await axios.post("/auth/signup", {name,email,password})
        console.log(res)
        set({user:res.data.user})
        toast.success("Account created successfully")
    // signup:async ()=>{},
    // signup:async ()=>{},
    // signup:async ()=>{},
    // signup:async ()=>{},
    }

))