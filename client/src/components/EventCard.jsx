import { Link } from 'react-router-dom';
import { HiCalendar, HiLocationMarker, HiUsers } from 'react-icons/hi';

/**
 * EventCard — displays event summary with image, title, date, location.
 * Links to the full event detail page.
 */
const EventCard = ({ event }) => {
    const categoryClass = `badge badge-${event.category?.toLowerCase() || 'other'}`;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const spotsLeft = event.capacity - (event.attendees?.length || 0);

    return (
        <Link
            to={`/events/${event._id}`}
            className="glass-card block overflow-hidden group"
            id={`event-card-${event._id}`}
        >
            {/* Event Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent" />
                <span className={`absolute top-3 left-3 ${categoryClass}`}>
                    {event.category}
                </span>
                {event.price > 0 ? (
                    <span className="absolute top-3 right-3 bg-[#4F46E5] text-white text-xs font-bold px-3 py-1 rounded-full">
                        ${event.price}
                    </span>
                ) : (
                    <span className="absolute top-3 right-3 bg-[#10B981] text-white text-xs font-bold px-3 py-1 rounded-full">
                        FREE
                    </span>
                )}
            </div>

            {/* Event Info */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-[#818CF8] transition-colors">
                    {event.title}
                </h3>
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {event.description}
                </p>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <HiCalendar className="text-[#818CF8] flex-shrink-0" />
                        <span>{formatDate(event.date)} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <HiLocationMarker className="text-[#F97316] flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <HiUsers className="text-[#10B981] flex-shrink-0" />
                        <span>
                            {spotsLeft > 0 ? (
                                <>{spotsLeft} spots left</>
                            ) : (
                                <span className="text-[#EF4444]">Sold Out</span>
                            )}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
