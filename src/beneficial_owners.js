import jquery from 'jquery';
window.jQuery = jquery;
window.$ = jquery;
require( 'datatables.net' )( window, $ )
require( 'datatables.net-dt' )( window, $ )

import underscore from 'underscore';
window.underscore = underscore;
window._ = underscore;

import '../public/vendor/js/popper.min.js'
import '../public/vendor/js/bootstrap.min.js'
import { csv } from 'd3-request'
import { json } from 'd3-request'

import '../public/vendor/css/bootstrap.min.css'
import '../public/vendor/css/dc.css'
import '/scss/main.scss';

import Vue from 'vue';
import Loader from './components/Loader.vue';
import ChartHeader from './components/ChartHeader.vue';

var d3CustomLocale = {
  "decimal": ",",
  "thousands": " ",
  "grouping": [3],
  "currency": ["$", ""],
  "dateTime": "%a %b %e %X %Y",
  "date": "%m/%d/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  "shortDays": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
}
d3.formatDefaultLocale(d3CustomLocale);

// Data object - is also used by Vue

var vuedata = {
  page: 'owners',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  charts: {
    topOwners: {
      title: 'A legtöbb közbeszerzést elnyerő végső tulajdonosok, 2018-2020',
      info: 'A legtöbb közbeszerzést elnyerő végső tulajdonosok a 2021-ben tulajdonolt, vizsgált érdekeltségeik által összesen, 2018. január 01. és 2020. december 31. között elnyert közbeszerzések értéke szerint rangsorolva. A konzorciumban elnyert eljárások értéke a tagok számával egyenlő arányban osztva szerepel, mivel pontos összeg nem áll rendelkezésre. A felületen azon cégek végső tulajdonosai szerepelnek, akiknek a személye ismert a nyilvánosan hozzáférhető céginformációs adatokból. Az ábrán azon tulajdonosok szerepelnek névvel, akik a vizsgált cégek többségében legalább 25%-os részesedéssel rendelkeznek. A kritériumnak nem megfelelő tulajdonosok név nélkül, sorszámmal szerepelnek adatvédelmi okok miatt.',
      filter: 'total_amount_won_2018_2020'
    },
    politicalConnections: {
      title: 'Végső tulajdonosok száma a betöltött közhatalmi pozícióinak száma szerint',
      info: 'A vizsgált cégek végső tulajdonosainak száma a 2010. január 01. és 2022. szeptember 30.  között a betöltött közhatalmi pozíciók száma szerint. Vizsgálatunk során a kormánytagként ellátott, kormánybiztosi, államtitkári és helyettes államtitkári, parlamenti képviselői, a közérdekű vagyonkezelő alapítványok élén, illetve állami cégek vezetőjeként vagy megyei jogú városok polgármesterek, jegyzőjeként vállalt mandátumokat vettük figyelembe. A legalább egy közhatalmi pozíciót betöltő végső tulajdonosok esetében figyelmeztető jelzés szerepel. Ezt a jelzést különösen azért tartjuk fontosnak, mert közhatalmai pozíciója vagy az azon keresztül létesített direkt kapcsolatai révén az adott vállalkozás tulajdonosa előnyre tehet szert a tekintetben, hogy a közbeszerzési eljárások során kedvező elbírálás alá essenek ajánlatai.'
    },
    amountWonPoliticalConnection: {
      title: 'Az elnyert közbeszezések összesített értéke közhatalmi pozíciók szerint, 2018-2020 (Ft)',
      info: 'Az összes vizsgált végső tulajdonos érdekeltségei által, 2018. január 1. és 2020. december 31. között elnyert közbeszerzések összesített értéke a végső tulajdonos által betöltött közhatalmi pozíció szerint. Vizsgálatunk során a kormánytagként ellátott, kormánybiztosi, államtitkári és helyettes államtitkári, parlamenti képviselői, a közérdekű vagyonkezelő alapítványok élén, illetve állami cégek vezetőjeként vagy megyei jogú városok polgármesterek, jegyzőjeként a 2010. január 01. és 2022. szeptember 30. között vállalt mandátumokat vettük figyelembe. A konzorciumban elnyert eljárások értéke a tagok számával egyenlő arányban osztva szerepel, mivel pontos összeg nem áll rendelkezésre.'
    },
    amountWon: {
      title: 'Végső tulajdonosok száma az összes érdekeltségük által elnyert közbeszerzések értéke szerint',
      info: 'Végső tulajdonosok száma a 2021-ben tulajdonolt, vizsgált érdekeltségeik által összesen, 2018. január 01. és 2020. december 31. között elnyert közbeszerzések értéke szerint rangsorolva. A konzorciumban elnyert eljárások értéke a tagok számával egyenlő arányban osztva szerepel, mivel pontos összeg nem áll rendelkezésre. Figyelmeztető jelzés szerepel azoknál a végső tulajdonosoknál, ahol az az összes tulajdonolt cég által elnyert közbeszerzések értéke legalább 5 milliárd forintot ért el, és a vizsgált cégek többségében legalább 25%-os részesedéssel rendelkeznek. Ez a mutató a piaci koncentrációra világít rá, vagyis hogy kik azok a végső tulajdonosok, akik cégeiken keresztül a legmagasabb értékben nyertek el közbeszerzéseket.',
      filter: 'amount_won_category'
    },
    percentageTenders: {
      title: 'Végső tulajdonosok száma a cégeik által elnyert eljárások összes értékének aránya szerint, 2018-2020 (%)',
      info: 'Végső tulajdonosok száma a 2021-ben tulajdonolt, vizsgált érdekeltségeik által összesen, 2018. január 01. és 2020. december 31. között elnyert közbeszerzések értékének aránya szerint rangsorolva az összes vizsgált eljárás értékéhez viszonyítva. A konzorciumban elnyert eljárások értéke a tagok számával egyenlő arányban osztva szerepel, mivel pontos összeg nem áll rendelkezésre.'
    },
    pressMentions: {
      title: 'Végső tulajdonosok száma a közpénzekkel kapcsolatos cikkekben való megjelenések száma szerint (db)',
      info: 'A tulajdonosok korábbi közpénzhasználati gyakorlatát övező visszásságok jelentős részére hagyományos módon a sajtóból derül fény, ezért is alkalmaztuk kiegészítő jelzésként, hogy a vizsgált cégek végső tulajdonosai megjelennek-e és ha igen, hányszor fordulnak elő a K-Monitor (https://adatbazis.k-monitor.hu/index.html) közpénzfelhasználásról és átláthatóságról szóló sajtóadatbázisában. Adatbázisunkban a lekérdezés idején (2022.12.05.)  2010 után megjelent cikkekben legalább 2 találattal rendelkező személyeket jelöltük figyelmeztető jelzéssel.'
    },
    flags: {
      title: 'Végős tulajdonosok száma a red flagek megoszlása szerint',
      info: 'Összesítés az aloldalon megjelenő figyelmeztető jelzések alapján. A jelzések egy-egy mutató kirívó értékére hívják fel a figyelmet. Összességében, a jelzések potenciális veszélyforrásokat jelölnek, melyek magyarázatát az egyes mutatók leírásában fejtjük ki, de önmagukban nem jelentenek bizonyítékot bűncselekményre, korrupcióra vagy más visszaélésre. Bővebb információ  az egyes grafikonoknál és a Mi ez? menüpontban olvasható.'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Végső tulajdonosok',
      info: 'A kiválasztott végső tulajdonosokkal kapcsolatos főbb mutatók beleértve az oldalon keletkező figyelmeztető jelzések számát. A tulajdonosok nevére kattintva további részletek érhetőek el az érdekeltségekről. A konzorciumban elnyert eljárások értéke a tagok számával egyenlő arányban osztva szerepel, mivel pontos összeg nem áll rendelkezésre. Adatvédelmi okok miatt névvel azokat a tulajdonosokat szerepeltetjük, akik (i) a vizsgált cégek többségében legalább 25%-os részesedéssel rendelkeznek, és cégeik összesen legalább  5 milliárd forint értékben nyertek el közbeszerzést a vizsgált időszakban; (ii) akik közhatalmi pozíciót töltenek/töltöttek be; (iii) akik legalább 2 említéssel szerepelnek a sajtóadatbázisban.'
    }
  },
  selectedOrg: {"Name": ""},
  flagsNames: {
    "has_political_connections": "Közhatalmi pozícióval bír(t)",
    "high_amount_won_and_share": "5 Mrd Ft felett az összesen elnyert közbeszerzések értéke és 25% feletti részesedés ",
    "high_press_mentions": "Több mint 2 említés a sajtóadatbázisban"
  },
  colors: {
    default: "#0aafec",
    range: ["#b2ddeb", "#6bdaff", "#25C3F7", "#0b8cd6", "#0061b5", "#004678"],
    range2: ["#6bdaff", "#25C3F7", "#0b8cd6", "#0061b5", "#004678"],
    range2Inverse: ["#004678", "#0061b5", "#0b8cd6", "#25C3F7", "#6bdaff"],
    //flag: "#fc8803",
    flag: "#fc3503",
    flagRange: ["#fc3503", "#fc4a03", "#fc6f03", "#fc8803"],
    grey: "#ddd",
    numPies: {
      "0": "#ddd",
      "1": "#ff516a",
      "2": "#f43461",
      "3": "#e51f5c",
      "4": "#d31a60",
      ">5": "#bb1d60"
    }
  }
}

//Set vue components and Vue app

Vue.component('chart-header', ChartHeader);
Vue.component('loader', Loader);

new Vue({
  el: '#app',
  data: vuedata,
  methods: {
    //Download filtered dataset
    downloadDataset: function () {
      var datatable = charts.table.chart;
      var filteredData = datatable.DataTable().rows( { filter : 'applied'} ).data();
      var entries = [['"Végső tulajdonos neve/sorszáma"','"Tulajdonolt cégek száma, 2021 (db)"','"Az összesen elnyert közbeszerzési eljárások értéke, 2018-2020 (Ft)"','"Közhatalmi pozíciók száma (db)"','"A közhatalmi pozíció megnevezése"','"Említések száma a sajtóban (db)"']];
      _.each(filteredData, function (d) {
        var csvName = d.bo_name;
        if(d.bo_name[0] == '#') { csvName = 'N/A' }
        var entry = [
          '"' + csvName + '"',
          d.companies.length,
          d.total_amount_won_2018_2020,
          d.public_auth_positions,
          '"' + d.pol_relationship_position_name + '"',
          d.k_monitor_match];
        entries.push(entry);
      });
      var csvContent = "data:text/csv;charset=utf-8,";
      entries.forEach(function(rowArray) {
        var row = rowArray.join(",");
        csvContent += row + "\r\n";
      });
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "IW_HU_beneficial_owners.csv");
      document.body.appendChild(link);
      link.click(); 
      return;
    },
    //Share
    share: function (platform) {
      if(platform == 'twitter'){
        var thisPage = window.location.href.split('?')[0];
        var shareText = 'Integrity Watch Hungary ' + thisPage;
        var shareURL = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText);
        window.open(shareURL, '_blank');
        return;
      }
      if(platform == 'facebook'){
        //var toShareUrl = window.location.href.split('?')[0];
        var toShareUrl = 'https://integritywatch.de';
        var shareURL = 'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(toShareUrl);
        window.open(shareURL, '_blank', 'toolbar=no,location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250,top=300,left=300');
        return;
      }
    },
    formatModalAmount: function(amt) {
      if(isNaN(amt)) {
        return amt;
      }
      //return 'Ft ' + addcommas(amt);
      return addcommas(amt);
    },
    shortenNumber(x) {
      if(isNaN(x)) {
        return x;
      }
      return (x/1000000).toFixed(0);
    }
  }
});

