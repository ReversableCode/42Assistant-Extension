export const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function reduceDaysToMonths(out: { [x: string]: string }) {
  const monthsLogtimes: any = {};
  for (const [key, value] of Object.entries(out)) {
    const time = value.replace(/[^0-9:.]/g, "").split(":");
    time[2] = time[2].split(".")[0];
    const date = key.substring(0, 7);
    if (!Array.isArray(monthsLogtimes[date])) monthsLogtimes[date] = [];
    monthsLogtimes[date].push(time);
  }
  return monthsLogtimes;
}

function sumUpDailyLogtimes(monthsLogtimes: any) {
  const logtimeSumPerMonth: any = {};
  for (const [date, times] of Object.entries(monthsLogtimes)) {
    const time = sumTime(times as any[]).split(":");
    logtimeSumPerMonth[date] = time[0] + "h " + time[1] + "m " + time[2] + "s";
  }
  return logtimeSumPerMonth;
}

function sumTime(array: any[]) {
  let times = [3600, 60, 1],
    sum = array
      .map((s) => s.reduce((s: any, v: any, i: any) => s + times[i] * v, 0))
      .reduce((a, b) => a + b, 0);

  return times
    .map((t) => [Math.floor(sum / t), (sum %= t)][0])
    .map((v) => v.toString().padStart(2, "0"))
    .join(":");
}

export function getLatestYear(logtimeSumPerMonth: any) {
  let latestYear = 0;
  for (const date of Object.keys(logtimeSumPerMonth)) {
    let yearNum = parseInt(date.split("-")[0]);
    if (yearNum > latestYear) {
      latestYear = yearNum;
    }
  }
  return latestYear + "";
}



function createDropdownElement(logtimeSumPerMonth: any) {
  let dropdown = document.createElement("select");
  dropdown.id = "available-months";
  dropdown.className = "uppercase bg-white bg-opacity-20 font-bold text-white";
  dropdown.onchange = insertSum(logtimeSumPerMonth);
  return dropdown;
}

function createOptionElements(dropdown: HTMLSelectElement, logtimeSumPerMonth: any) {
  for (const date of Object.keys(logtimeSumPerMonth)) {
    let option = document.createElement("option");
    let monthNum = parseInt(date.split("-")[1]);
    let yearNum = parseInt(date.split("-")[0]);
    option.text = monthNames[monthNum - 1];
    option.value = yearNum + "";
    dropdown.appendChild(option);
  }
  return dropdown;
}

function setDefaultOption(latestYear: string, dropdown: HTMLSelectElement, logtimeSumPerMonth: any) {
  let latestMonth = getLatestMonth(latestYear, logtimeSumPerMonth);
  for (let i = 0; i < Object.keys(logtimeSumPerMonth).length; i++) {
    let option = dropdown.options[i];
    if (option.value == (latestMonth + "")) {
      option.selected = true;
      return option;
    }
  }
  return null;
}

function getLatestMonth(latestYear: string, logtimeSumPerMonth: any) {
  let latestMonth = 0;
  for (const date of Object.keys(logtimeSumPerMonth)) {
      let year = date.split("-")[0];
      let month = date.split("-")[1];
      if (year == latestYear) {
          let monthNum = parseInt(month);
          if (monthNum > latestMonth) {
              latestMonth = monthNum;
          }
      }
  }
  return latestMonth;
}

function insertSum(logtimeSumPerMonth: any) {
  return () => {
    let sum = getSelectedMonthSum(logtimeSumPerMonth);
    let sumSpan = document.getElementById("month-sum") as HTMLSpanElement;
    let animationSpan = createAnimationSpan();
    animationSpan.innerText = sum || "00h 00m 00s";
    let oldChild = sumSpan.firstChild;
    if (oldChild) sumSpan.replaceChild(animationSpan, oldChild);
    else sumSpan.append(animationSpan);
    return sumSpan;
  };
}

function getSelectedMonthSum(logtimeSumPerMonth: any) {
  try {
    let selectedMonth = document.getElementById("available-months") as HTMLSelectElement;
    let yearNum = selectedMonth.options[selectedMonth.selectedIndex].value;
    let monthName = selectedMonth.options[selectedMonth.selectedIndex].text;
    let monthNumber = "0" + (monthNames.indexOf(monthName) + 1);
    let date = yearNum + "-" + monthNumber.slice(-2);
    return logtimeSumPerMonth[date];
  } catch (error) {
    return 0;
  }
}

function createAnimationSpan() {
  let animationSpan = document.createElement("span");
  animationSpan.style.animation = "fadeIn .21s";
  return animationSpan;
}

function createSumSpanElement() {
  let sumSpan = document.createElement("span");
  sumSpan.id = "month-sum";
  sumSpan.className = "underline decoration-dotted lowercase italic font-bold text-sm";
  return sumSpan;
}

function createMessageSpanElement(who: string, dropdown: HTMLSelectElement, sumSpan: HTMLSpanElement) {
  let message = document.createElement("span");
  message.append(who, " ", dropdown, " logtime is ", sumSpan);
  return message;
}

export default function getUserLogtime(out: any) {
  const logtimeSumPerMonth = sumUpDailyLogtimes(reduceDaysToMonths(out));
  let dropdown = createOptionElements(
    createDropdownElement(logtimeSumPerMonth),
    logtimeSumPerMonth
  );
  let sumSpan = createSumSpanElement();
  let message = createMessageSpanElement("Your", dropdown, sumSpan);
  let logtimeTitleElement = document.querySelector("#logtime-instance") as HTMLSelectElement;
  if (logtimeTitleElement) {
    logtimeTitleElement.innerHTML = "";
    logtimeTitleElement.appendChild(message);
    sumSpan = insertSum(logtimeSumPerMonth)();
  }
  return logtimeSumPerMonth;
}
