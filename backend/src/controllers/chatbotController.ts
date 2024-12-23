import { Request, Response } from "express";
import nlp from "compromise";
import fs from "fs";
import path from "path";

// Load chatbot responses and dummy data
const chatbotResponsesPath = path.resolve(
  __dirname,
  "../../data/chatbot_responses.json"
);
const chatbotResponses = JSON.parse(
  fs.readFileSync(chatbotResponsesPath, "utf-8")
);

const dummyReservations = [
  {
    reservationID: 1,
    showTitle: "Chicago",
    seats: { regular: 2, vip: 0 },
    userID: "1",
  },
  {
    reservationID: 2,
    showTitle: "Matilda",
    seats: { regular: 1, vip: 1 },
    userID: "2",
  },
];

export const handleChatbot = (req: Request, res: Response) => {
  const { userInput, currentPage, loggedIn, showTitle } = req.body;

  // If the user is not logged in
  if (!loggedIn) {
    return res.json({ response: chatbotResponses.general.not_logged_in });
  }

  // Determine userID from loggedIn
  const userID = loggedIn;

  const doc = nlp(userInput.toLowerCase());

  if (doc.has("recommend") || doc.has("recommendation")) {
    const genreMatch = doc.match("#Noun").out("text");
    const recommendedShows = recommendShows(genreMatch);
    return res.json({ response: recommendedShows });
  }

  if (doc.has("reserve") || currentPage === "showDetails") {
    if (currentPage === "showDetails" && showTitle) {
      return res.json({
        response: chatbotResponses.show_details_page.reservation_offer.replace(
          "{show_title}",
          showTitle
        ),
      });
    }

    return res.json({
      response: chatbotResponses.ticket_reservation.initiate,
    });
  }

  if (doc.has("cancel")) {
    const userReservations = getReservationsByUser(userID);
    if (userReservations.length === 0) {
      return res.json({
        response: chatbotResponses.reservation_result_page.no_reservation,
      });
    }

    return res.json({
      response: `${
        chatbotResponses.reservation_result_page.cancel_prompt
      } ${formatReservations(userReservations)}`,
    });
  }

  if (doc.has("modify") || doc.has("change")) {
    const userReservations = getReservationsByUser(userID);
    if (userReservations.length === 0) {
      return res.json({
        response: chatbotResponses.reservation_result_page.no_reservation,
      });
    }

    return res.json({
      response: `${
        chatbotResponses.reservation_result_page.modify_prompt
      } ${formatReservations(userReservations)}`,
    });
  }

  if (doc.has("weather")) {
    return res.json({
      response:
        chatbotResponses.useful_information.weather_info[0].weather_forecast,
    });
  }

  return res.json({ response: chatbotResponses.general.fallback });
};

// Helper functions
const recommendShows = (genre: string | null) => {
  const shows = chatbotResponses.show_recommendations.based_on_genre.find(
    (item: { genre: string; shows: string[] }) =>
      item.genre.toLowerCase() === genre?.toLowerCase()
  );

  if (shows) {
    return chatbotResponses.main_page.recommendation.replace(
      "{shows}",
      shows.shows.slice(0, 3).join(", ")
    );
  }

  const defaultShows =
    chatbotResponses.show_recommendations.based_on_genre.find(
      (item: { genre: string; shows: string[] }) =>
        item.genre.toLowerCase() === "concerts"
    );

  return chatbotResponses.main_page.no_genre.replace(
    "{shows}",
    defaultShows.shows.slice(0, 3).join(", ")
  );
};

const getReservationsByUser = (userID: string) => {
  return dummyReservations.filter((res) => res.userID === userID);
};

const formatReservations = (reservations: any[]) => {
  return reservations
    .map(
      (res) =>
        `Reservation ID: ${res.reservationID}, Show: ${res.showTitle}, Seats: Regular(${res.seats.regular}), VIP(${res.seats.vip})`
    )
    .join("; ");
};
