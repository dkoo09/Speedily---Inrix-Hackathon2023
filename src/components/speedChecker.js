import axios from 'axios';


// Using environment variables for sensitive information




//const appId = process.env.REACT_APP_APP_ID;
const appKey = process.env.REACT_APP_APP_KEY;
//const hashToken = process.env.REACT_APP_HASH_TOKEN;
//const token = process.env.REACT_APP_TOKEN;


async function getToken() {
  // Construct the API URL with query parameters for appId and hashToken
  const apiUrl = `https://api.iq.inrix.com/auth/v1/appToken?appId=c3cbc81f3j&hashToken=YzNjYmM4MWYzanxZdlJMUGN2SFk3NjdBdGttRVlvVEk1eVNwZXUxWkY0SGFrZnFHRTFM
  `;


  try {
    // Making an HTTP GET request to the API
    const response = await axios.get(apiUrl, {
      headers: {
        'Speedily': appKey // Using App-Key in the header for authentication
      }


    });


    var token = response.data.result.token; // Replace with actual data structure
    return token;
  } catch (error) {
    // Error handling
    console.error('Error fetching data:', error);
  }
}


async function getSpeed(token) {
    // Construct the API URL with query parameters for appId and hashToken
    const apiUrl = "https://api.iq.inrix.com/v1/segments/speed?box=37.802797%7C-122.514552%2C37.711426%7C-122.390112";
    try {
      // Making an HTTP GET request to the API
      const response = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}` // Using App-Key in the header for authentication
        }
 
      });
     
      var result = response.data; // Replace with actual data structure
      return result;
    } catch (error) {
      // Error handling
      console.error('Error fetching data:', error);
    }
  }
 


// Example usage
getToken().then(token => {
    getSpeed(token).then(result => {
        console.log(result.result.segmentspeeds[0].segments[0].speed);
    });
});


// make a bubble sort
// Function to find the top 5 highest speed segments
async function getTopSpeedSegments() {
    try {
      const token = await getToken();
      const speedData = await getSpeed(token);
 
      const segments = speedData.result.segmentspeeds[0].segments; // Adjust according to the actual response structure
 
      const topSpeedSegments = segments
        .map(segment => ({ ...segment, speed: segment.speed + 2 }))
        .filter(segment => (segment.speed >= 25 && segment.speed <= 40) || segment.speed > 60)

 
      return topSpeedSegments;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Rethrow to handle in caller function
    }
  }
  export { getTopSpeedSegments };