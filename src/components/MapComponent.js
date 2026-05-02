import React, { useState, useEffect, useCallback } from 'react';
import geojsonData from '../../src/data/USA_CA_BayArea.json';
import { getTopSpeedSegments } from '../../src/components/speedChecker.js';
import './MapComponent.css';


const MapComponent = () => {
const [speedData, setSpeedData] = useState({ codes: [], speeds: [] });
const [hoveredSpeed, setHoveredSpeed] = useState(null); // State to store the speed of the hovered line
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // State to store the mouse position


useEffect(() => {
  getTopSpeedSegments()
    .then(segments => {
      const codes = segments.map(segment => segment.code);
      const speeds = segments.map(segment => segment.speed);
      setSpeedData({ codes, speeds });
    })
    .catch(error => {
      console.error('Failed to load top speed segments:', error);
    });
}, []);


const drawLines = useCallback((path, map, speed) => {
  let color;
  if (speed >= 60) {
    color = getColorForSpeed(speed, 75, 60);
  } else {
    color = getColorForSpeed(speed, 40, 25);
  }


  const linePath = new window.google.maps.Polyline({
    path: path,
    geodesic: true,
    strokeColor: color,
    strokeOpacity: 1.0,
    strokeWeight: 4,
  });


  linePath.setMap(map);


  linePath.addListener('mouseover', (e) => {
    setHoveredSpeed(speed);
    setMousePosition({ x: e.domEvent.clientX, y: e.domEvent.clientY });
  });


  linePath.addListener('mouseout', () => {
    setHoveredSpeed(null);
  });
}, []);


useEffect(() => {
  const parseGeoJson = (geojsonData, map) => {
    geojsonData.features.forEach((feature) => {
      const ID = feature.properties.XDSegID;
      const { type } = feature.geometry;
      const coordinates = feature.geometry.coordinates;


      if (speedData.codes.includes(ID)) {
        if (type === 'LineString') {
          const googleMapsCoordinates = coordinates.map(([lng, lat]) => ({
            lat,
            lng,
          }));
          const index = speedData.codes.indexOf(ID);
          const speed = speedData.speeds[index];
          drawLines(googleMapsCoordinates, map, speed);
        }
      }
    });
  };


  const script = document.createElement('script');
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB16gWW5AYW-zjCK3Z4ZCGI8SFaVEWxSQY&callback=initMap";
  script.async = true;


  window.initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 37.759590, lng: -122.442382 },
      zoom: 13,
      mapId: 'DEMO_MAP_ID'
    });
    parseGeoJson(geojsonData, map);
  };


  document.head.appendChild(script);


  return () => {
    document.head.removeChild(script);
    window.initMap = undefined;
  };
}, [drawLines, speedData.codes, speedData.speeds]);


return (
  <div>
    <div id="map" style={{ height: '-100%px', width: '100%' }} />
    {hoveredSpeed !== null && (
      <div style={{
        position: 'fixed',
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`,
        backgroundColor: 'white',
        padding: '10px', 
        borderRadius: '5px',
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none'
      }}>
        {hoveredSpeed >= 60 ?
          `Speed: ${hoveredSpeed} mph, Speed Limit: 60` :
          `Speed: ${hoveredSpeed} mph, Speed Limit: 25`
        }

      </div>
    )}
  </div>
);
};


export default MapComponent;


function getColorForSpeed(value, maxVal, minVal) {
const ratio = Math.min((Math.max(value, minVal) - minVal) / (maxVal - minVal), 1);
const red = Math.floor(ratio * 255);
const green = Math.floor((1 - ratio) * 255);
const blue = 0;
return `rgb(${red},${green},${blue})`;
}
