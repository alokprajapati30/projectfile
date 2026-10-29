import React from 'react'
import { LuSparkles } from "react-icons/lu";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineSparkles, HiOutlineMicrophone } from "react-icons/hi";
import { HiOutlineBolt, HiOutlineCodeBracket } from "react-icons/hi2";
import logo from "../assets/logo3.png"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios'
import { ServerUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = ({setUser}) => {
    const navigate = useNavigate()

    const FEATURES = [

        {
            icon:
                <HiOutlineMicrophone />,
            title: "Voice AI",

            desc: "Natural real-time voice conversions.",
        },
        {
            icon:
                <HiOutlineSparkles />,
            title: "Smart Navigation",
            desc: " Navigate pages using voice command.",

        },
        {
            icon:
                <HiOutlineCodeBracket />,
            title: "Easy to Embed",
            desc: "Add assistant using one script tag",
        },
        {
            icon:
                <HiOutlineBolt />,
            title: "Fast Response",
            desc: " Optimizing Gemini AI responses",
        },

    ];

    const handleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const { displayName, email } = result.user
            const res = await axios.post(ServerUrl + "/api/auth/google",
                { name: displayName, email }, { withCredentials: true })
                setUser(res.data)
            //console.log(res.data)
           // localStorage.setItem("userId", res.data._id);
            toast.success("Login Successfully")
            navigate("/")
        } catch (error) {
            toast.error("Login Failed...")
            console.log(error)
        }

    }


    return (
        <div className='min-h-screen bg-linear-to-br from-purple-50
           via-white to-emerald-50 overflow-hidden'>
            <div className='max-w-7xl mx-auto px-6 py-16 lg:py-24'>
                <div className='grid lg:grid-cols-2 gap-16 item-center'>
                    {/* lift div */}
                    <div>

                        <div className='inline-flex items-center gap-2 px-4 py-2
                        rounded-full border border-purple-200 bg-purple-200
                        text-purple-600 text-sm font-medium'>
                            <LuSparkles />
                            AI Voice Assistant Platform

                        </div>
                        <h1 className='mt-8 text-5xl lg:text-7xl font-black
                     leading-tight text-[#081028]'>
                            Build AI Website
                            <span className='block text-transparent bg-clip-text
                        bg-linear-to-br from-purple-500 to-emerald-500'>For any Website</span>
                        </h1>
                        <p className='mt-8 text-lg text-[#475569] leading-8 max-w-2xl'>
                            Create customization Ai voice assistants that talk, guid user and integrate any website instantly
                        </p>
                        <button onClick={handleLogin} className=' mt-10 h-16 px-8 rounded-2xl
                          bg-linear-to-br from-purple-500 to-emerald-500
                          text-white text-lg font-semibold flex items-center
                           gap-4 shadow-[ 0_20px_80px_rgba(139,92,246,0.25)] 
                           hover:scale-[1.02] transition cursor-pointer'>
                            <FcGoogle className='text-3xl bg-white rounded-full' />
                            Continue with Google
                        </button>
                        <p className='mt-4 text-sm text-[#64748b]'>Free plan includes 200 AI responses</p>
                    </div>
                    {/* right div */}

                    <div className='relative'>
                        <div className='absolute inset-0 bg-linear-to-br *:from-purple-200/50 to-emerald-200/40 blur-[120px]' />

                        <div className='relative rounded-[40px] border border-black/5  bg-white shadow-[0_20px_80px_rgba(0,0,0,06)] p-8 overflow-hidden'>
                            <div className='flex items-center justify-between'>
                                <div>
                                    <h2 className='mr-2 text-3xl font-bold text-[#081028]'>Features</h2>
                                </div>
                                <div className='w-16 h-16 rounded-3xl bg-linear-to-br from-purple-500 to-emerald-500 flex items-center justify-center shadow[0_10px_40px_rgba(139,92,246,0.25)] p-3 '>
                                    <img src={logo} alt="logo" className='w-full h-full object-contain' />
                                </div>
                            </div>

                            <div className='mt-10 space-y-5'>
                                {
                                    FEATURES.map(({ icon, title, desc }, index) => (
                                        <div key={index} className='flex gap-5 rounded-3xl border
                                                     border-black/5 bg-[#f8fafc] p-5'>
                                            <div className=' min-w-[60px] h-[60px] rounded-2xl bg-linear-to-br from-purple-500 to-emerald-500
                                            text-white  text-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(139, 92, 246,0.20)]'>
                                                {icon}
                                            </div>
                                            <div>
                                                <h3 className='text-[#081028] text-lg font-semibold '>{title}</h3>
                                                <p className='mt-2 text-sm leading-7 text-[#64748b]'>{desc}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                        </div>

                    </div>



                </div>
            </div>
        </div>
    )
}

export default Login



