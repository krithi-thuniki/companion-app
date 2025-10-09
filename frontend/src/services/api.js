// src/services/api.js

const RAPID_API_KEY = process.env.REACT_APP_RAPID_API_KEY || "56d760ff00msh3205d5a883dbd85p10fc74jsn4a43001510b2";
const RAPID_API_HOST = "jsearch.p.rapidapi.com";
const BASE_URL = "https://jsearch.p.rapidapi.com";

// Fetch jobs and internships from RapidAPI
export const fetchJobsAndInternships = async (query, numPages = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?query=${encodeURIComponent(query)}&num_pages=${numPages}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": RAPID_API_HOST,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching jobs/internships:", error);
    return [];
  }
};
