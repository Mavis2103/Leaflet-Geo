import * as React from 'react';
import { CRS } from 'leaflet';
import mapData from './test1.json';
import { createRoot } from 'react-dom/client';
import { GeoJSON, MapContainer } from 'react-leaflet';
import Back from './Back';
import * as topojson from 'topojson-client';
import Footer from './footer';
import './styles.css';

const binStyle = {
  fillColor: '#002E5E',
  fillOpacity: 1,
  color: '#000',
  weight: 1
};
const useData = () => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (mapData['type'] === 'Topology') {
      for (let key in mapData['objects']) {
        let geojson = topojson.feature(mapData, mapData['objects'][key]);
        setData(geojson);
      }
    } else {
      setData(mapData);
    }
  }, []);
  return data;
};
function App() {
  const data = useData();

  const onEachCountry = (country, layer) => {
    const countryId = country.properties.id;

    // if (
    //   [
    //     1196, 1197, 1198, 1199, 1257, 1258, 1259, 1260, 1318, 1319, 1320, 1321, 1379, 1380, 1381, 1382, 1440, 1441, 1195, 1256, 1138, 1383, 1322,
    //     1261, 1200, 1139
    //   ].includes(country.properties.id)
    // ) {
    //   // layer.options.fillColor = '#FAA61A';
    //   // layer.options.color = '#FAA61A';
    //   layer.on('mouseover', function (e) {
    //     layer.bindPopup(`<p> Land id : <b>${countryId}</b><p/>`).openPopup();
    //   });
    // } else if (
    //   [
    //     // 331, 332,
    //     1181, 1182, 1242, 1243, 594, 592, 593, 532, 1302, 1241, 1304, 1742, 1863, 1679, 1739,
    //     // 392, 393,
    //     1740, 1741, 1801, 1802
    //   ].includes(country.properties.id)
    // ) {
    //   // layer.options.fillColor = '#48C3CB';
    //   // layer.options.color = '#48C3CB';
    //   layer.on('mouseover', function (e) {
    //     layer.bindPopup(`<p> Land id : <b>${countryId}</b><p/> <p> owner's name : <b>Mike Le</b><p/>`).openPopup();
    //   });
    // } else {
    // layer.options.color = '#000000';

    layer.on('mouseover', function (e) {
      layer.bindPopup(`<p> Land id : <b>${countryId}</b><p/>`).openPopup();
    });
    // }
  };

  return (
    <div>
      <MapContainer preferCanvas trackResize scrollWheelZoom style={{ height: '100vh', width: '100%' }} zoom={2} center={[1, 1]} crs={CRS.EPSG3857}>
        <div>
          <Footer />
          <Back />
          {data && <GeoJSON style={binStyle} data={data} onEachFeature={onEachCountry} />}
          {/* <RenderLayer /> */}
          {/* <GeoJSON
            style={binStyle}
            data={mapData['features']?.map((f, i) => ({
              ...f,
              properties: {
                ...f.properties,
                ADMIN: `<h3><b color:green>test bam o so ${f.properties.id}</b></h3>`
              }
            }))}
            onEachFeature={onEachCountry}
          /> */}
        </div>
      </MapContainer>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
