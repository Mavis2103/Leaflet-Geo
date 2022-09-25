import React from 'react';
import { useMap } from 'react-leaflet';

const Tools = () => {
  const map = useMap();
  const flyToMyLocation = () => {
    map.flyTo(
      averageGeolocation(
        [
          [-16.659962563243056, -20.653698196474249],
          [-7.676809722047841, -20.653698196474249],
          [-7.676809722047841, -28.803292924646957],
          [-16.659962563243056, -28.803292924646957],
          [-16.659962563243056, -20.653698196474249]
        ].map(item => [item[1], item[0]])
      ),
      5
    );
  };
  return (
    <div
      style={{
        position: 'absolute',
        right: 50,
        bottom: '30%',
        display: 'grid',
        gridTemplate: '3fr 1fr',
        rowGap: 20,
        backgroundColor: '#fff',
        padding: '20px 10px',
        zIndex: 999,
        borderRadius: 16
      }}>
      <img onClick={flyToMyLocation} src='https://cdn-icons-png.flaticon.com/512/1483/1483336.png' alt='' height={42} />
      <img src='https://cdn-icons-png.flaticon.com/512/346/346195.png' alt='' height={42} />
    </div>
  );
};
function averageGeolocation(coords) {
  if (coords.length === 1) {
    return coords[0];
  }

  let x = 0.0;
  let y = 0.0;
  let z = 0.0;

  for (let coord of coords) {
    let latitude = (coord[0] * Math.PI) / 180;
    let longitude = (coord[1] * Math.PI) / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  }

  let total = coords.length;

  x = x / total;
  y = y / total;
  z = z / total;

  let centralLongitude = Math.atan2(y, x);
  let centralSquareRoot = Math.sqrt(x * x + y * y);
  let centralLatitude = Math.atan2(z, centralSquareRoot);

  return [(centralLatitude * 180) / Math.PI, (centralLongitude * 180) / Math.PI];
}

export default Tools;
