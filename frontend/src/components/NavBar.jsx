
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock,Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
const NavBar = () => {
    const {user,logout} =useUserStore();
    const isAdmin = user?.role === "admin";
    // const { cart } =;

    return (
        <header
            className="fixed top-0 left-0 w-full  bg-opacity-90 backdrop-blur-md shadow-lg z-40
         transition-all duration-300 border-b border-green- 600 bg-gradient-to-r from-blue-500 to-emerald-500"
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">

            <div className='flex flex-wrap justify-between items-center'>
					<Link to='/' className='text-2xl font-bold text-green-800 items-center space-x-2 flex'>
						E-Commerce
					</Link>
                </div>

                <nav className='flex flex-wrap items-center gap-4'>
						<Link
							to={"/"}
							className='text-black text-3xl  transition duration-300 ease-in-out'
						>
							<Home  
  className='mr-1 text-indigo-600 border-emerald-200 border-1 shadow-[0_10px_30px_rgba(128,0,128,0.3)] 
  p-2 bg-gradient-to-r from-green-200 to-blue-300 rounded-full transition-all duration-300 
  hover:text-green-700 hover:bg-gradient-to-r hover:from-blue-400 hover:to-green-400 
  hover:shadow-[0_15px_40px_rgba(75,0,130,0.5)]' 
  size={50} 
/>

                            </Link>
                    
                     {user && (
							<Link
								to={"/cart"}
								className='relative group text-amber-950 hover:text-emerald-400 transition duration-300 
							ease-in-out'
							>
								<ShoppingCart className='inline-block mr-1 group-hover:text-emerald-400' size={20} />
								<span className='hidden sm:inline'>Cart</span>
							
									<span
										className='absolute -top-2 -left-2 bg-emerald-500 text-black rounded-full px-2 py-0.5 
									text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out'
									>
										3
									</span>
								
							</Link>
						)}

                        {
                            isAdmin && (
                                <Link className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md font-medium
								 transition duration-300 ease-in-out flex items-center" to={"/secret-dashboard"}>
                                   <Lock className='inline-block mr-1' size={18} />
                                   <span className='hidden sm:inline'>Dashboard</span>
                                 </Link>
                            )
                        }

{user ? (
							<button
								className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
						rounded-md flex items-center transition duration-300 ease-in-out'
								onClick={logout}
							>
								<LogOut size={18} />
								<span className='hidden sm:inline ml-2'>Log Out</span>
							</button>
                        ) :(
                            <>
                            <Link to ={"/signup"} className='bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'>
                                   <UserPlus className='inline-block mr-1' size={18} />
                                   SignUp 
                                 </Link>

                                 <Link to ={"/login"} className='bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 
									rounded-md flex items-center transition duration-300 ease-in-out'>
                                   <LogIn className='inline-block mr-2' size={18} />
                                   Login
                                 </Link>

                                 

                            </>
                        )
            
                        }
                        
                 
                </nav>
                </div>

            </div>
        </header>
    );
};
export default NavBar;
