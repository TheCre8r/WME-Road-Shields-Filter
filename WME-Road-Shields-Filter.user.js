// ==UserScript==
// @name         WME Road Shield Filter
// @namespace    https://github.com/thecre8r/
// @version      2021.05.12.01
// @description  Observes for the modal
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @author       The_Cre8r
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3


// ==/UserScript==

/* global $ */
/* global W */
/* global WazeWrap */


(function() {


    function abbrState(input, to){
        var states = [['Arizona', 'AZ'],['Alabama', 'AL'],['Alaska', 'AK'],['Arkansas', 'AR'],['California', 'CA'],['Colorado', 'CO'],['Connecticut', 'CT'],['Delaware', 'DE'],['Florida', 'FL'],['Georgia', 'GA'],['Hawaii', 'HI'],['Idaho', 'ID'],['Illinois', 'IL'],['Indiana', 'IN'],['Iowa', 'IA'],['Kansas', 'KS'],['Kentucky', 'KY'],['Louisiana', 'LA'],['Maine', 'ME'],['Maryland', 'MD'],['Massachusetts', 'MA'],['Michigan', 'MI'],['Minnesota', 'MN'],['Mississippi', 'MS'],['Missouri', 'MO'],['Montana', 'MT'],['Nebraska', 'NE'],['Nevada', 'NV'],['New Hampshire', 'NH'],['New Jersey', 'NJ'],['New Mexico', 'NM'],['New York', 'NY'],['North Carolina', 'NC'],['North Dakota', 'ND'],['Ohio', 'OH'],['Oklahoma', 'OK'],['Oregon', 'OR'],['Pennsylvania', 'PA'],['Rhode Island', 'RI'],['South Carolina', 'SC'],['South Dakota', 'SD'],['Tennessee', 'TN'],['Texas', 'TX'],['Utah', 'UT'],['Vermont', 'VT'],['Virginia', 'VA'],['Washington', 'WA'],['West Virginia', 'WV'],['Wisconsin', 'WI'],['Wyoming', 'WY'],];

        if (to == 'abbr'){
            input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            for(let i = 0; i < states.length; i++){
                if(states[i][0] == input){
                    return(states[i][1]);
                }
            }
        } else if (to == 'name'){
            input = input.toUpperCase();
            for(let i = 0; i < states.length; i++){
                if(states[i][1] == input){
                    return(states[i][0]);
                }
            }
        }
    }

    function RegexMatch() {
        let htmlstring = `<div style="position:absolute;top: 14px;right: 14px;font-size:20px;" id="WMERSFRM"><wz-button class="hydrated">Regex Match</wz-button></div>`
        document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content").insertAdjacentHTML('afterend',htmlstring)
        document.querySelector("#WMERSFRM").onclick = function(){
            let streetname = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-header > div.street-name").innerText
            console.log(streetname)
            let regex = /(?:(H|I|(?:[A-Z]\w)(?=\-))-(\d+(?:[A-Z])?(?:-\d+)?))?(?: (BUS|ALT|BYP|CONN|SPUR|TRUCK))?(?: (N|E|S|W))?/;
            let match = streetname.match(regex);

            console.log(match)

            if (document.querySelector("#WMERSF-Error")) {
                document.querySelector("#WMERSF-Error").remove()
            }
            function CreateError(text){
                //add a logic to make the screen red or something for stuff like NC-102 BYP and alert that that shield is not available
                let errorhtmlString = `<div style="position:absolute;top: 332px;left: 24px;font-size: 14px;color:red;" id="WMERSF-Error"><span>` + text + `</span></div>`;
                document.querySelector("#WMERSFRM").insertAdjacentHTML('afterend',errorhtmlString)

            }
            if (streetname.match(/(?=Rd)\w+|(?=St)\w+|(?=Ave)\w+|(?=Dr)\w+|(?=Old)\w+/)) {
                document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.remove-road-shield.hydrated").click()
                CreateError("Error: Road does not need a shield");
                return;
            } else if (streetname != match[0]) {
                CreateError("Potential Error: Please Review");
            }
            //console.log(match[1])
            function MakeStateShield(match,stateoverride){
                console.log("State");
                let State;
                if (stateoverride) {
                    State = stateoverride;
                } else {
                    State = abbrState(match[1], 'name')
                }

                if (document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="` + State + ` - State Main"]`) && match[3] == undefined) {
                    console.log(match[1]);
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="` + State + ` - State Main"]`).click()
                } else if (document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="` + State + ` - State ` + match[3] + `"]`)) {
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="` + State + ` - State ` + match[3] + `"]`).click()
                } else if (document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="` + State + ` - State Main"]`) && match[3] !== undefined) {
                    CreateError("Error: " + State +" - State " + match[3] + " Road Shield is not available" );
                    console.log(match[1]);
                    console.log(match[3]);
                    return;
                } else {
                    console.log("Primary Identifier Not Found");
                    return;
                    //document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`)
                }
            }
            switch (match[1] ) {
                case "H":
                case "I":
                    console.log("Interstate");
                    switch (match[3] ) {
                        case "BUS":
                            console.log("Business");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="I-# BUS"]`).click()
                            break;
                        default:
                            console.log("Main");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Interstate Main"]`).click()
                            break;
                    }
                    break;
                case "SR":
                    if (getState() == "Pennsylvania") {
                        MakeStateShield(match,"Pennsylvania");
                    } else if (match[3] == undefined) {
                        console.log(match[1]);
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`).click()
                    } else if (match[3] !== undefined) {
                        CreateError("Error: SR " + match[3] + " Road Shield is not available" );
                        console.log(match[1]);
                        console.log(match[3]);
                        return;
                    } else {
                        CreateError("Error: SR " + match[3] + " Road Shield is not available" );
                        console.log(match[1]);
                        console.log(match[3]);
                        return;
                        //document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`)
                    }
                    break;
                case "US":
                    console.log("US");
                    if (match[3] == undefined) {
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]`).click()
                    } else if (document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ` + match[3] + `"]`)) {
                        console.log(match[3]);
                        document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ` + match[3] + `"]`).click()
                    } else {
                        CreateError("Error: US-# " + match[3] + " Road Shield is not available or does not parse" );
                        return;
                    }
                    break;
                default:
                    MakeStateShield(match)
                    break;
            }
            if (match[2]) {
                if (match[1] == "H") {
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(2) > wz-text-input").value = match[1]+'-'+match[2]
                } else {
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(2) > wz-text-input").value = match[2]
                }
            }
            switch (match[4] ) {
                case "N":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").value = "North"
                    break;
                case "E":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").value = "East"
                    break;
                case "S":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").value = "South"
                    break;
                case "W":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").value = "West"
                    break;
                default:
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").value = ""
                    break;
            }
            document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.apply-button.hydrated").disabled = false
        };
    }
    function filterShields() {
        let country = W.model.getTopCountry().name
        let state = getState()
        if (country == "Canada" || country == "United States") {
            console.log("WME Road Shield Filter Filtered " + state)
            for(var j = 1; j <= document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu").childElementCount; j++){
                let lineitem = document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > wz-menu-item:nth-child(`+j+`)`)
                let iTxt = lineitem.innerText // the string to check against

                let SearchStrings = ['Interstate Main','US Hwy','SR generic','CR generic','I-','US-','BIA','FSR','National',state]
                let length = SearchStrings.length;
                lineitem.hidden = true;
                while(length--) {
                    if (iTxt.indexOf(SearchStrings[length])!=-1) {
                        console.log(iTxt.indexOf(SearchStrings[length]))
                        console.log("WME Road Shield Filter Should Keep:" + iTxt)
                        if (state == "Virginia" && iTxt.includes("West Virginia")) {
                            //skip
                        }
                        else {
                            lineitem.hidden = false;
                        }
                    }
                }

            }
        }
    }
    function letsWatch() {
        let observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    let addedNode = mutation.addedNodes[i];
                    // Only fire up if it's a node
                    //log("Observer Running "+ $(addedNode).attr('class'));
                    if (document.querySelector("#wz-dialog-container > div > wz-dialog") && document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu")) {
                        console.log("WME Road Shield Filter Ran")
                        RegexMatch()
                        filterShields()
                    }
                }
            });
        });
        observer.observe(document.getElementById('wz-dialog-container'), { childList: true });
    }
    function getState() {
        if (W.selectionManager.getSelectedFeatures().length > 0) {
            let pStID = W.selectionManager._getSelectedSegments()[0].attributes.primaryStreetID;
            return WazeWrap.Model.getStateName(pStID);
        }
    }

    function bootstrap(tries = 1) {
        //log("bootstrap attempt "+ tries);
        if (W && W.map && W.model && WazeWrap.Ready) {
            letsWatch();
        } else if (tries < 1000) {
            setTimeout(() => bootstrap(tries++), 200);
        }
    }
    bootstrap()
})();
