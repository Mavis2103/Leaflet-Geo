import * as React from 'react';
import L, { CRS, LatLngBounds, Icon } from 'leaflet';
import mapData from './pangea.json';
import vector from './dcm.json';
import { createRoot } from 'react-dom/client';
import { GeoJSON, MapContainer, Polygon, useMap, useMapEvents, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import Back from './Back';
import * as topojson from 'topojson-client';
import Footer from './footer';
import './styles.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import marker from './UI_back.png';

const myIcon = new Icon({
  iconUrl: marker,
  iconSize: [32, 32]
});

const binStyle = {
  // fillColor: '#002E5E',
  // fillOpacity: 1,
  // color: '#000',
  weight: 2
};
const useData = json => {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    if (json['type'] === 'Topology') {
      for (let key in json['objects']) {
        let geojson = topojson.feature(json, json['objects'][key]);
        setData(geojson);
      }
    } else {
      setData(json);
    }
  }, []);
  return data;
};
function App() {
  const data = useData(mapData);
  const map = useMap();
  console.log('get', map.getZoom());

  // const mapEvents = useMapEvents({
  //   zoomend: () => {
  //     // console.log(mapEvents.getZoom());
  //   }
  // });

  const onEachCountry = (country, layer) => {
    const countryId = country.properties.OBJECTID;
    layer.bringToBack();
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

    layer.on({
      'click': function (e) {
        // layer.fitBounds(e.propagatedFrom);
        // layer.setStyle({
        //   fillColor: '#fff'
        // });
        layer.bindPopup(`<p> Land id : <b>${countryId}</b><p/>`).openPopup();
      },
      mouseover: function (e) {
        // console.log(countryId);
        // console.log(e.latlng);
        // map.      }
      },
      zoomed: () => {
        // console.log(mapEvents.getZoom());
      }
    });
    // console.log(country.properties);

    layer.on({
      zoomed: () => {
        console.log('zoomed');

        // console.log(mapEvents.getZoom());
      }
    });
    // }
  };
  const parkIcon = new L.Icon({
    iconUrl: './UI_back.png',
    iconSize: [100, 100],
    popupAnchor: [0, 0]
  });
  const pointToLayer = (feature, latlng): L.Marker => {
    return L.marker(latlng, {
      icon: parkIcon
    });
  };
  // React.useEffect(() => {
  //   vector?.features.map(v => {
  //     const latlng = v.geometry.coordinates[0][0].map(item => [item[1], item[0]]);
  //     const image = L.imageOverlay(marker, latlng).addTo(map);
  //   });
  // }, [vector]);
  return (
    <>
      {/* <GeoJSON data={mapData} style={binStyle} onEachFeature={onEachCountry} /> */}
      {vector?.features.map(v => {
        const latlng = v.geometry.coordinates[0][0].map(item => [item[1], item[0]]);
        return (
          <>
            <Polygon
              key={v.properties.fid}
              positions={latlng}
              pathOptions={{
                fillColor: '#002E5E',
                fillOpacity: [44, 111, 442, 30, 55, 56, 32].includes(v.properties.fid) ? 0 : 1,
                weight: 2,
                opacity: 0
              }}>
              {[44, 111, 442, 30, 55, 56, 32].includes(v.properties.fid) && (
                <ImageOverlay
                  key={v.properties.fid}
                  url={'https://th.bing.com/th/id/R.cd8d9f8953f53182b71c7ae4c3fc5b63?rik=05wJnhix1vGwhg&pid=ImgRaw&r=0'}
                  bounds={latlng}
                />
              )}
            </Polygon>
          </>
        );
      })}
      <MarkerClusterGroup>
        {/* <Marker position={vector.features[0].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[1].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[2].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[3].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[4].geometry.coordinates[0][0].reverse()} icon={myIcon} /> */}
      </MarkerClusterGroup>
    </>
  );
}

function Test() {
  return (
    <>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />

      <MarkerClusterGroup>
        <Marker position={[49.8397, 24.0297]}>
          <img src='./UI_back.png' alt='' />
        </Marker>
        <Marker position={[52.2297, 21.0122]} />
        <Marker position={[51.5074, -0.0901]} />
      </MarkerClusterGroup>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <MapContainer style={{ height: '100vh', width: '100%' }} zoom={0} maxZoom={5} center={[1, 1]} crs={CRS.EPSG3857}>
    <App />
  </MapContainer>
);
