import { Link } from "react-router-dom";
import type { Destination } from "../../types/destination";
import { FaChevronRight } from "react-icons/fa";

export default function DestinationCard({ destination }: { destination: Destination }) {
    return (
        <Link
            to={`/tours?destination_id=${destination.destinationID}`}
            className="relative rounded-lg overflow-hidden h-96 shadow-lg group"
        >
            <img
                src={destination.imageURLs[0]}
                alt={destination.nameDes}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute top-4 right-4 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                {destination.tourCount} tours
            </div>
            <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-bold mb-1">{destination.nameDes}</h3>
                <p className="text-lg">{destination.tourCount} tours có sẵn</p>
            </div>
            <div className="absolute bottom-6 right-6 bg-white/30 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                <FaChevronRight size={20} />
            </div>
        </Link>
    );
}
