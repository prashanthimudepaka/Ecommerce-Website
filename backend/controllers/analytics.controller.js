import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const sales = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);
  const { totalSales, totalRevenue } = sales[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData=async(startDate,endDate)=>{
    try{const dailySalesData=await Order.aggregate([
        {
            $match:
            {
                createdAt:{
                    $gte:startDate,
                    $lt:endDate,
                },
            },
        },
        {
            $group:{
                _id:{
                    $dateToString:{
                        format:"%Y-%m-%d",
                        date:"$createdAt"
                    },
                },
                sales:{$sum:1},
                revenue:{$sum:"$totalAmount"},
            },
        },
        {
            $sort:{_id:1},}
    ])

const dateArray= getDatesInRange(startDate, endDate);
//console.log(dateArray);//['2025-03-26','2024-03-27',...]

return dateArray.map((date)=>{
    const foundData = dailySalesData.find((item)=>item._id===date);
    return{
        date,
        sales:foundData?.sales||0,
        revenue:foundData?.revenue||0,
    }
})
    }
    catch(error){
        console.log("error in get daily sales data controller",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }
    
    /*example of dailySaleData
    [{"_id":"2023-08-01",
    "sales":1,
    "revenue":100] */

}
function getDatesInRange(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }