// ==UserScript==
// @name         WME Road Shield Filter
// @namespace    https://github.com/thecre8r/
// @version      2021.05.17.01
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
/* global I18n */


(function() {
    const STORE_NAME = "WMERSF_Settings";
    const SCRIPT_NAME = GM_info.script.name;
    const SCRIPT_VERSION = GM_info.script.version.toString();
    const SCRIPT_CHANGES = `Here we go again...`
    const UPDATE_ALERT = true;

    let _settings = {};

    let svglogo = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" width="13" height="13" viewBox="0 0 384 384" overflow="visible" enable-background="new 0 0 13384" xml:space="preserve" style="vertical-align: middle;"><path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M303.8720703,28.0273438l50.3662109,52.1557617    C339.7480469,97.5253906,331,119.8857422,331,144.2758789c0,20.8432617,6.4052734,40.2626953,17.3476563,56.3041992    C357.5654297,214.0683594,363,230.4316406,363,248c0,46.2294922-37.3447266,83.7363281-83.5097656,83.9990234    C247.1210938,332.0214844,217.1582031,341.6162109,192,358.0605469c-25.1884766-16.4648438-55.1953125-26.0625-87.609375-26.0625    C58.2797852,331.6728516,21,294.1904297,21,248c0-17.5673828,5.4345703-33.9316406,14.6523438-47.4199219    C46.5942383,184.5385742,53,165.1191406,53,144.2758789c0-24.390625-8.7480469-46.7504883-23.2382813-64.0927734    l50.3662109-52.1557617C96.0566406,37.9365234,114.8740234,43.6699219,135,43.6699219c21.0283203,0,40.6298828-6.2587891,57-17    c16.3701172,10.7412109,35.9716797,17,57,17C269.1259766,43.6699219,287.9433594,37.9365234,303.8720703,28.0273438z     M249,31.6699219c21.2548828,0,40.8378906-7.2177734,56.4121094-19.3222656l65.4033203,67.7265625    C353.7060547,96.1201172,343,118.9477539,343,144.2758789c0,18.3544922,5.6318359,35.425293,15.2578125,49.5375977    C368.7890625,209.2226563,375,227.9277344,375,248c0,52.8339844-42.6796875,95.6992188-95.4414063,95.9980469    c-32.8427734,0.0117188-62.9824219,10.65625-87.5585938,28.6523438    c-24.5898438-18.0048828-54.7475586-28.6523438-87.609375-28.6523438C51.6513672,343.671875,9,300.8164063,9,248    c0-20.0722656,6.2109375-38.7773438,16.7421875-54.1865234C35.3681641,179.7011719,41,162.6303711,41,144.2758789    c0-25.328125-10.706543-48.1557617-27.8154297-64.2016602l65.4033203-67.7265625    C94.1621094,24.4521484,113.7451172,31.6699219,135,31.6699219c21.5219727,0,41.3310547-7.3989258,57-19.7802734    C207.6689453,24.2709961,227.4775391,31.6699219,249,31.6699219z"></path></svg>`

    function log(msg) {
        console.log('WME RSF: ', msg);
    }
    function initializei18n() {
        log("i18n Initialized")
        var translations = {
            en: {
                tab_title: `${SCRIPT_NAME}`,
                report_an_issue: 'Report an Issue on GitHub',
                help: 'Help',
                filter_by_state: `Filter Shields By State`
            },
            es: {
                tab_title: `${SCRIPT_NAME}`,
                report_an_issue: 'Reportar Un Problema En GitHub',
                help: 'Ayuda',
                filter_by_state: `Filtros de Escudos Por Estado`
            }
        };
        translations['en-GB'] = translations['en-US'] = translations['en-AU'] = translations.en;
        translations['es-419'] = translations.es;
        I18n.translations[I18n.currentLocale()].wmersf = translations.en;
        log(I18n.currentLocale())
        Object.keys(translations).forEach(function(locale) {
            if (I18n.currentLocale() == locale) {
                addFallbacks(translations[locale], translations.en);
                I18n.translations[locale].wmersf = translations[locale];
            }
        });
        function addFallbacks(localeStrings, fallbackStrings) {
            Object.keys(fallbackStrings).forEach(function(key) {
                if (!localeStrings[key]) {
                    localeStrings[key] = fallbackStrings[key];
                } else if (typeof localeStrings[key] === 'object') {
                    addFallbacks(localeStrings[key], fallbackStrings[key]);
                }
            });
        }
    }
    function abbrState(input, to){
        var states = [['Arizona', 'AZ'],['Alabama', 'AL'],['Alaska', 'AK'],['Arkansas', 'AR'],['California', 'CA'],['Colorado', 'CO'],['Connecticut', 'CT'],['Delaware', 'DE'],['District of Columbia','DC'],['Florida', 'FL'],['Georgia', 'GA'],['Hawaii', 'HI'],['Idaho', 'ID'],['Illinois', 'IL'],['Indiana', 'IN'],['Iowa', 'IA'],['Kansas', 'KS'],['Kentucky', 'KY'],['Louisiana', 'LA'],['Maine', 'ME'],['Maryland', 'MD'],['Massachusetts', 'MA'],['Michigan', 'MI'],['Minnesota', 'MN'],['Mississippi', 'MS'],['Missouri', 'MO'],['Montana', 'MT'],['Nebraska', 'NE'],['Nevada', 'NV'],['New Hampshire', 'NH'],['New Jersey', 'NJ'],['New Mexico', 'NM'],['New York', 'NY'],['North Carolina', 'NC'],['North Dakota', 'ND'],['Ohio', 'OH'],['Oklahoma', 'OK'],['Oregon', 'OR'],['Pennsylvania', 'PA'],['Rhode Island', 'RI'],['South Carolina', 'SC'],['South Dakota', 'SD'],['Tennessee', 'TN'],['Texas', 'TX'],['Utah', 'UT'],['Vermont', 'VT'],['Virginia', 'VA'],['Washington', 'WA'],['West Virginia', 'WV'],['Wisconsin', 'WI'],['Wyoming', 'WY'],];

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
            let SRStates = ['Pennsylvania', 'Illinois', 'Alabama', 'Washington'];
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
            if (streetname.match(/(?=to)\w+|(?=Rd)\w+|(?=St)\w+|(?=Ave)\w+|(?=Dr)\w+|(?=Old)\w+/)) {
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
                case "SH":
                    if (getState() == "Texas") {
                        MakeStateShield(match,getState());
                    }
                    break;
                case "SR":
                    if (SRStates.indexOf(getState())>= 0) {
                        MakeStateShield(match,getState());
                    } else if (getState() == "North Carolina") {
                        CreateError("Error: " + getState() + " does not use road shields for Secondary Routes")
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
            if (!document.querySelector(`#WMERSF-Error`)){
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
            }
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
                        if (_settings.FilterByState) {
                            filterShields()
                        }
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

    let TESTERS = ["The_Cre8r","jm6087","s18slider","locojd1","SethSpeedy28","nzahn1"];

    function setChecked(checkboxId, checked) {
        $('#WMERSF-' + checkboxId).prop('checked', checked);
        log('#WMERSF-' + checkboxId + " is " + checked);
    }

    function initTab() {
        let $section = $("<div>");
        $section.html([
            '<div>',
                '<div id="WMERSF-header">',
                    `<span id="WMERSF-title">${I18n.t(`wmersf.tab_title`)}</span>`,
                    `<span id="WMERSF-version">${SCRIPT_VERSION}</span>`,
                '</div>',
                '<form class="attributes-form side-panel-section">',
                    '<div class="form-group">',
                        '<div class="controls-container">',
                            `<input type="checkbox" id="WMERSF-FilterByState" value="on"><label for="WMERSF-FilterByState">${I18n.t(`wmersf.filter_by_state`)}</label>`,
                        '</div>',
                    '</div>',
                    '<div class="form-group">',
                        '<div class="WMERSF-report">',
                            '<i class="fa fa-github" style="font-size: 13px; padding-right:5px"></i>',
                            '<div style="display: inline-block;">',
                                `<a target="_blank" href="https://github.com/TheCre8r/WME-BackEnd-Data/issues/new" id="WMERSF-report-an-issue">${I18n.t(`wmersf.report_an_issue`)}</a>`,
                            '</div>',
                        '</div>',
                        `<div class="WMERSF-help" style="text-align: center;padding-top: 5px;">`,
                            `<i class="fa fa-question-circle-o" style="font-size: 13px; padding-right:5px"></i>`,
                            `<div style="display: inline-block;">`,
                                `<a target="_blank" href="https://github.com/TheCre8r/WME-BackEnd-Data/wiki" id="WMERSF-help-link">${I18n.t(`wmersf.help`)}</a>`,
                            `</div>`,
                        `</div>`,
                    '</div>',
                '</form>',
            '</div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('WMERSF', $section.html(), function(){log("Tab Loaded")});
        $('a[href$="#sidepanel-wmersf"]').html(`<span>`+svglogo+`</span>`)
        $('a[href$="#sidepanel-wmersf"]').prop('title', 'WME RSF');

        log("Tab Initialized");
    }
    function injectCss() {
        let css = [
            // formatting
            '#sidepanel-wmersf > div > form > div > div > label {white-space:normal}',
            '#WMERSF-header {margin-bottom:10px;}',
            '#WMERSF-title {font-size:15px;font-weight:600;}',
            '#WMERSF-version {font-size:11px;margin-left:10px;color:#aaa;}',
            '.WMERSF-report {text-align:center;padding-top:20px;}',
            '.WMERSF-Button {font-family:"Rubik","Boing-light",sans-serif,FontAwesome;padding-left:10px;padding-right:10px;margin-top:0px;z-index: 3;}',
            '.fa, .fas{font-family:"FontAwesome"}',
            '.fab{font-family:"Font Awesome 5 Brands"}',
            '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:400;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-regular-400.svg#fontawesome) format("svg")}',
            '.far{font-weight:400}',
            '@font-face{font-family:"Font Awesome 5 Free";font-style:normal;font-weight:900;src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot);src:url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.eot?#iefix) format("embedded-opentype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff2) format("woff2"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.woff) format("woff"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.ttf) format("truetype"),url(https://use.fontawesome.com/releases/v5.6.1/webfonts/fa-solid-900.svg#fontawesome) format("svg")}',
            '.far,.fas{font-family:"Font Awesome 5 Free"}',
            '.fas{font-weight:900}',
        ].join(' ');
        $('<style type="text/css" id="wmebed-style">' + css + '</style>').appendTo('head');
        $('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/regular.css" integrity="sha384-APzfePYec2VC7jyJSpgbPrqGZ365g49SgeW+7abV1GaUnDwW7dQIYFc+EuAuIx0c" crossorigin="anonymous">').appendTo('head');
        $('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/brands.css" integrity="sha384-/feuykTegPRR7MxelAQ+2VUMibQwKyO6okSsWiblZAJhUSTF9QAVR0QLk6YwNURa" crossorigin="anonymous">').appendTo('head');
        $('<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.1/css/fontawesome.css" integrity="sha384-ijEtygNrZDKunAWYDdV3wAZWvTHSrGhdUfImfngIba35nhQ03lSNgfTJAKaGFjk2" crossorigin="anonymous">').appendTo('head');
        log("CSS Injected");
    }
    /*-- START SETTINGS --*/
    function loadSettings() {
        let loadedSettings = $.parseJSON(localStorage.getItem(STORE_NAME));
        let defaultSettings = {
            FilterByState: true,
            Debug: false,
            lastVersion: 0
        };
        _settings = loadedSettings ? loadedSettings : defaultSettings;
        for (let prop in defaultSettings) {
            if (!_settings.hasOwnProperty(prop)) {
                _settings[prop] = defaultSettings[prop];
            }
        }
        log("Settings Loaded");
    }

    function saveSettings() {
        if (localStorage) {
            _settings.lastVersion = SCRIPT_VERSION;
            localStorage.setItem(STORE_NAME, JSON.stringify(_settings));
            log('Settings Saved '+ JSON.stringify(_settings));
        }
    }

    function initializeSettings() {
        loadSettings();
        if (UPDATE_ALERT == true){
            WazeWrap.Interface.ShowScriptUpdate(SCRIPT_NAME, SCRIPT_VERSION, SCRIPT_CHANGES,`"</a><a target="_blank" href='https://github.com/TheCre8r/WME-Road-Shields-Filter'>GitHub</a><a style="display:none;" href="`, "#");
        }
        setChecked('Debug', _settings.Debug);
        setChecked('FilterByState', _settings.FilterByState);
        $('#WMERSF-Debug').change(function() {
            let settingName = "Debug";
            _settings[settingName] = this.checked;
            saveSettings();
            log(settingName + ' Checkbox');
            log(_settings[settingName]);
        });
        $('#WMERSF-FilterByState').change(function() {
            let settingName = "FilterByState";
            _settings[settingName] = this.checked;
            saveSettings();
            log(settingName + ' Checkbox');
            log(_settings[settingName]);
        });
        log("Settings Initialized");
    }

    /*-- END SETTINGS --*/

    function bootstrap(tries = 1) {
        //log("bootstrap attempt "+ tries);
        if (W && W.map && W.model && WazeWrap.Ready) {
            initializei18n();
            injectCss();
            initTab();
            initializeSettings();
            letsWatch();
        } else if (tries < 1000) {
            setTimeout(() => bootstrap(tries++), 200);
        }
    }
    bootstrap()
})();
