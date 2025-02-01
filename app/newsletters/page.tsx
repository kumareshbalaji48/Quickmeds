"use client"

import { useState, useMemo } from "react"
import { Search, Newspaper } from "lucide-react"
import Header from "@/components/Header"
import BackgroundVideo from "@/components/BackgroundVideo"
import { NewsletterCard } from "@/components/NewsletterCard"
import { Input } from "@/components/ui/input"

// Newsletter data
const newsletters = [
    {
        id: 1,
        title: "The New England Journal of Medicine",
        description:
            "The most trusted and influential source of medical knowledge and clinical best practices in the world.",
        imageUrl: "/journal1.png",
        websiteUrl: "https://www.nejm.org",
        category: "Medical Research",
    },
    {
        id: 2,
        title: "The Lancet",
        description:
            "One of the world's oldest and best-known general medical journals, committed to improving lives through science.",
        imageUrl: "/lancet.png",
        websiteUrl: "https://www.thelancet.com",
        category: "Medical Science",
    },
    {
        id: 3,
        title: "JAMA Network",
        description:
            "Peer-reviewed medical journal published by the American Medical Association, covering all aspects of medicine.",
        imageUrl: "/jama.jpeg",
        websiteUrl: "https://jamanetwork.com",
        category: "Clinical Research",
    },
    {
        id: 4,
        title: "BMJ",
        description: "Leading general medical journal, helping doctors make better decisions since 1840.",
        imageUrl: "/bmj.png",
        websiteUrl: "https://www.bmj.com",
        category: "Healthcare",
    },
    {
        id: 5,
        title: "Annals of Internal Medicine",
        description:
            "A leading journal in internal medicine that publishes original research, reviews, and clinical guidelines.",
        imageUrl: "/annals.png",
        websiteUrl: "https://www.acpjournals.org/journal/aim",
        category: "Internal Medicine",
    },
    {
        id: 6,
        title: "Nature Medicine",
        description:
            "A top-tier journal that publishes cutting-edge research in translational and clinical medicine.",
        imageUrl: "/nature.png",
        websiteUrl: "https://www.nature.com/nm/",
        category: "Biomedical Research",
    },
]

export default function NewslettersPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredNewsletters = useMemo(() => {
        return newsletters.filter(
            (newsletter) =>
                newsletter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                newsletter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                newsletter.category.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [searchTerm])

    return (
        <div className="min-h-screen flex flex-col">
            <BackgroundVideo videoSrc="/doctor-background.mp4" />
            <Header />
            <main className="flex-grow p-8">
                <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
                    <h1 className="text-4xl font-bold text-blue-800 mb-8 flex items-center">
                        <Newspaper className="mr-4 h-8 w-8" />
                        Medical Newsletters
                    </h1>
                    <div className="mb-8 relative">
                        <Input
                            type="text"
                            placeholder="Search newsletters..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNewsletters.map((newsletter) => (
                            <NewsletterCard key={newsletter.id} {...newsletter} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

