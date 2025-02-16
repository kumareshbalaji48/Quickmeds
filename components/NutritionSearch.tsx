"use client";

import { useState } from "react";
import axios from "axios";

interface NutritionItem {
    name: string;
    calories: number;
    protein_g: number;
    carbohydrates_total_g: number;
    fat_total_g: number;
}

export default function NutritionSearch() {
    const [query, setQuery] = useState("");
    const [nutritionData, setNutritionData] = useState<NutritionItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_KEY = process.env.NEXT_PUBLIC_CALORIE_NINJAS_API_KEY;

    const fetchNutritionData = async () => {
        if (!query.trim()) return;

        setLoading(true);
        setError("");
        setNutritionData([]);

        try {
            const response = await axios.get<{ items: NutritionItem[] }>(
                `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
                { headers: { "X-Api-Key": API_KEY } }
            );
            if (response.data.items.length === 0) {
                setError("No nutrition data found. Try another food item.");
            } else {
                setNutritionData(response.data.items);
            }
        } catch (err) {
            setError("Failed to fetch data. Check your API key and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('/pex.png')" }}>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative w-full max-w-3xl p-8 bg-white/80 backdrop-blur-lg shadow-xl rounded-xl border border-gray-200">
                <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">🥗 Nutrition Lookup</h2>

                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="Enter food (e.g., 3lb carrots, chicken sandwich)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={fetchNutritionData}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Search"}
                    </button>
                </div>

                {error && <p className="text-red-600 text-center">{error}</p>}

                {nutritionData.length > 0 && (
                    <div className="mt-6 overflow-x-auto">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700 text-center">🥑 Nutrition Facts</h3>
                        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-md">
                            <thead>
                                <tr className="bg-blue-600 text-white">
                                    <th className="border px-4 py-2">Food</th>
                                    <th className="border px-4 py-2">Calories</th>
                                    <th className="border px-4 py-2">Protein (g)</th>
                                    <th className="border px-4 py-2">Carbs (g)</th>
                                    <th className="border px-4 py-2">Fat (g)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nutritionData.map((item, index) => (
                                    <tr key={index} className="text-center bg-white even:bg-gray-100">
                                        <td className="border px-4 py-2">{item.name}</td>
                                        <td className="border px-4 py-2">{item.calories}</td>
                                        <td className="border px-4 py-2">{item.protein_g}</td>
                                        <td className="border px-4 py-2">{item.carbohydrates_total_g}</td>
                                        <td className="border px-4 py-2">{item.fat_total_g}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
