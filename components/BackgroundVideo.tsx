export default function BackgroundVideo({ videoSrc }: { videoSrc: string }) {
    return (
        <>
            <video autoPlay loop muted className="fixed inset-0 w-full h-full object-cover z-[-1]">
                <source src="/background-video.mp4" type="video/mp4" />
            </video>
            <div className="fixed inset-0 bg-blue-900 bg-opacity-50 z-[-1]"></div>
        </>
    )
}


