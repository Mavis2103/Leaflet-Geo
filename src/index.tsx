import * as React from 'react';
import L, { CRS, LatLngBounds, Icon } from 'leaflet';
import mapData from './pangea.json';
import vector from './1M.json';
import { createRoot } from 'react-dom/client';
import { GeoJSON, MapContainer, Polygon, useMap, useMapEvents, TileLayer, Marker, Popup, ImageOverlay, useMapEvent } from 'react-leaflet';
import Back from './Back';
import * as topojson from 'topojson-client';
import Footer from './footer';
import './styles.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

// const myIcon = new Icon({
//   iconUrl: marker,
//   iconSize: [32, 32]
// });

const binStyle = {
  fillColor: '#fff',
  fillOpacity: 1,
  // color: '#000',
  weight: 1
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
  const [isFarmMode, setIsFarmMode] = React.useState(false);
  const [currentPoint, setCurrentPoint] = React.useState();
  const map = useMap();
  const mapEvents = useMapEvents({
    zoomend: e => {
      console.log(e);
      setIsFarmMode(mapEvents.getZoom() === 4);
    }
  });

  const onEachCountry = (country, layer) => {
    const countryId = country.properties.OBJECTID;

    layer.on({
      'click': function (e) {
        layer.bindPopup(`<p> Land id : <b>${country.geometry.coordinates}</b><p/>`).openPopup();
      },
      mouseover: function (e) {},
      zoomed: () => {}
    });
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
  console.count('map render');

  const neighbor = React.useMemo(() => {
    if (currentPoint) {
      const k = 5;
      const n = (k * (2 * 8 + (k - 1) * 8)) / 2 + 1;
      const x = currentPoint;

      let axis_x = [];
      let axis_y = [];
      Array(k)
        .fill(0)
        .forEach((_, k_i) => {
          const x = Math.sqrt(n) * (k_i + 1);
          const y = k_i + 1;
          axis_x.push(x, -x);
          axis_y.push(y, -y);
        });
      const temp = [];
      axis_x.forEach(x => {
        temp.push(x);
        axis_y.forEach(y => {
          temp.push(x + y);
        });
      });
      return temp.concat(axis_y).map(C => x + C);
    }
  }, [currentPoint]);

  const onClick = id => e => {
    if (isFarmMode) {
      setCurrentPoint(id);
    }
  };
  const owner = [301, 190, 191, 192, 269, 230, 233, 297, 298, 302, 304, 303];
  const myLand = [296, 298, 299];
  const featureNearest = React.useCallback(
    fid => {
      // return isFarmMode ? (neighbor?.includes(fid) ? (owner.includes(fid) ? '#fff' : '#002E5E') : '#002E5E') : '#002E5E';
      return isFarmMode ? (owner.includes(fid) ? '#ffdd00' : '#002E5E') : '#002E5E';
    },
    [currentPoint]
  );
  return (
    <>
      {/* <GeoJSON data={mapData} style={binStyle} onEachFeature={onEachCountry} /> */}
      <MarkerClusterGroup>
        {vector?.features.map(v => {
          const latlng = v.geometry.coordinates[0][0].map(item => [item[1], item[0]]);
          return (
            <Polygon
              key={v.properties.fid}
              positions={latlng}
              eventHandlers={{ mouseover: onClick(v.properties.fid) }}
              pathOptions={{
                fillColor: featureNearest(v.properties.fid),
                fillOpacity: myLand.includes(v.properties.fid) ? 0 : 1,
                weight: 0,
                opacity: 0
              }}>
              {myLand.includes(v.properties.fid) && <Item {...{ latlng, isFarmMode }} />}
            </Polygon>
          );
        })}
      </MarkerClusterGroup>
      {/* <Marker position={vector.features[0].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[1].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[2].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[3].geometry.coordinates[0][0].reverse()} icon={myIcon} />
        <Marker position={vector.features[4].geometry.coordinates[0][0].reverse()} icon={myIcon} /> */}
    </>
  );
}

const Item = ({ latlng, isFarmMode }) => {
  return isFarmMode ? (
    <ImageOverlay url={'https://th.bing.com/th/id/R.cd8d9f8953f53182b71c7ae4c3fc5b63?rik=05wJnhix1vGwhg&pid=ImgRaw&r=0'} bounds={latlng} />
  ) : (
    <Polygon positions={latlng} pathOptions={binStyle} />
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <MapContainer style={{ height: '100vh', width: '100%' }} zoom={0} maxZoom={4} center={[1, 1]} crs={CRS.EPSG3857}>
    <App />
  </MapContainer>
);
