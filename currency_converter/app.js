const BASE_URL = "https://api.currencyapi.com/v3/latest?apikey=cur_live_EeGbWTiObwEcm4XNIVVlgc9SQrmz8cjb28Ndw0h8";

let dropdown = document.querySelectorAll(".dropdown select");
let btn = document.querySelector("form button");
let fromCurr = document.querySelector(".from select");
let toCurr = document.querySelector(".to select");
let msg = document.querySelector(".msg");
let amount = document.querySelector(".input_val");

async function getExchangedCurrency() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API Response:', data);

    const fromCurrency = fromCurr.value;
    const toCurrency = toCurr.value;

    // Check if the rates object contains the required currencies
    if (!data.data[fromCurrency] || !data.data[toCurrency]) {
      throw new Error(`Currency data for ${fromCurrency} or ${toCurrency} is not available`);
    }

    const exchangeRate = data.data[toCurrency].value / data.data[fromCurrency].value;
    console.log('Exchange Rate:', exchangeRate);

    const convertedAmount = amount.value * exchangeRate;
    msg.innerText = `${amount.value} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
  } catch (error) {
    console.error('Error:', error);
  }
}

const updateDisplay = () => {
  console.log(amount.value);
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 0) {
    amtVal = 1;
    amount.value = "1";
  }
  getExchangedCurrency();
};

for (let select of dropdown) {
  // traversing each element of country list
  // assuming countryList is defined elsewhere
  for (let currcode in countryList) {
    // creating new option for dropdowns
    let newOption = document.createElement("option");
    newOption.innerText = currcode;
    newOption.value = currcode;
    // declaring the default setting
    if (select.name === "from" && currcode === "USD") {
      // fixing this as a default on the page on the from side;
      newOption.selected = true;
    } else if (select.name === "to" && currcode === "INR") {
      // fixing this as a default on the page on the to side;
      newOption.selected = true;
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateflag(evt.target);
  });
}

const updateflag = (evt) => {
  let currCode = evt.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = evt.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateDisplay();
});
