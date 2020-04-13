import React, { Component, createRef, useState, useEffect } from "react";
import Script from "react-load-script";
import styled from "styled-components";

import { NearCard } from "../components/NearMap";
// import { theme, mq } from "../constants/theme";

// const { colors } = theme;
// const { tablet, desktop } = mq;

const url = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}&libraries=places`;
console.log(url);

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40rem, 4fr));
  grid-column-gap: 0.5rem;

  & > div {
    grid-column-start: 1;
    grid-column-end: 4;

    @media screen and (min-width: 1024px) {
      grid-column-end: 1;
      &:nth-of-type(2) {
        grid-column-start: 2;
        grid-column-end: 4;
      }
    }
  }
`;

const Nested = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const MapStyle = styled.div`
  margin: 2% auto;
  width: 100%;
  /* max-width: 80rem; */
  height: 100vh;
  min-height: 30rem;
`;

export const NrMap = (props) => {
  const [state, updateState] = useState({
    nearPlaces: [],
  });
  const { nearPlaces } = state;

  function handleScriptLoad() {
    let map;
    let pyrmont = new window.google.maps.LatLng(13.0827, 80.2707);
    let inRange = [];
    // const placeImageOpts = {
    //   size: new window.google.maps.Size(24, 24),
    //   origin: new window.google.maps.Point(0, 0),
    //   anchor: new window.google.maps.Point(17, 34),
    //   scaledSize: new window.google.maps.Size(5, 5),
    // };
    map = new window.google.maps.Map(document.getElementById("map"), {
      center: pyrmont,
      zoom: 12,
      disableDefaultUI: true,
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let pos = new window.google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );

          map.setCenter(pos);
          let service = new window.google.maps.places.PlacesService(map);
          service.nearbySearch(
            {
              location: pos,
              radius: 16100,
              type: ["hospital"],
            },
            function (results, status) {
              if (status !== "OK") return "no hospitals";
              createMarkers(results);
            },
          );
          // Add circle overlay and bind to marker
          const radiusMarker = new window.google.maps.Circle({
            map: map,
            center: pos,
            radius: 16100, // 10 miles in metres
            fillColor: "blue",
            fillOpacity: 0.3,
            strokeWeight: 0,
          });
          map.fitBounds(radiusMarker.getBounds());

          new window.google.maps.InfoWindow({
            map: map,
          });

          function createMarkers(places) {
            console.log("markers", places);

            let bounds = new window.google.maps.LatLngBounds();
            for (var i = 0, place; (place = places[i]); i++) {
              var request = {
                placeId: place.place_id,
                fields: [
                  "name",
                  "formatted_address",
                  "formatted_phone_number",
                  "opening_hours",
                  "geometry",
                  "icon",
                ],
              };
              service.getDetails(request, callback);

              function callback(place, status) {
                if (
                  status === window.google.maps.places.PlacesServiceStatus.OK
                ) {
                  inRange.push(place);

                  let image = {
                    url: place.icon,
                    size: new window.google.maps.Size(24, 24),
                    origin: new window.google.maps.Point(0, 0),
                    anchor: new window.google.maps.Point(17, 34),
                    scaledSize: new window.google.maps.Size(5, 5),
                  };
                  new window.google.maps.Marker({
                    map: map,
                    icon: image,
                    title: place.name,
                    position: place.geometry.location,
                  });
                  bounds.extend(place.geometry.location);

                  return inRange;
                }

                new window.google.maps.Marker({
                  map: map,
                  position: pos,
                });
                bounds.extend(pos);
              }
            }
          }
          updateState({ ...state, nearPlaces: inRange });
        },
        function () {
          handleNoGeolocation(true);
        },
      );
    } else {
      handleNoGeolocation(false);
    }

    function handleNoGeolocation(errorFlag) {
      let content;
      if (errorFlag) {
        content = "Error: The Geolocation service failed.";
      } else {
        content = "Error: Your browser doesn't support geolocation.";
      }

      var options = {
        map: map,
        position: new window.google.maps.LatLng(60, 105),
        content: content,
      };

      new window.google.maps.InfoWindow(options);
      map.setCenter(options.position);
    }
  }

  return (
    <>
      <Script url={url} onLoad={handleScriptLoad} />
      <Wrapper>
        <div>
          <Nested>
            {console.log("state", state)}
            {state.nearPlaces &&
              state.nearPlaces.map((place, i) => (
                <NearCard key={`nearcard_${i}`}>
                  <h3>{place.name}</h3>
                  <p>{place.formatted_address}</p>
                  <p>{place.formatted_phone_number}</p>
                </NearCard>
              ))}
          </Nested>
        </div>
        <div>
          <MapStyle id="map" />
        </div>
      </Wrapper>
    </>
  );
};
// class NrMap extends Component {
//   constructor(props) {
//     super(props);
//   }

