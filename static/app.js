content_container = document.getElementsByClassName("content")[0];
from_hint = document.getElementById("from-hint");
to_hint = document.getElementById("to-hint");
hour = document.getElementById("hour");
var from_eva = "";
var from_name = "";
var to_eva = "";
var to_name = "";

let today = new Date().toISOString().slice(0, 10).replace("-", "").substring(2).replace("-", "")

async function searchButtonClick() {
    content_container.innerHTML = "Loading";
    from_changes = await fetch(`/get_recent_changes/${from_eva}`);
    to_changes = await fetch(`/get_recent_changes/${to_eva}`);
    from_plans = await fetch(`/get_plan/${from_eva}/${today}/${hour.value}`)
    to_plans = await fetch(`/get_plan/${to_eva}/${today}/${hour.value}`)
    var from_data = await from_plans.json()
    var to_data = await to_plans.json()
    var from_changes_data = await from_changes.json()
    var to_changes_data = await to_changes.json()
    content_container.innerHTML = "";
    for (const first in from_data.journeys) {

        for (const second in to_data.journeys) {

            if (from_data.journeys[first].departure.path.includes(to_name)) {

                if (to_data.journeys[second].arrive.path.includes(from_name)) {

                    if (from_data.journeys[first].type == to_data.journeys[second].type && from_data.journeys[first].number == to_data.journeys[second].number) {

                        // matched one journey
                        // check for changes
                        var departure_time = "";
                        var arrive_time = "";
                        var departure_date = "";
                        var arrive_date = "";
                        var departure_track = "";
                        var arrive_track = "";

                        if (from_changes_data[0] != undefined) {
                            var something_found = false;
                            for (const from_change in from_changes_data.changes) {
                                if (from_change == first) {
                                    departure_time = from_changes_data.changes[first].departure.time
                                    something_found = true;
                                }
                            }
                            if (!something_found) {
                                departure_time = from_data.journeys[first].departure.time
                            }
                        } else {
                            departure_time = from_data.journeys[first].departure.time
                        }

                        if (to_changes_data[0] != undefined) {
                            var something_found = false;
                            for (const to_change in to_changes_data.changes) {
                                if (to_change == second) {
                                    arrive_time = to_changes_data.changes[second].arrive.time
                                    something_found = true;
                                }
                            }
                            if (!something_found) {
                                arrive_time = to_data.journeys[second].arrive.time
                            }
                        } else {
                            arrive_time = to_data.journeys[second].arrive.time
                        }

                        departure_track = from_data.journeys[first].departure.track
                        arrive_track = to_data.journeys[second].arrive.track
                        departure_date = from_data.journeys[first].departure.date
                        arrive_date = to_data.journeys[second].arrive.date

                        let journey_container = document.createElement("div")
                        journey_container.className = "journey"

                        let train_number_container = document.createElement("div")
                        train_number_container.className = "train-number"
                        let train_number = document.createElement("h3")
                        train_number.innerText = `${from_data.journeys[first].type}${from_data.journeys[first].number} TO ${to_name}`
                        train_number_container.appendChild(train_number)
                        journey_container.appendChild(train_number_container)

                        let information_container = document.createElement("div")
                        information_container.className = "information"
                        journey_container.appendChild(information_container)

                        let departure_container = document.createElement("div")
                        departure_container.className = "departure"
                        let departure_information = document.createElement("p")
                        departure_information.innerText = `Leave: 20${departure_date.charAt(0)}${departure_date.charAt(1)}.${departure_date.charAt(2)}${departure_date.charAt(3)}.${departure_date.charAt(4)}${departure_date.charAt(5)} | ${departure_time.charAt(0)}${departure_time.charAt(1)}:${departure_time.charAt(2)}${departure_time.charAt(3)} | Track ${departure_track}`
                        departure_container.appendChild(departure_information)
                        information_container.appendChild(departure_container)

                        let arrive_container = document.createElement("div")
                        arrive_container.className = "arrive"
                        let arrive_information = document.createElement("p")
                        arrive_information.innerText = `Arrive: 20${arrive_date.charAt(0)}${arrive_date.charAt(1)}.${arrive_date.charAt(2)}${arrive_date.charAt(3)}.${arrive_date.charAt(4)}${arrive_date.charAt(5)} | ${arrive_time.charAt(0)}${arrive_time.charAt(1)}:${arrive_time.charAt(2)}${arrive_time.charAt(3)} | Track ${arrive_track}`
                        arrive_container.appendChild(arrive_information)
                        information_container.appendChild(arrive_container)

                        content_container.appendChild(journey_container)
                    }
                }
            }
        }
    }
}

var typingTimer;
/**
 * @param {Event} event event
 */
async function textChanged(event) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(async () => {
        if (event.target.value != "" && event.target.value.length > 1) {
            let response = await fetch(`/get_station/${event.target.value}`)
            if (response.ok) {
                let json = await response.json();
                if (event.target.id == "from") {
                    if (json.name != undefined) {
                        from_hint.innerText = json.name;
                        from_eva = json.eva;
                        from_name = json.name;
                    } else {
                        from_hint.innerText = "Not found"
                    }
                } else {
                    if (json.name != undefined) {
                        to_hint.innerText = json.name;
                        to_eva = json.eva;
                        to_name = json.name;
                    }
                    else {
                        to_hint.innerText = "Not found"
                    }
                }
            }
        }
    }, 250);
}