//Initialize info popovers
$(function () {
  $('[data-toggle="popover"]').popover()
})


//Charts
var charts = {
  topOwners: {
    chart: dc.rowChart("#topowners_chart"),
    type: 'row',
    divId: 'topowners_chart'
  },
  politicalConnections: {
    chart: dc.pieChart("#politicalconnections_chart"),
    type: 'pie',
    divId: 'politicalconnections_chart'
  },
  amountWonPoliticalConnection: {
    chart: dc.rowChart("#amountwonpoliticalconnection_chart"),
    type: 'row',
    divId: 'amountwonpoliticalconnection_chart'
  },
  amountWon: {
    chart: dc.rowChart("#amountwon_chart"),
    type: 'row',
    divId: 'amountwon_chart'
  },
  pressMentions: {
    chart: dc.pieChart("#pressmentions_chart"),
    type: 'pie',
    divId: 'pressmentions_chart'
  },
  percentageTenders: {
    chart: dc.pieChart("#percentagetenders_chart"),
    type: 'pie',
    divId: 'percentagetenders_chart'
  },
  /*
  companiesNum: {
    chart: dc.pieChart("#companiesnum_chart"),
    type: 'pie',
    divId: 'companiesnum_chart'
  },
  */
  flags: {
    chart: dc.rowChart("#flags_chart"),
    type: 'row',
    divId: 'flags_chart'
  },
  table: {
    chart: null,
    type: 'table',
    divId: 'dc-data-table'
  }
}

