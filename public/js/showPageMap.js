
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: rock.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(rock.geometry.coordinates)
    .addTo(map)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${rock.name}</h3><p>${rock.location.area}, ${rock.location.country}</p>`
            )
    )
