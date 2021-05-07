// ==UserScript==
// @name         WME Road Shield Filter
// @namespace    https://github.com/thecre8r/
// @version      2021.05.06.01
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
/* global getState */


(function() {

    var getState;

    function GetAbbreviation(state){

        if (!state) {
            return;
        }
        switch (state.toUpperCase())
        {
            case "ALABAMA":
                return "AL";
            case "ALASKA":
                return "AK";
            case "AMERICAN SAMOA":
                return "AS";
            case "ARIZONA":
                return "AZ";
            case "ARKANSAS":
                return "AR";
            case "CALIFORNIA":
                return "CA";
            case "COLORADO":
                return "CO";
            case "CONNECTICUT":
                return "CT";
            case "DELAWARE":
                return "DE";
            case "DISTRICT OF COLUMBIA":
                return "DC";
            case "FEDERATED STATES OF MICRONESIA":
                return "FM";
            case "FLORIDA":
                return "FL";
            case "GEORGIA":
                return "GA";
            case "GUAM":
                return "GU";
            case "HAWAII":
                return "HI";
            case "IDAHO":
                return "ID";
            case "ILLINOIS":
                return "IL";
            case "INDIANA":
                return "IN";
            case "IOWA":
                return "IA";
            case "KANSAS":
                return "KS";
            case "KENTUCKY":
                return "KY";
            case "LOUISIANA":
                return "LA";
            case "MAINE":
                return "ME";
            case "MARSHALL ISLANDS":
                return "MH";
            case "MARYLAND":
                return "MD";
            case "MASSACHUSETTS":
                return "MA";
            case "MICHIGAN":
                return "MI";
            case "MINNESOTA":
                return "MN";
            case "MISSISSIPPI":
                return "MS";
            case "MISSOURI":
                return "MO";
            case "MONTANA":
                return "MT";
            case "NEBRASKA":
                return "NE";
            case "NEVADA":
                return "NV";
            case "NEW HAMPSHIRE":
                return "NH";
            case "NEW JERSEY":
                return "NJ";
            case "NEW MEXICO":
                return "NM";
            case "NEW YORK":
                return "NY";
            case "NORTH CAROLINA":
                return "NC";
            case "NORTH DAKOTA":
                return "ND";
            case "NORTHERN MARIANA ISLANDS":
                return "MP";
            case "OHIO":
                return "OH";
            case "OKLAHOMA":
                return "OK";
            case "OREGON":
                return "OR";
            case "PALAU":
                return "PW";
            case "PENNSYLVANIA":
                return "PA";
            case "PUERTO RICO":
                return "PR";
            case "RHODE ISLAND":
                return "RI";
            case "SOUTH CAROLINA":
                return "SC";
            case "SOUTH DAKOTA":
                return "SD";
            case "TENNESSEE":
                return "TN";
            case "TEXAS":
                return "TX";
            case "UTAH":
                return "UT";
            case "VERMONT":
                return "VT";
            case "VIRGIN ISLANDS":
                return "VI";
            case "VIRGINIA":
                return "VA";
            case "WASHINGTON":
                return "WA";
            case "WEST VIRGINIA":
                return "WV";
            case "WISCONSIN":
                return "WI";
            case "WYOMING":
                return "WY";
        }
    }

    function RegexMatch() {
        let htmlstring = `<div style="position:absolute;top: 14px;right: 14px;font-size:20px;color:red;" id="WMERSFRM"><wz-button class="hydrated">Regex Match</wz-button></div>`
        document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content").insertAdjacentHTML('afterend',htmlstring)
        document.querySelector("#WMERSFRM").onclick = function(){
            let streetname = document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-header > div.street-name").innerText
            //alert(streetname)
            console.log(streetname)
            //let streetname = 'US-421 S BYP';
            //let streetname = 'US-421 S';
            let regex = /(?:(I|(?:[A-Z]\w)(?=\-))-(\d+)) ?(BUS|ALT|BYP|CONN|SPUR|TRUCK)? ?(N|E|S|W)?/;
            let match = streetname.match(regex);

            console.log(match)
            console.log(match[1])

            //add a logic to make the screen red or something for stuff like NC-102 BYP and alert that that shield is not available


            switch (match[1] ) {
                case "I":
                    console.log("Interstate");
                    switch (match[3] ) {
                        case "BUS":
                            console.log("Business");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="I-# BUS]`).click()
                            break;
                        default:
                            console.log("Main");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="Interstate Main"]`).click()
                            break;
                    }
                    break;
                case "US":
                    console.log("US");
                    switch (match[3]) {
                        case "BUS":
                            console.log("Business");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# BUS"]`).click()
                            break;
                        case "BYP"://(BUS|ALT|BYP|CONN|SPUR|TRUCK)
                            console.log("By-Pass");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# BYP"]`).click()
                            break;
                        case "ALT":
                            console.log("Alternate");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US-# ALT"]`).click()
                            break;
                        default:
                            console.log("Main");
                            document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="US Hwy Main"]`).click()
                            break;
                    }
                    break;
                case "NC":
                    console.log("NC");
                    document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="North Carolina - State Main"]`).click()
                    break;
                default:
                    console.log("Primary Identifier Not Found");
                    //document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`)
                    break;
            }
            if (match[2]) {
                document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(2) > wz-text-input").shadowRoot.querySelector("#id").value = match[2]
            }
            switch (match[4] ) {
                case "N":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").shadowRoot.querySelector("#id").value = "North"
                    break;
                case "E":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").shadowRoot.querySelector("#id").value = "East"
                    break;
                case "S":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").shadowRoot.querySelector("#id").value = "South"
                    break;
                case "W":
                    document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(3) > wz-text-input").shadowRoot.querySelector("#id").value = "West"
                    break;
                default:
                    console.log("Primary Identifier Not Found");
                    //document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > [title="SR generic Main"]`)
                    break;
            }
            document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-controls > wz-button.apply-button.hydrated").disabled = false
        };
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
                        let country = W.model.getTopCountry().name
                        let state = getState
                        if (country == "United States") {
                            console.log("WME Road Shield Filter Filtered " + state)
                            for(var j = 1; j <= document.querySelector("#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu").childElementCount; j++){
                                let lineitem = document.querySelector(`#wz-dialog-container > div > wz-dialog > wz-dialog-content > div:nth-child(1) > wz-menu > wz-menu-item:nth-child(`+j+`)`)
                                let iTxt = lineitem.innerText // the string to check against

                                let SearchStrings = ['Interstate Main','US Hwy','SR generic','CR generic','I-','US-','BIA','FSR',state]
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
                }
            });
        });
        observer.observe(document.getElementById('wz-dialog-container'), { childList: true });
    }
    function gettingState() {
        if (W.selectionManager.getSelectedFeatures().length > 0) {
        let pStID = W.selectionManager._getSelectedSegments()[0].attributes.primaryStreetID;
        getState = WazeWrap.Model.getStateName(pStID);
        console.log("test");
    }
    }

    function bootstrap(tries = 1) {
        //log("bootstrap attempt "+ tries);
        if (W && W.map && W.model && WazeWrap.Ready) {
            WazeWrap.Events.register("selectionchanged", null, gettingState);
            letsWatch();
         } else if (tries < 1000) {
            setTimeout(() => bootstrap(tries++), 200);
        }
    }
    bootstrap()
})();