//Functions for responsivness
var recalcWidth = function(divId) {
  return document.getElementById(divId).offsetWidth - vuedata.chartMargin;
};
var recalcCharsLength = function(width) {
  return parseInt(width / 8);
};
var calcPieSize = function(divId) {
  var newWidth = recalcWidth(divId);
  var sizes = {
    'width': newWidth,
    'height': 0,
    'radius': 0,
    'innerRadius': 0,
    'cy': 0,
    'legendY': 0
  }
  if(newWidth < 300) { 
    sizes.height = newWidth + 170;
    sizes.radius = (newWidth)/2;
    sizes.innerRadius = (newWidth)/4;
    sizes.cy = (newWidth)/2;
    sizes.legendY = (newWidth) + 30;
  } else {
    sizes.height = newWidth*0.75 + 170;
    sizes.radius = (newWidth*0.75)/2;
    sizes.innerRadius = (newWidth*0.75)/4;
    sizes.cy = (newWidth*0.75)/2;
    sizes.legendY = (newWidth*0.75) + 30;
  }
  return sizes;
};
var resizeGraphs = function() {
  for (var c in charts) {
    var sizes = calcPieSize(charts[c].divId);
    var newWidth = recalcWidth(charts[c].divId);
    var charsLength = recalcCharsLength(newWidth);
    if(charts[c].type == 'row'){
      charts[c].chart.width(newWidth);
      charts[c].chart.label(function (d) {
        var thisKey = d.key;
        if(thisKey.indexOf('###') > -1){
          thisKey = thisKey.split('###')[0];
        }
        if(thisKey.length > charsLength){
          return thisKey.substring(0,charsLength) + '...';
        }
        return thisKey;
      })
      charts[c].chart.redraw();
    } else if(charts[c].type == 'bar') {
      charts[c].chart.width(newWidth);
      charts[c].chart.rescale();
      charts[c].chart.redraw();
    } else if(charts[c].type == 'pie') {
      charts[c].chart
        .width(sizes.width)
        .height(sizes.height)
        .cy(sizes.cy)
        .innerRadius(sizes.innerRadius)
        .radius(sizes.radius)
        .legend(dc.legend().x(0).y(sizes.legendY).gap(10));
      charts[c].chart.redraw();
    } else if(charts[c].type == 'cloud') {
      charts[c].chart.redraw();
    }
  }
};

//Shorten long numbers
function shortenNumber(x) {
  if(isNaN(x)) {
    return x;
  }
  return (x/1000000).toFixed(0);
}

//Add commas to decimal and dots to thousands
function addcommas(x){
  x = x.toString().replace(".",",");
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
  return x;
}
//Custom date order for dataTables
var dmy = d3.timeParse("%d/%m/%Y");
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-eu-pre": function (date) {
    if(date.indexOf("Cancelled") > -1){
      date = date.split(" ")[0];
    }
      return dmy(date);
  },
  "date-eu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-eu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Custom ordering for min and max
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "num-html-pre": function (a) {
    //var x = a.replace('€', '').replaceAll('Ft', '').replaceAll(',','').trim();
    var x = a.replace('€', '').replaceAll('Ft', '').replaceAll('.','').replaceAll(' ','').replaceAll(',','.').trim();
    if(x == '') {
      return 0;
    }
    return parseFloat(x);
  },
  "num-html-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "num-html-desc": function (a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Custom ordering for flag images
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "flags-pre": function (a) {
    var flagsCount = a.split('.png').length - 1;
    return parseFloat(flagsCount);
  },
  "flags-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "flags-desc": function (a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

