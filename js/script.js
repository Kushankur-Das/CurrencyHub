const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button");
exchangeIcon = document.querySelector("form .icon");
for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected =
      i == 0
        ? currency_code == "USD"
          ? "selected"
          : ""
        : currency_code == "INR"
        ? "selected"
        : "";
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[
        code
      ].toLowerCase()}.png`;
    }
  }
}

getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateTxt = document.querySelector("form .exchange-rate");
  const charges = document.querySelector("form .Banking_Charges");
  let amountVal = amount.value;
  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  } else if (amountVal < 0) {
    exchangeRateTxt.innerText = "";
    charges.innerText = "";
    window.alert("Please enter a proper currency amount");
    return;
  }
  exchangeRateTxt.innerText = "Getting Exchange Rate...";
  charges.innerText = "Calculating Charges...";
  let url = ` https://v6.exchangerate-api.com/v6/eef9554ad872bf3d565ebc27/latest/${fromCurrency.value}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      console.log(exchangeRate);
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      let Banking_Charges = (totalExRate * 0.18).toFixed(2);
      exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
      //if from currency is same as to currency no charges
      if (fromCurrency.value == toCurrency.value) {
        charges.innerText= `Banking Charges: 0`;
      } else {
        charges.innerText = `Banking Charges: ${Banking_Charges} ${toCurrency.value}`;
      }
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Something went wrong";
      charges.innerText = "Something went wrong";
    });
}
