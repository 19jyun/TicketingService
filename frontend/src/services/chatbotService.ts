import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/chatbot";

interface ChatbotRequest {
  userInput: string;
  currentPage: string;
  loggedIn: boolean;
  showTitle?: string | null;
}

interface ChatbotResponse {
  response: string;
}

export const fetchChatbotResponse = async (
  requestData: ChatbotRequest
): Promise<ChatbotResponse> => {
  console.log("Preparing to send chatbot request...");
  console.log("Request URL:", API_BASE_URL);
  console.log("Request Body:", requestData);

  try {
    const response = await axios.post<ChatbotResponse>(
      API_BASE_URL,
      requestData
    );

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error during chatbot API call:");
    console.error("Error Message:", error.message);
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
    }
    throw new Error("Failed to fetch chatbot response.");
  }
};
