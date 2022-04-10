function getRandomIntInclusive(min, max) {
  const newMin = Math.ceil(min);
  const newMax = Math.floor(max);
  return Math.floor(Math.random(
  ) * (newMax - newMin + 1) + newMin); // The maximum is inclusive and the minimum is inclusive
}

function restArrayMake(dataArray) {
  // console.log('fired dataHandler')
  // console.table(dataArray); // this is called "dot notation"
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const restNum = getRandomIntInclusive(0, dataArray.length - 1);
    return dataArray[restNum];
  });

  // console.log(listItems);
  return listItems;
}

function initMap() {
  const latLong = [38.784, -76.872];
  const map = L.map('map').setView(latLong, 11);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
  }).addTo(map);
  return map;
}

function addMapMarkers(map, collection) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  collection.forEach((item) => {
    const point = item.geocoded_column_1?.coordinates;
    console.log(item.geocoded_column_1?.coordinates);
    L.marker([point[1], point[0]]).addTo(map);
  });
}

function createHtmlList(collection) {
  // console.log('fired HTML creator');
  // console.log(collection);
  const targetList = document.querySelector('.resto-list');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const {name} = item;
    const displayName = name.toLowerCase();
    const injectThisItem = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

async function mainEvent() {
  // the async keyword means we can make API requests
  // console.log('script loaded');
  const form = document.querySelector('.hunger-form');
  const submit = document.querySelector('.submit');

  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');
  const map = initMap('map');
  const retrievalVar = 'restaurants';
  submit.style.display = 'none';

  if (!localStorage.getItem(retrievalVar)) {
    const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    // console.log(arrayFromJson);
    localStorage.setItem(retrievalVar, JSON.stringify(arrayFromJson.data));
  }

  const storedDataString = localStorage.getItem(retrievalVar);
  const storedDataArray = JSON.parse(storedDataString);
  console.log(storedDataArray);

  // console.log('data is here');
  // const arrayFromJson = {data: []}; // TODO: remove debug tool

  // This if statement is to prevent a race condition on data load
  if (storedDataString?.length > 0) {
    submit.style.display = 'block';

    let currentArray = [];
    resto.addEventListener('input', async (event) => {
      if (currentArray.length < 1) {
        return;
      }
      // console.log(event.target.value);

      const selectResto = storedDataArray.data.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      // console.log(selectResto);
      createHtmlList(selectResto);
      // console.log('matchResto');
    });

    zipcode.addEventListener('input', async (event) => {
      if (currentArray.length < 1) {
        return;
      }
      const selectZip = currentArray.filter((item) => item.zip.includes(event.target.value)
        // console.log(item.zip);
      );

      createHtmlList(selectZip);
      // });
    });

    form.addEventListener('submit', async (submitEvent) => {
      // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      // console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
      currentArray = restArrayMake(storedDataArray.data);
      // console.log(currentArray);
      createHtmlList(currentArray);

      addMapMarkers(map, currentArray);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
