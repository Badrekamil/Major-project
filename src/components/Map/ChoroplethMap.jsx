import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as d3 from 'd3-scale';
import 'leaflet/dist/leaflet.css';
import './ChoroplethMap.css';

const ChoroplethMap = ({ data, startYear, endYear }) => {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch('/india_state.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error loading geojson", err));
  }, []);

  if (!geoData || !data) return <div className="map-loading">Loading Map Data...</div>;

  // Find max crime rate to normalize scale
  const maxCrimes = Math.max(...data.map(d => d.totalCrimes));
  const sortedData = [...data].sort((a, b) => b.totalCrimes - a.totalCrimes);
  
  // D3 Color Scale (Threshold or Linear) - Using smoother SaaS-like palette
  const colorScale = d3.scaleQuantize()
    .domain([0, maxCrimes])
    .range(['#fef0d9', '#fdd49e', '#fdbb84', '#fc8d59', '#e34a33', '#b30000']);

  const mapStateName = (geoName) => {
    if (!geoName) return '';
    const name = geoName.toLowerCase();
    if (name.includes('andaman')) return 'A & N Islands';
    if (name.includes('delhi')) return 'Delhi UT';
    if (name.includes('orissa')) return 'Odisha';
    if (name.includes('dadra')) return 'D & N Haveli';
    if (name.includes('daman')) return 'Daman & Diu';
    if (name.includes('jammu')) return 'Jammu & Kashmir';
    return geoName;
  };

  const getStyle = (feature) => {
    const rawName = feature.properties.NAME_1 || feature.properties.ST_NM || feature.properties.name;
    const stateName = mapStateName(rawName);
    
    const stateData = data.find(d => 
      d.state.toLowerCase() === stateName.toLowerCase() || 
      stateName.toLowerCase().includes(d.state.toLowerCase())
    );

    const crimeCount = stateData ? stateData.totalCrimes : 0;
    const fillColor = crimeCount > 0 ? colorScale(crimeCount) : '#e2e8f0';

    return {
      fillColor,
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.8
    };
  };

  const onEachFeature = (feature, layer) => {
    const rawName = feature.properties.NAME_1 || feature.properties.ST_NM || feature.properties.name;
    const stateName = mapStateName(rawName);
    
    const stateData = data.find(d => 
      d.state.toLowerCase() === stateName.toLowerCase() || 
      stateName.toLowerCase().includes(d.state.toLowerCase())
    );

    const crimeCount = stateData ? stateData.totalCrimes : 0;
    const rank = stateData ? sortedData.findIndex(d => d.state === stateData.state) + 1 : 'N/A';
    
    const tooltipContent = `
      <div style="font-family: Inter, sans-serif; padding: 4px;">
        <strong style="font-size: 14px; color: #0f172a;">${stateData ? stateData.state : rawName}</strong><br/>
        <span style="color: #64748b;">Total Crimes (${startYear}-${endYear}):</span> <strong style="color: #ef4444;">${crimeCount.toLocaleString()}</strong><br/>
        <span style="color: #64748b;">National Rank:</span> <strong>#${rank}</strong>
      </div>
    `;

    layer.bindTooltip(tooltipContent, { sticky: true });
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          color: '#666',
          dashArray: '',
          fillOpacity: 1
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getStyle(feature));
      }
    });
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={[22.5937, 78.9629]} 
        zoom={4} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <GeoJSON 
          data={geoData} 
          style={getStyle} 
          onEachFeature={onEachFeature} 
        />
      </MapContainer>
      <div className="map-legend premium-legend">
        <div className="legend-title">Crime Intensity</div>
        <div className="legend-scale-premium">
          <div className="gradient-bar" style={{background: 'linear-gradient(to right, #fef0d9, #fdd49e, #fdbb84, #fc8d59, #e34a33, #b30000)'}}></div>
          <div className="legend-labels">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChoroplethMap;
