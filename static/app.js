from_hint = document.getElementById("from-hint");
to_hint = document.getElementById("to-hint");


function searchButtonClick() {
    console.log("hello");
}

var typingTimer;
/**
 * @param {Event} event event
 */
async function textChanged(event) {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(async () => {
        if (event.target.value != "" && event.target.value.length > 1) {
            let response = await fetch("/get_station/" + event.target.value)
            if (response.ok) {
                let json = await response.json();
                if (event.target.id == "from") {
                    if (json.name != undefined) {
                        from_hint.innerText = json.name;
                    } else {
                        from_hint.innerText = "Not found"
                    }
                } else {
                    if (json.name != undefined) {
                        to_hint.innerText = json.name;
                    }
                    else {
                        to_hint.innerText = "Not found"
                    }
                }
                console.log(json.name)
            }
        }
    }, 250);
}