//   handleScriptLoad() {
//     let map;
//     let pyrmont = new window.google.maps.LatLng(13.0827, 80.2707);

//     map = new window.google.maps.Map(document.getElementById("map"), {
//       center: pyrmont,
//       zoom: 12,
//       disableDefaultUI: true,
//     });

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         function (position) {
//           let pos = new window.google.maps.LatLng(
//             position.coords.latitude,
//             position.coords.longitude,
//           );

//           map.setCenter(pos);
//           let service = new window.google.maps.places.PlacesService(map);
//           service.nearbySearch(
//             {
//               location: pos,
//               radius: 16100,
//               type: ["hospital"],
//             },
//             function (results, status) {
//               if (status !== "OK") return "no hospitals";
//               createMarkers(results);
//             },
//           );
//           // Add circle overlay and bind to marker
//           const radiusMarker = new window.google.maps.Circle({
//             map: map,
//             center: pos,
//             radius: 16100, // 10 miles in metres
//             fillColor: "blue",
//             fillOpacity: 0.3,
//             strokeWeight: 0,
//           });
//           map.fitBounds(radiusMarker.getBounds());

//           new window.google.maps.InfoWindow({
//             map: map,
//           });

//           let nearPlaces = [];

//           function createMarkers(places) {
//             let bounds = new window.google.maps.LatLngBounds();
//             for (var i = 0, place; (place = places[i]); i++) {
//               var request = {
//                 placeId: place.place_id,
//                 fields: [
//                   "name",
//                   "formatted_address",
//                   "formatted_phone_number",
//                   "opening_hours",
//                   "geometry",
//                   "icon",
//                 ],
//               };
//               service.getDetails(request, callback);

//               function callback(place, status) {
//                 if (
//                   status == window.google.maps.places.PlacesServiceStatus.OK
//                 ) {
//                   let board = document.createElement("div");
//                   this.props.update(nearPlaces.push(place));
//                   console.log(this.props);

//                   let str = "";
//                   str +=
//                     '<div style="border: 1px solid #eee;box-shadow: 0 2px 6px #bababa;border-radius: 10px;padding: 20px;margin: 10px;">';
//                   str += "<h3>" + place.name + "</h3>";
//                   str +=
//                     '<div><p class="card-text">' +
//                     place.formatted_address +
//                     '</p><p style="color: #425af2;" }>' +
//                     place.formatted_phone_number +
//                     "</p></div>";
//                   let image = {
//                     url: place.icon,
//                     size: new window.google.maps.Size(71, 71),
//                     origin: new window.google.maps.Point(0, 0),
//                     anchor: new window.google.maps.Point(17, 34),
//                     scaledSize: new window.google.maps.Size(25, 25),
//                   };
//                   new window.google.maps.Marker({
//                     map: map,
//                     icon: image,
//                     title: place.name,
//                     position: place.geometry.location,
//                   });
//                   bounds.extend(place.geometry.location);
//                   board.innerHTML = str;
//                   str = "";
//                   document.getElementById("board").appendChild(board);
//                 }
//                 new window.google.maps.Marker({
//                   map: map,
//                   position: pos,
//                 });
//                 bounds.extend(pos);
//               }
//             }
//           }
//         },
//         function () {
//           handleNoGeolocation(true);
//         },
//       );
//     } else {
//       handleNoGeolocation(false);
//     }

//     function handleNoGeolocation(errorFlag) {
//       if (errorFlag) {
//         var content = "Error: The Geolocation service failed.";
//       } else {
//         var content = "Error: Your browser doesn't support geolocation.";
//       }

//       var options = {
//         map: map,
//         position: new window.google.maps.LatLng(60, 105),
//         content: content,
//       };

//       new window.google.maps.InfoWindow(options);
//       map.setCenter(options.position);
//     }
//   }

//   render() {
//     return (
//       <>
//         <Script url={url} onLoad={this.handleScriptLoad} />
//         <Wrapper>
//           <div>
//             <Nested id="board" />
//           </div>
//           <div>
//             <MapStyle id="map" />
//           </div>
//         </Wrapper>
//       </>
//     );
//   }
// }

// export default NrMap;
