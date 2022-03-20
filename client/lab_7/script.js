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

// TODO: Make HTML from collection
function createHtmlList(collection) {
  // console.log('fired HTML creator');
  console.log(collection);
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
  console.log('script loaded');
  const form = document.querySelector('.hunger-form');
  const submit = document.querySelector('.submit');

  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');
  submit.style.display = 'none';

  const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
  const arrayFromJson = await results.json(); // This changes it into data we can use - an object
  // console.log('data is here');

  // This if statement is to prevent a race condition on data load
  if (arrayFromJson.data.length > 0) {
    submit.style.display = 'block';

    let currentArray = [];
    resto.addEventListener('input', async (event) => {
      if (currentArray.length < 1) {
        return;
      }
      // console.log(event.target.value);

      const selectResto = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      console.log(selectResto);
      createHtmlList(selectResto);
      // console.log('matchResto');


    });

    form.addEventListener('submit', async (submitEvent) => {
      // async has to be declared all the way to get an await
      submitEvent.preventDefault(); // This prevents your page from refreshing!
      // console.log('form submission'); // this is substituting for a "breakpoint"
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
      currentArray = restArrayMake(arrayFromJson.data);
      console.log(currentArray);
      createHtmlList(currentArray);
    });
  }
}
// this actually runs first! It's calling the function above
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
