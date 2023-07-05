// ==UserScript==
// @name        Eventor Competitor Scrape
// @match       https://eventor.orienteering.org/Events/DetailedGroupEntryOverview/*
// @match       https://eventor.orienteering.org/Athletes/Details/*
// @version     1.0
// @author      irom1
// @description 7/4/2023, 11:27:10 AM
// ==/UserScript==


function getData() {
  // load storage
  let data = localStorage.scrape || "{}";
  data = JSON.parse(data);
  return data;
}

function saveData(data) {
  localStorage.scrape = JSON.stringify(data);
  console.log("Updated data:", data);
}

function scrape() {
  let data = getData();
  // get event ID
  let id = location.pathname.split("/")[3];
  console.log("Event ID: " + id);
  // get event data
  let event = data[id] || {};
  // get list of people
  let list = document.querySelectorAll(".person .details strong a");
  list.forEach(link => {
    let name = link.innerText;
    let url = link.href;
    let category = link.parentElement.parentElement.parentElement.parentElement.previousElementSibling.innerText;
    if(category.includes("Official")) return;
    let person = event[name];
    if(!person) {
      event[name] = {
        "url": url,
        "category": category
      }
    }
  });
  // save event data
  data[id] = event;
  saveData(data);
}


function updateScrape() {
  let url = location.href;
  let data = getData();
  // search through data to find profile and event that matches url
  let id, name;
  for(let eventID in data) {
    let event = data[eventID];
    for(let personName in event) {
      let personURL = event[personName].url;
      if(personURL == url) {
        id = eventID;
        name = personName;
        console.log("found");
        break;
      }
    }
    if(id) break;
  }
  let person = data[id][name];
  console.log(id, name, person);
  // check for error
  let mainText = document.querySelector("#main").innerText;
  if(mainText.includes("An error occured")) {
    if(!person.error) person.error = 0;
    person.error++;
  } else if(person.error) {
    delete person.error;
  }
  // get data on user
  let headers = document.querySelectorAll(".athleteFactsHead");
  headers.forEach(elm => {
    let key = elm.innerText;
    let value = elm.nextElementSibling.innerText;
    person[key] = value;
  })
  data[id][name] = person;
  console.log(person);
  saveData(data);
  // move on to next person
  nextScrape(id);
}


function nextScrape(id) {
  // find next unscraped person in event with id and go to their profile URL to scrape
  let data = getData();
  let event = data[id];
  let found = false;
  for(let name in event) {
    let info = event[name];
    if(!info["Nationality"] && !info["error"]) {
      found = true;
      location.href = info.url;
      break;
    }
  }
  var searchRound = 1;
  let errors = 1;
  while(!found && errors > 0) {
    errors = 0;
    for(let name in event) {
      let info = event[name];
      if(info["error"]) errors++;
      if(info["error"] == true) info["error"] = 1;
      if(info["error"] == searchRound) {
        found = true;
        location.href = info.url;
        break;
      }
    }
    searchRound++;
  }
}

function start() {
  let path = location.pathname;
  if(path.startsWith("/Athletes/Details/")) {
    setTimeout(updateScrape, 1000);
  } else if(path.startsWith("/Events/DetailedGroupEntryOverview/")) {
    setTimeout(scrape, 3000);
  }
}

start();
