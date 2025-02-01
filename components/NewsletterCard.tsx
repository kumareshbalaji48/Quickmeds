import { ExternalLink } from "lucide-react"

interface NewsletterProps {
    title: string
    description: string
    imageUrl: string
    websiteUrl: string
    category: string
}

export function NewsletterCard({ title, description, imageUrl, websiteUrl, category }: NewsletterProps) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
                <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
                <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {category}
                </span>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
                <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                    Visit Website
                    <ExternalLink className="ml-2 h-4 w-4" />
                </a>
            </div>
        </div>
    )
}

