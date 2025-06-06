import React from 'react' 
import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
// import { useProductStore } from "../stores/useProductStore";
// import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/jeans", name: "Jeans", imageUrl: "/jeans.jpg" },
	{ href: "/t-shirts", name: "T-shirts", imageUrl: "/tshirts.jpg" },
	{ href: "/shoes", name: "Shoes", imageUrl: "/shoes.jpg" },
	{ href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
	{ href: "/jackets", name: "Jackets", imageUrl: "/jackets.jpg" },
	{ href: "/suits", name: "Suits", imageUrl: "/suits.jpg" },
	{ href: "/bags", name: "Bags", imageUrl: "/bags.jpg" },
	{ href: "/jwellery", name: "jwellery", imageUrl: "/jwele.webp" },
	{ href: "/vehicles", name: "vehicles", imageUrl: "/scootiy.webp" },



];
function HomePage() {
  return (
    <div className='relative min-h-screen  bg-cover overflow-hidden ' style={{ backgroundImage: "url('/ss.jpg')" }}>
      {/* Background Image Layer */}
     

      {/* Content Layer */}
      {/* <div className='relative z-10 text-white'>
        <ol className='text-black flex justify-center space-x-4 pt-4'>
          <li><a href='/jeans'>Jeans</a></li>
          <li><a href='/t-shirts'>T-shirts</a></li>
          <li><a href='/jackets'>Jackets</a></li>
          <li><a href='/'>See More</a></li>
        </ol> */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 '>
<h1 className='mx-auto  sm:px-6 lg:px-8 py-10 max-w-screen-xl text-center  center text-5xl sm:text-6xl font-bold text-white mb-4  bg-emerald-400 border-1 rounded-3xl px-0 '>
            All You Need, In One Place
          </h1>
    
 </div>
     <div className='max-w-screen-4xl  mx-auto px-4 sm:px-6 lg:px-8 py-10'>
    
          <p className='text-center text-4xl text-white mb-12 bg-amber-700'>
            Discover the latest trends in eco-friendly fashion
          </p>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {categories.map((category) => (
              <CategoryItem category={category} key={category.name} />
            ))}
          </div>
        </div>
      </div>
    
  );
}

export default HomePage