require("dotenv").config();

// createGeoGuessrChallenge({
//   forbidMoving: true,
//   forbidRotating: false,
//   forbidZooming: false,
//   map: "new-zealand",
//   rounds: 5,
//   timeLimit: 60,
// });

async function createGeoGuessrChallenge(challengeInfo) {
  try {
    const url = "https://www.geoguessr.com/api/v3/challenges";

    // Create challenge by sending POST request to Geoguessr API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `_ncfa=${process.env.NCFA_TOKEN}`, // Attach the GeoGuessr token as a cookie
      },
      body: JSON.stringify(challengeInfo),
    });

    // Process the response
    if (response.ok) {
      const data = await response.json();
      const challengeToken = data.token;
      return `https://www.geoguessr.com/challenge/${challengeToken}`;
    } else {
      console.error(`Failed to create challenge. Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error creating GeoGuessr challenge:", error.message);
    return null;
  }
}

module.exports = createGeoGuessrChallenge;
