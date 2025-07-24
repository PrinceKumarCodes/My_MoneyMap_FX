//------------My Currency Converter Script------------
//This script is used to convert one currency to another using exchange rates from an API.

// Base api url for fetching currency exchange rates
const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies/";

//Selecting the required DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btnConvert = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const swap = document.querySelector(".dropdown i");

//Load default exchange rate assoon as the page load .
window.addEventListener("load", () => {
  updateExchangeRate();
});

//populate the dropdown with currency codes from countryList
for (let select of dropdowns) {
  for (let currcode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currcode;
    newOption.value = currcode;

    //select default selection ( USD to INR)
    if (select.name === "from" && currcode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currcode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  //update country flag on changing the currency in dropdown
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

//This function is used to update flag based on the selected currency
const updateFlag = (element) => {
  let currcode = element.value;
  countryCode = countryList[currcode]; //Get the country ISO (International organization for standardizationi) code from countryList.
  let newStr = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newStr; //Update flag image source with the new URL.
};
 
//Handle ["Get exchange rate"] button click event
btnConvert.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate(); 
});

//Main function to fetch and update exchange rate .
const updateExchangeRate = async () => {
  let amount = document.querySelector("form input");
  let amtVal = amount.value;
  // console.log(amtVal);

  //Validation: if invalid amount , set amtVal to 1 and show alert.
  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
    alert("Please enter a valid amount");
    return;
  }

  //Get the selected currenies (lowercase for API compatibility)
  var fromCurrency = fromCurr.value.toLowerCase();
  var toCurrency = toCurr.value.toLowerCase();
  // console.log(fromCurrency, toCurrency);

  //Fetch exchange rate from API
  const URL = `${BASE_URL}/${fromCurrency}.json?`;
  const responce = await fetch(URL);
  const data = await responce.json();
  const rates = data[fromCurrency][toCurr.value.toLowerCase()];//Extract the required currency rate.
  // console.log(rates);
  var finalAmount = rates * amtVal;
  // console.log(finalAmount);
  //show converted amount in the UI(user interface)
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
};//Handle ["swap"] button click event to swap currencies
swap.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  //Update the flags after swapping currencies
  updateFlag(fromCurr);
  updateFlag(toCurr);
 });

