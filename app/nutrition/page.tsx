import NutritionSearch from "@/components/NutritionSearch";
import Header from "@/components/Header"


export default function NutritionPage() {
    return (
        <div>
           
            <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          
            <NutritionSearch />
        </div>
        </div>
    );
}
