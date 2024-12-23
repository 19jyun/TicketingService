// File: backend/src/controllers/chatbotController.ts

import { Request, Response } from "express";
import nlp from "compromise"; // Import Compromise
import fs from "fs";
import path from "path";

// Load chatbot responses
const chatbotResponsesPath = path.resolve(
  __dirname,
  "../../data/chatbot_responses.json"
);
const chatbotResponses = JSON.parse(
  fs.readFileSync(chatbotResponsesPath, "utf-8")
);

export const handleChatbot = (req: Request, res: Response) => {
  const { userInput, currentPage, loggedIn, showTitle } = req.body;

  // If the user is not logged in
  if (!loggedIn) {
    return res.json({ response: chatbotResponses.general.not_logged_in });
  }

  // Use Compromise to process the user input
  const doc = nlp(userInput.toLowerCase());

  // Match keywords or intents
  if (doc.has("recommend")) {
    // Recommend shows
    return res.json({
      response:
        "I can recommend some great shows. Would you like to hear about musicals or concerts?",
    });
  } else if (doc.has("help") || doc.has("assist")) {
    // General help
    return res.json({
      response:
        "I can help you with reservations, recommendations, and ticket information. How can I assist you?",
    });
  } else if (doc.has("cancel")) {
    // Handle cancellations
    return res.json({
      response:
        "You can cancel your reservation in the profile section or let me know the show you want to cancel.",
    });
  } else if (doc.has("reserve") || doc.has("book")) {
    // Handle reservations
    if (showTitle) {
      return res.json({
        response: `You can reserve tickets for ${showTitle}. Would you like regular or VIP seating?`,
      });
    }
    return res.json({
      response: "Let me know the show you'd like to book tickets for.",
    });
  } else if (doc.has("weather")) {
    // Check weather for reservations
    return res.json({
      response:
        "Can you provide the date and location for the weather check? I’ll fetch the details for you!",
    });
  }

  // Context-aware responses based on the current page
  switch (currentPage) {
    case "main":
      if (doc.has("recommend")) {
        return res.json({
          response:
            "I recommend Chicago and Hamilton. Would you like to know more?",
        });
      }
      break;

    case "showDetails":
      if (doc.has("recommend")) {
        return res.json({
          response: `This show is highly recommended. Would you like to reserve tickets for ${showTitle}?`,
        });
      }
      if (doc.has("details")) {
        return res.json({
          response: `${showTitle} is a popular musical about fame and justice. It's highly rated!`,
        });
      }
      break;

    case "reservation":
      if (doc.has("tickets")) {
        return res.json({
          response: "You have 2 tickets reserved for Hamilton on January 15th.",
        });
      }
      break;
  }

  // Fallback response if no keywords are matched
  return res.json({ response: chatbotResponses.general.fallback });
};