//Custom ordering for date
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "date-custom-pre": function (a) {
    var dateParts = a.split('/');
    if(dateParts.length < 3) {
      return a;
    }
    return parseInt(dateParts[2] + '' + dateParts[1] + '' + dateParts[0]);
  },
  "date-custom-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "date-custom-desc": function (a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

function pressMentionsStreamlining(num) {
  num = parseInt(num);
  if(num > 100) {
    return "> 100";
  } else if(num > 50) {
    return "51 - 100";
  } else if(num > 10) {
    return "11 - 50";
  } else if(num > 1) {
    return "2 - 10";
  } else {
    return "0 - 1";
  }
}

function authPositionsStreamlining(num) {
  num = parseInt(num);
  if(num > 5) {
    return "> 5";
  } else if(num > 3) {
    return "4 - 5";
  } else if(num > 1) {
    return "2 - 3";
  } else if(num > 0) {
    return "1";
  } else {
    return "0";
  }
}

function companiesNumStreamlining(num) {
  num = parseInt(num);
  if(num == 1) {
    return "1";
  } else if(num == 2) {
    return "2";
  } else if(num > 2 && num <= 5) {
    return "3 - 5";
  } else if(num > 5 && num <= 10) {
    return "6 - 10";
  } else if(num > 10) {
    return "> 10";
  } else {
    return String(num);
  }
}

/*
function amountWonStramlining(num) {
  num = parseFloat(num);
  if(num > 5000000000) {
    return "> 5B";
  } else if(num > 1000000000) {
    return "> 1B - 5B";
  } else if(num > 500000000) {
    return "> 500M - 1B";
  } else if(num > 100000000) {
    return "> 100M - 500M";
  } else {
    return "<= 100M";
  }
}
*/
function amountWonStramlining(num) {
  //"> 5 Mrd Ft", "> 1 - 5 Mrd Ft", "> 500 M - 1 Mrd Ft", "<= 500 M Ft"
  num = parseFloat(num);
  if(num > 5000000000) {
    return "> 5 Mrd Ft";
  } else if(num > 1000000000) {
    return "> 1 - 5 Mrd Ft";
  } else if(num > 500000000) {
    return "> 500 M - 1 Mrd Ft";
  } else {
    return "<= 500 M Ft";
  }
}

function percentageTendersStreamlining(num) {
  num = parseFloat(num);
  if (num > 0.5) {
    return "> 0.5 %";
  } else if (num > 0.1) {
    return "0.1 - 0.5 %";
  } else if (num > 0.01) {
    return "0.01 - 0.1 %";
  } else if (num > 0.001) {
    return "0.001 - 0.01 %";
  } else {
    return "<= 0.001 %";
  }
}

