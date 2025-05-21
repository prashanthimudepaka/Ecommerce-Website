import { BarChart, PlusCircle, ShoppingBasket, Cloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import CreateProductForm from "../components/CreateProductForm";
import ProductLists from "../components/ProductLists";
import AnalyticsTab from "../components/AnalyticsTab";
// import CloudinaryTest from "../components/CloudinaryTest";
import toast from "react-hot-toast";


const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts, loading } = useProductStore();

	useEffect(() => {
		const loadProducts = async () => {
			try {
				await fetchAllProducts();
			} catch (error) {
				console.error("Error loading products:", error);
				toast.error("Failed to load products");
			}
		};
		loadProducts();
	}, []); // Remove fetchAllProducts from dependencies to prevent unnecessary re-renders

	const tabs = [
		{ id: "create", label: "Create Product", icon: PlusCircle },
		{ id: "list", label: "Product List", icon: ShoppingBasket },
		{ id: "analytics", label: "Analytics", icon: BarChart },
		// { id: "cloudinary", label: "Cloudinary Test", icon: Cloud },
	];

	return (
		<div className="min-h-screen  text-white relative overflow-hidden">
			<h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
			<div className="flex space-x-4 mb-8">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
							activeTab === tab.id
								? "bg-blue-600 text-white"
								: "bg-gray-100 hover:bg-gray-200 text-gray-700"
						}`}
					>
						<tab.icon className="w-5 h-5" />
						<span>{tab.label}</span>
					</button>
				))}
			</div>

			{loading ? (
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-lg p-6">
					{activeTab === "create" && <CreateProductForm />}
					{activeTab === "list" && <ProductLists />}
					{activeTab === "analytics" && <AnalyticsTab />}
					{activeTab === "cloudinary" && <CloudinaryTest />}
				</div>
			)}
		</div>
	);
};

export default AdminPage;