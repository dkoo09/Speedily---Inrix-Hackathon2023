// anotherFile.js

const { getTopSpeedSegments } = require('./speedData');
fetch('')
  .then(response => response.json())
  .then(data => {
    // Work with your data here
    console.log(data);
  })
  .catch(error => console.error(error));
  
  getTopSpeedSegments[0].code     

// Define the coordinates you want to check against
const targetCoordinates = [
  { lat: 38.29852, long: -122.28496 },
  // ... more coordinates if needed ...
];

function checkSegmentMatchesCoordinates(segment, targetCoords) {
  return targetCoords.some(coord => 
    (coord.lat === parseFloat(segment.properties.StartLat) && coord.long === parseFloat(segment.properties.StartLong)) ||
    (coord.lat === parseFloat(segment.properties.EndLat) && coord.long === parseFloat(segment.properties.EndLong))
  );
}

function findMatchingSegments(segments, targetCoords) {
  return segments.filter(segment => checkSegmentMatchesCoordinates(segment, targetCoords));
}

const matchingSegments = findMatchingSegments(topSpeedSegments, targetCoordinates);
console.log('Matching Segments:', matchingSegments);