//Format euro amount
function formatAmount(amt){
  if(isNaN(amt)) {
    return amt;
  }
  //return 'Ft ' + addcommas(amt);
  return addcommas(amt);
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

var totalAmountWon = 0;
json('./data/owners.json?' + randomPar, (err, owners) => {
  //Parse data
  _.each(owners, function (d) {
    d.amount_won_category = amountWonStramlining(d.total_amount_won_2018_2020);
    totalAmountWon += d.total_amount_won_2018_2020; 
    d.press_mentions_category = pressMentionsStreamlining(d.k_monitor_match); 
    d.companies_num_category = companiesNumStreamlining(d.companies.length);
    d.public_auth_positions_category = authPositionsStreamlining(d.public_auth_positions);
    d.percentage_tenders_won_category = percentageTendersStreamlining(d.total_amount_won_2018_2020_percentage);
    //Companies names string for search
    d.companiesNamesString = "";
    _.each(d.companies, function (c) {
      d.companiesNamesString += c.name + " ";
    });
    //Count risk indicators
    d.risk_indicators = 0;
    d.risk_indicators_list = [];
    if(d.pol_relationship == 1) {
      d.risk_indicators ++;
      d.risk_indicators_list.push("has_political_connections");
    }
    //This one also depends on shares
    if(d.amount_won_category == "> 5 Mrd Ft" && d.bo_share_5billion_2018_2020 == "Több mint 25%") {
      d.risk_indicators ++;
      d.risk_indicators_list.push("high_amount_won_and_share");
    }
    if(d.k_monitor_match > 1) {
      d.risk_indicators ++;
      d.risk_indicators_list.push("high_press_mentions");
    }
    //Flags list in textual form
    d.risk_indicators_list_strings = [];
    _.each(d.risk_indicators_list, function (f) {
      d.risk_indicators_list_strings.push(vuedata.flagsNames[f]);
    });
    //Assign person id string to avoid issue with custom counter
    d.person_id_str = String(d.person_id);
  });

  //Set totals for footer counters

  //Set dc main vars
  var ndx = crossfilter(owners);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.bo_name + " " + d.companiesNamesString;
      return entryString.toLowerCase();
  });

  //CHART 1 - Top Owners
  var createTopOwnersChart = function() {
    var chart = charts.topOwners.chart;
    var dimension = ndx.dimension(function (d) {
      return d.bo_name;
    }); 
    var group = dimension.group().reduceSum(function (d) {
      //return d.total_amount_won_2018_2020;
      if(vuedata.charts.topOwners.filter == "total_amount_won_2018_2020") {
          return shortenNumber(parseFloat(d[vuedata.charts.topOwners.filter]));
      }
      return parseFloat(d[vuedata.charts.topOwners.filter]);
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(10).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.topOwners.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(370)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatAmount(d.value);
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 2 - Political Connection Chart
  var createPoliticalConnectionsChart = function() {
    var chart = charts.politicalConnections.chart;
    var dimension = ndx.dimension(function (d) {
      return d.public_auth_positions_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.politicalConnections.divId);
    var order = ["> 5", "4 - 5", "2 - 3", "1", "0"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .cap(7)
      .ordering(function(d) { return order.indexOf(d.key)})
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + formatAmount(d.value);
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        if(d.key == "0") { return vuedata.colors.range[3]; }
        else { return vuedata.colors.flagRange[order.indexOf(d.key)]; }
      });
    chart.render();
  }

  //CHART 3 - Amount Won by Political Connection
  var createAmountWonPoliticalConnectionChart = function() {
    var chart = charts.amountWonPoliticalConnection.chart;
    var dimension = ndx.dimension(function (d) {
      if(d.pol_relationship == 1) {
        return "Közhatalmi pozícióval";
      }
      return "Közhatalmi pozíció nélkül";
    });
    var group = dimension.group().reduceSum(function (d) {
      return d.total_amount_won_2018_2020;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(100).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.amountWonPoliticalConnection.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(370)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .gap(45)
      .group(filteredGroup)
      .dimension(dimension)
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatAmount(d.value);
      })
      .colorCalculator(function(d, i) {
        if(d.key == "Közhatalmi pozícióval") { return vuedata.colors.flag; }
        return vuedata.colors.range[3];
      })
      .elasticX(true)
      .xAxis().ticks(2);
      //.xAxis().ticks(4).tickFormat(d3.format(".3s"));
    chart.render();
  }

  //CHART 4 - Amount Won Chart
  var createAmountWonChart = function() {
    var chart = charts.amountWon.chart;
    var dimension = ndx.dimension(function (d) {
      return d.amount_won_category;
    });
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var filteredGroup = (function(source_group) {
      return {
        all: function() {
          return source_group.top(100).filter(function(d) {
            return (d.value != 0);
          });
        }
      };
    })(group);
    var width = recalcWidth(charts.amountWon.divId);
    var charsLength = recalcCharsLength(width);
    //var order = ["> 5B", "> 1B - 5B", "> 500M - 1B", "> 100M - 500M", "<= 100M"];
    var order = ["> 5 Mrd Ft", "> 1 - 5 Mrd Ft", "> 500 M - 1 Mrd Ft", "<= 500 M Ft"];
    chart
      .width(width)
      .height(370)
      .margins({top: 0, left: 0, right: 20, bottom: 20})
      .group(filteredGroup)
      .dimension(dimension)
      .ordering(function(d) { return order.indexOf(d.key)})
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatAmount(d.value);
      })
      .colorCalculator(function(d, i) {
        //if(d.key == "> 5 Mrd Ft") { return vuedata.colors.flag; }
        return vuedata.colors.default;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 5 - Percentage categories
  var createPercentageTendersChart = function() {
    var chart = charts.percentageTenders.chart;
    var dimension = ndx.dimension(function (d) {
      return d.percentage_tenders_won_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.percentageTenders.divId);
    var order = ["> 0.5 %", "0.1 - 0.5 %", "0.01 - 0.1 %", "0.001 - 0.01 %", "<= 0.001 %"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .cap(7)
      .ordering(function(d) { return order.indexOf(d.key)})
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + formatAmount(d.value);
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        return vuedata.colors.range2Inverse[order.indexOf(d.key)];
      });
    chart.render();
  }

  //CHART 6 - Press Mentions
  var createPressMentionsChart = function() {
    var chart = charts.pressMentions.chart;
    var dimension = ndx.dimension(function (d) {
      return d.press_mentions_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.pressMentions.divId);
    var order = ["> 100", "51 - 100", "11 - 50", "2 - 10", "0 - 1"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .cap(7)
      .ordering(function(d) { return order.indexOf(d.key)})
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + formatAmount(d.value);
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        if(d.key == "0 - 1") { return vuedata.colors.range[3]; }
        else { return vuedata.colors.flagRange[order.indexOf(d.key)]; }
      });
    chart.render();
  }

  //CHART 7 - RISK INDICATORS / RED FLAGS
  var createFlagsChart = function() {
    var chart = charts.flags.chart;
    var dimension = ndx.dimension(function (d) {
      return d.risk_indicators_list_strings;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var width = recalcWidth(charts.flags.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(410)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(group)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.flag;
      })
      .label(function (d) {
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          return d.key + ': ' + formatAmount(d.value);
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 6 - Companies Owned
  /*
  var createCompaniesNumChart = function() {
    var chart = charts.companiesNum.chart;
    var dimension = ndx.dimension(function (d) {
      return d.companies_num_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.companiesNum.divId);
    var order = ["1", "2", "3 - 5", "6 - 10", "> 10"];
    chart
      .width(sizes.width)
      .height(sizes.height)
      .cy(sizes.cy)
      .innerRadius(sizes.innerRadius)
      .radius(sizes.radius)
      .cap(7)
      .ordering(function(d) { return order.indexOf(d.key)})
      .legend(dc.legend().x(0).y(sizes.legendY).gap(10).autoItemWidth(true).horizontal(false).legendWidth(sizes.width).legendText(function(d) { 
        var thisKey = d.name;
        if(thisKey.length > 40){
          return thisKey.substring(0,40) + '...';
        }
        return thisKey;
      }))
      .title(function(d){
        return d.key + ': ' + d.value;
      })
      .dimension(dimension)
      //.ordinalColors(vuedata.colors.range)
      .group(group)
      .colorCalculator(function(d, i) {
        return vuedata.colors.range2[order.indexOf(d.key)];
      });
    chart.render();
  }
  */

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
      "language": {
        "info": "Találatok _START_ - _END_ az összes, _TOTAL_ számú találatból",
        "lengthMenu": "Mutass _MENU_ találatot",
        "search": "Keresés",
        "paginate": {
          "first":      "First",
          "last":       "Last",
          "next":       "Következő",
          "previous":   "Előző"
        }
      },
      "columnDefs": [
        /*
        {
          "searchable": false,
          "orderable": false,
          "targets": 0,   
          data: function ( row, type, val, meta ) {
            return count;
          }
        },
        */
        {
          "searchable": false,
          "orderable": true,
          "targets": 0,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.bo_name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "className": "dt-body-center",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return d.companies.length;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return formatAmount(shortenNumber(d.total_amount_won_2018_2020));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "className": "dt-body-center",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return d.public_auth_positions;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.pol_relationship_position_name;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "className": "dt-body-center",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return d.k_monitor_match;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "type": "flags",
          "className": "dt-body-center",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            var flagsOutput = "";
            for (let i = 0; i < d.risk_indicators; i++) {
              flagsOutput += "<img src='./images/redflag.png' class='redflag-img'>";
            }
            return flagsOutput;
            //return d.risk_indicators;
          }
        }
      ],
      "iDisplayLength" : 25,
      "bPaginate": true,
      "bLengthChange": true,
      "bFilter": false,
      "order": [[ 1, "desc" ]],
      "bSort": true,
      "bInfo": true,
      "bAutoWidth": false,
      "bDeferRender": true,
      "aaData": searchDimension.top(Infinity),
      "bDestroy": true,
    });
    var datatable = charts.table.chart;
    /*
    datatable.on( 'draw.dt', function () {
      var PageInfo = $('#dc-data-table').DataTable().page.info();
      datatable.DataTable().column(0, { page: 'current' }).nodes().each( function (cell, i) {
        cell.innerHTML = i + 1 + PageInfo.start;
      });
    });
    */
    datatable.DataTable().draw();

    $('#dc-data-table tbody').on('click', 'tr', function () {
      var data = datatable.DataTable().row( this ).data();
        vuedata.selectedOrg = data;
        $('#detailsModal').modal();
        //Companies table
        var dTable = $("#modalCompaniesTable");
        dTable.DataTable ({
            "data" : vuedata.selectedOrg.companies,
            "destroy": true,
            "search": true,
            "pageLength": 20,
            "dom": '<<f><t>pi>',
            "order": [[ 0, "desc" ]],
            "language": {
              "info": "Találatok _START_ - _END_ az összes, _TOTAL_ számú találatból",
              "lengthMenu": "Mutass _MENU_ találatot",
              "search": "Keresés",
              "paginate": {
                "first":      "First",
                "last":       "Last",
                "next":       "Következő",
                "previous":   "Előző"
              }
            },
            "columns" : [
              { "data" : function(a) { 
                  return a.name;
                }
              },
              { "data" : function(a) { 
                  return a.tax_number;
                }
              },
              { "type": "num-html",
                "orderSequence": ["desc", "asc"],
                "data" : function(a) { 
                  return formatAmount(a.total_amount_won_2018_2020);
                } 
              },
            ]
        });
        dTable.on( 'draw.dt', function () {
          var body = $( dTable.DataTable().table().body() ); 
        });
      
    });
  }
  //REFRESH TABLE
  function RefreshTable() {
    dc.events.trigger(function () {
      var alldata = searchDimension.top(Infinity);
      charts.table.chart.fnClearTable();
      charts.table.chart.fnAddData(alldata);
      charts.table.chart.fnDraw();
    });
  }

  //SEARCH INPUT FUNCTIONALITY
  var typingTimer;
  var doneTypingInterval = 1000;
  var $input = $("#search-input");
  $input.on('keyup', function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });
  $input.on('keydown', function () {
    clearTimeout(typingTimer);
  });
  function doneTyping () {
    var s = $input.val().toLowerCase();
    searchDimension.filter(function(d) { 
      return d.indexOf(s) !== -1;
    });
    throttle();
    var throttleTimer;
    function throttle() {
      window.clearTimeout(throttleTimer);
      throttleTimer = window.setTimeout(function() {
          dc.redrawAll();
      }, 250);
    }
  }

  //Top companies filter select
  $("#filterselect-topcompanies").change(function () {
    vuedata.charts.topCompanies.filter = this.value;
    createTopCompaniesChart();
  });

   //Amount won filter select
   $("#filterselect-topowners").change(function () {
    vuedata.charts.topOwners.filter = this.value;
    createTopOwnersChart();
  });

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createTopOwnersChart();
  createAmountWonChart();
  createPoliticalConnectionsChart();
  createAmountWonPoliticalConnectionChart();
  createPercentageTendersChart();
  createPressMentionsChart();
  createFlagsChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    .dimension(ndx)
    .group(all);
  counter.render();
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});

