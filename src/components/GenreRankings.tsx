import React from 'react';

interface Event {
  title: string;
  date: string;
  venue: string;
}

interface GenreRankingsProps {
  category: string;
  events: Event[];
}

const GenreRankings: React.FC<GenreRankingsProps> = ({ category, events }) => {
  return (
    <div className="ranking-category">
      <h3>{category}</h3>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            <span className="event-title">{event.title}</span>
            <span className="event-date">{event.date}</span>
            <span className="event-venue">{event.venue}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GenreRankings;