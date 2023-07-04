let loadedData = {};

async function getData() {
    let data = await fetch("data.json");
    data = await data.json();
    loadedData = data;
    return data;
}

async function run() {
    console.clear();
    let elm = document.querySelector("#profiles");
    let data = await getData();
    console.log(data);
    let labels = {};
    for (let name in data) {
        let person = data[name];
        // add to labels
        let keys = Object.keys(person);
        keys.forEach(label => {
            if (!labels[label]) {
                labels[label] = [];
            }
            let option = person[label]
            if (!labels[label].includes(option)) {
                labels[label].push(option)
            }
        })
    }
    addDropdowns(labels)

    loadPeople();
}

run();


// other functions
let allowedToSort = [
    "Year of birth",
    "Nationality",
    "Gender"
]
function addDropdowns(labels) {
    let area = document.querySelector("#options");
    area.innerHTML = "";
    Object.keys(labels).forEach(label => {
        if (!allowedToSort.includes(label)) return;
        let options = labels[label];
        options = options.sort();
        options.unshift("All");
        let labelElm = document.createElement("label");
        labelElm.innerText = label;
        area.appendChild(labelElm);
        let selectElm = document.createElement("select");
        if (options.length > 3) {
            selectElm.setAttribute("multiple", "true");
        }
        selectElm.name = label;
        selectElm.addEventListener("change", loadPeople);
        options.forEach(option => {
            let optionElm = document.createElement("option");
            optionElm.innerText = option;
            selectElm.appendChild(optionElm);
        })
        selectElm.value = "All";
        area.appendChild(selectElm);
    });
}

function loadPeople() {
    console.clear();
    console.log("rendering sort");
    let area = document.querySelector("#profiles");
    area.innerHTML = "";
    // get state of data
    let data = loadedData;
    // check what to filter
    let sortElms = document.querySelectorAll("#options select");
    let filters = {};
    sortElms.forEach(elm => {
        if (elm.value == "All") return;
        filters[elm.name] = getSelectValues(elm);
    })
    // filter and display peoples
    let total = 0;
    Object.keys(data).forEach(name => {
        let info = data[name];
        let valid = info.error ? false : true;
        Object.keys(filters).forEach(filterCat => {
            if (!info[filterCat] || !filters[filterCat].includes(info[filterCat])) valid = false;
        })
        if (!valid) return;
        total++;
        addPerson(name, info)
    })
    document.querySelector("h1").innerText = "JWOC Competitor Database - " + total + " total results";
}

function addPerson(name, info) {
    // modify info
    info["year"] = info["Year of birth"].substring(2);
    info["G"] = info["Gender"].substring(0, 1);
    info["club"] = info["Clubs"] ? ", " + info["Clubs"].replaceAll("\n", "\t") : "";
    info["image"] = "https://eventor.orienteering.org/MyPages/ProfilePhoto/" + info["IOF ID"];
    // console.log(name, info);
    // add elm
    let area = document.querySelector("#profiles");
    let elm = document.createElement("div");
    elm.classList.add("person", "text");
    elm.setAttribute("onclick", "window.open('" + info.url + "')");
    elm.innerHTML = `
        <img src="${info.image}"/>
        <div>
            <h1>
                ${name}
                ${getFlag(info.Nationality)}
            </h1>
            <span>${info["Nationality"]}, '${info["year"]}, ${info["G"]}${info["club"]}</span>
        </div>
    `;
    area.appendChild(elm);
    // https://emojicdn.elk.sh/flag-australia
}


function getFlag(nation) {
    nation = nation.toLowerCase().split(" ").join("-");
    if(nation == "great-britain") nation = "united-kingdom";
    if(nation == "turkiye") nation = "turkey";
    if(nation.startsWith("moldova")) nation = "moldova";
    if(nation.startsWith("hong-kong")) nation = "hong-kong-sar-china";
    let x = `<img src="https://emojicdn.elk.sh/flag-${nation}?style=twitter">`;
    return x;
}


function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i = 0, iLen = options.length; i < iLen; i++) {
        opt = options[i];
        if (opt.selected) {
            result.push(opt.value || opt.text);
        }
    }
    return result;
}


/* Change browser theme color when system dark mode */
function changeTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Dark mode on
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeTheme);
  } catch (e) { }
  changeTheme(); //window.addEventListener("load",changeTheme);