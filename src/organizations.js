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
  page: 'organizations',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  selectedYear: '2022',
  parameterYears: '2019-2021',
  tendersFolder: 'tenders',
  fullCpvList: [],
  fullAuthList: [],
  charts: {
    topCompanies: {
      title: 'A legtöbb közbeszerzést elnyerő cégek',
      info: 'A mutató 2018. január 01. és 2020. december 31. között összesen elnyert közbeszerzéseinek érteke (millió Ft) szerint rangsorolja a cégeket. Az egyedül vagy konzorciumban elnyert közbeszerzések értéke is lekérdezhető a grafikon felett lenyitható almutatók segítségével. Vizsgálatra csak azon vállalatok kerültek, amelyeknél a 2018-tól 2020-ig elnyert összes közbeszerzéseik értéke legalább a 2021-es árbevétel 50%-át tette ki. A konzorciumban elnyert eljárások értéke a tagok számával osztva szerepel, mivel pontos összeg nem áll rendelkezésre.',
      info_2022: 'Itt a legtöbb közbeszerzést egyedül vagy konzorciumban elnyerő cégek 2019. január 01. és 2021. december 31. között összesen elnyert közbeszerzéseinek érteke (millió Ft) rangsorolva szerepel. Vizsgálatra csak azon vállalatok kerültek, amelyeknél a közbeszerzéseik értéke legalább a 2022-es árbevétel 50%-át tette ki. A konzorciumban elnyert eljárások értéke a tagok számával osztva szerepel, mivel pontos összeg nem áll rendelkezésre.',
      filter: 'amount_won'
    },
    cpv: {
      title: 'Eljárások a közbeszerzés tárgya szerint',
      info: 'A mutató azt vizsgálja, hogy hány megbízást nyertek el a vizsgált cégek a 2018-2020-as időszakban a megbízás tárgya szerint. A megbízás tárgya az ábra feletti szürke sávban a nyílra kattinva kiválasztható. A kiválasztást követően az érintett cégek által megnyert többi közbeszerzés tárgya is megjelenik. Az eljárás tárgya a CPV kódok rendszere szerint szerepel. Ez az egységes osztályozási rendszer univerzális kódokkal utal minden olyan tevékenységre, amelyre közbeszerzés írható ki. Több CPV kód esetén a megbízás mindegyik tárgynál szerepel.',
      info_2022: 'A mutató azt vizsgálja, hogy hány megbízást nyertek el a vizsgált cégek a 2019-2021-es időszakban a megbízás tárgya szerint. A megbízás tárgya az ábra feletti szürke sávban a nyílra kattinva kiválasztható. A kiválasztást követően az érintett cégek által megnyert többi közbeszerzés tárgya is megjelenik. Az eljárás tárgya a CPV kódok rendszere szerint szerepel. Ez az egységes osztályozási rendszer univerzális kódokkal utal minden olyan tevékenységre, amelyre közbeszerzés írható ki. Több CPV kód esetén a megbízás mindegyik tárgynál szerepel.'
    },
    contractingAuth: {
      title: 'Eljárások ajánlatkérő szervezet szerint',
      info: 'A mutató azt vizsgálja, hogy hány eljárást nyertek el a vizsgált cégek a 2018-2020-as időszakban az egyes ajánlatkérő szervezeteknél. Az ajánlatkérő szervezet az ábra feletti szürke sávban a nyílra kattinva kiválasztható. A kiválasztást követően az érintett cégek által megnyert többi közbeszerzés kiírója is megjelenik. Több kiíró esetén a megbízás mindegyik kiírónál szerepel.',
      info_2022: 'A mutató azt vizsgálja, hogy hány eljárást nyertek el a vizsgált cégek a 2019-2021-es időszakban az egyes ajánlatkérő szervezeteknél. Az ajánlatkérő szervezet az ábra feletti szürke sávban a nyílra kattinva kiválasztható. A kiválasztást követően az érintett cégek által megnyert többi közbeszerzés kiírója is megjelenik. Több kiíró esetén a megbízás mindegyik kiírónál szerepel.'
    },
    amountWon: {
      title: 'Közbeszerzésen elnyert összeg',
      info: 'A mutató a vizsgált cégek által 2018. január 01. és 2020. december 31. között elnyert közbeszerzések összes, illetve átlagos értékét vizsgálja. A grafikon az egyes sávokba tartozó cégek darabszámát mutatja. Az ábra feletti szürke sávban a nyílra kattintva almutatók is megjeleníthetőek. A legnagyobb összes (legalább 5 milliárd Ft), illettve a legnagyobb átlagos (legalább 1 milliárd Ft) értékben elnyert közbeszerzések eltérő színnel kiemelt figyelmeztető jelzéssel szerepelnek.',
      info_2022: 'A mutató a vizsgált cégek által 2019. január 01. és 2021. december 31. között elnyert közbeszerzések összes, illetve átlagos értékét vizsgálja. A grafikon az egyes sávokba tartozó cégek darabszámát mutatja. Az ábra feletti szürke sávban a nyílra kattintva almutatók is megjeleníthetőek. A legnagyobb összes (legalább 5 milliárd Ft), illettve a legnagyobb átlagos (legalább 1 milliárd Ft) értékben elnyert közbeszerzések eltérő színnel kiemelt figyelmeztető jelzéssel szerepelnek.',
      filter: 'amount_won_category'
    },
    tendersRevenueRatio: {
      title: 'Közbeszerzések aránya a nettó árbevételhez képest',
      info: 'A mutató azt vizsgalja, hogy miként aránylik egymáshoz a 2018-ban, 2019-ben és 2020-ban elnyert közbeszerzések összértékének éves átlaga és az adott vállalkozás 2021-es évi nettó árbevétele. A grafikon az egyes sávokba tartozó cégek darabszámát mutatja. Az összehasonlításban azért szerepelnek különböző időszakok, mivel az elnyert közbeszerzések értéke gyakorta csak a közbeszerzés eredményének kihirdetését követő években, a megbízás megvalósítását követően jelenik meg a cégek eredményében. A konzorciumban elnyert eljárások értéke a tagok számával egyenlően elosztva szerepel, mivel pontos összeg nem áll rendelkezésre. A legalább 100%-ot elérő cégek a közbeszerzések súlya miatt eltérő színnel ábrázolt figyelmeztető jelzéssel (red flag-gel) szerepelnek.',
      info_2022: 'A mutató azt vizsgalja, hogy miként aránylik egymáshoz a 2019-ban, 2020-ben és 2021-ban elnyert közbeszerzések összértékének éves átlaga és az adott vállalkozás 2021-es évi nettó árbevétele. A grafikon az egyes sávokba tartozó cégek darabszámát mutatja. Az összehasonlításban azért szerepelnek különböző időszakok, mivel az elnyert közbeszerzések értéke gyakorta csak a közbeszerzés eredményének kihirdetését követő években, a megbízás megvalósítását követően jelenik meg a cégek eredményében. A konzorciumban elnyert eljárások értéke a tagok számával egyenlően elosztva szerepel, mivel pontos összeg nem áll rendelkezésre. A legalább 100%-ot elérő cégek a közbeszerzések súlya miatt eltérő színnel ábrázolt figyelmeztető jelzéssel (red flag-gel) szerepelnek.'
    },
    beneficiaries: {
      title: 'Ismert végső tulajdonosok száma, 2021 (fő)',
      info: 'A végső tulajdonosok a cég tevékenységének fő haszonélvezői. Számuk céginformációs adatok alapján áll rendelkezésre. A tulajdonos ismeretének hiánya a cég formájából is adódhat, azonba utalhat arra is, hogy a vállalkozás nem kívánja ezt az információt megosztani, ezért szerepel ez a mutató figyelmeztető jelzéssel.'
    },
    salesRevenueRatio: {
      title: 'Nyereségráta',
      info: 'A mutató a 2021-es adózott eredmény és a 2021-es értékesítés nettó árbevételének arányát vizsgálja. A grafikon az egyes sávokba tartozó cégek darabszámát mutatja. A legnagyobb arányú, legalább 20%-os mértékű jövedelmezőségi mutatóval rendelkező cégek eltérő színnel kiemelve, figyelmeztető jelzéssel (red flag-gel) szerepelnek.',
      info_2022: 'A mutató a 2022-es adózott eredmény és a 2022-es értékesítés nettó árbevételének arányát vizsgálja. A grafikon az egyes sávokba tartozó cégek darabszámát mutatja. A legnagyobb arányú, legalább 20%-os mértékű jövedelmezőségi mutatóval rendelkező cégek eltérő színnel kiemelve, figyelmeztető jelzéssel (red flag-gel) szerepelnek.'
    },
    flags: {
      title: 'Red flagek összesítése',
      info: 'A grafikon összesíti a Cégek és közbeszerzések aloldalon megjelenő red flageket és az egyes figyelmeztető jelzésekkel megjelölt cégek számát. A red flagek egy-egy mutató kirívó értékére hívják fel a figyelmet. Összességében, a jelzések potenciális veszélyforrásokat jelölnek, melyek magyarázatát az egyes mutatók leírásában fejtjük ki, de önmagukban nem jelentenek bizonyítékot bűncselekményre, korrupcióra vagy más visszaélésre. Bővebb információ az egyes grafikonoknál és Az oldalról menüpontban olvasható.'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Cégek',
      info: 'A kiválasztott végső tulajdonosokkal kapcsolatos főbb mutatók, beleértve az oldalon keletkező figyelmeztető jelzések számát. A tulajdonosok nevére kattintva további részletek érhetőek el az érdekeltségekről. A konzorciumban elnyert eljárások értéke a tagok számával egyenlő arányban osztva szerepel, mivel pontos összeg nem áll rendelkezésre. Adatvédelmi okok miatt névvel azokat a tulajdonosokat szerepeltetjük, akik (i) a vizsgált cégek többségében legalább 25%-os részesedéssel rendelkeznek, és cégeik összesen legalább  5 milliárd forint értékben nyertek el közbeszerzést a vizsgált időszakban; (ii) akik közhatalmi pozíciót töltenek/töltöttek be; (iii) akik legalább 2 említéssel szerepelnek a sajtóadatbázisban.'
    }
  },
  selectedOrg: {"Name": ""},
  flagsNames: {
    "high_revenue_ratio_percent": "20% feletti nyereségráta",
    "high_revenue_tender_percent": "100% feletti közbeszerzési arány",
    "high_amount_won": "5 Mrd Ft feletti közbeszerzési összérték",
    "high_amount_won_avg": "1 Mrd Ft feletti közbeszerzési átlagos értéke",
  },
  colors: {
    default: "#0aafec",
    //range: ["#25C3F7", "#0aafec", "#009fe2", "#0088d4", "#0476c7", "#0061b5"],
    //range2: ["#25C3F7", "#0aafec", "#009fe2", "#0476c7", "#0061b5"],
    range: ["#b2ddeb", "#6bdaff", "#25C3F7", "#0b8cd6", "#0061b5", "#004678"],
    range2: ["#6bdaff", "#25C3F7", "#0061b5", "#004678", "#0061b5"],
    //flag: "#fc8803",
    flag: "#fc3503",
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
      var entries = [['"Cégnév","A cég székhelye (megye)"','"Alkalmazottak száma, 2021 (fő)"','"Az értékesítés nettó árbevétele, 2021 (Ft)"','"Adózott eredmény, 2021 (Ft)"','"Elnyert eljárások értéke, 2018-2020 (Ft)"','"Elnyert eljárások száma, 2018-2020 (db)"','"Ismert végső tulajdonosok száma, 2021 (fő)"']];
      if(vuedata.selectedYear == '2022') {
        entries = [['"Cégnév","A cég székhelye (megye)"','"Alkalmazottak száma, 2022 (fő)"','"Az értékesítés nettó árbevétele, 2022 (Ft)"','"Adózott eredmény, 2022 (Ft)"','"Elnyert eljárások értéke, 2019-2021 (Ft)"','"Elnyert eljárások száma, 2019-2021 (db)"','"Ismert végső tulajdonosok száma, 2022 (fő)"']];
      }
      _.each(filteredData, function (d) {
        var entry = [
          '"' + d.registered_name.replaceAll('"','\'') + '"',
          '"' + d.county_registered + '"',
          d.employees_latestyear,
          d.net_sales_revenue_latestyear,
          d.tax_profit_latestyear,
          d.amount_won,
          d.single_bids_number + d.consortium_number,
          d.beneficiaries_number];
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
      link.setAttribute("download", "IW_HU_organizations.csv");
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
        var toShareUrl = 'https://tenderbajnok.transparency.hu';
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
  topCompanies: {
    chart: dc.rowChart("#topcompanies_chart"),
    type: 'row',
    divId: 'topcompanies_chart'
  },
  cpv: {
    chart: dc.rowChart("#cpv_chart"),
    type: 'row',
    divId: 'cpv_chart'
  },
  contractingAuth: {
    chart: dc.rowChart("#contractingauth_chart"),
    type: 'row',
    divId: 'contractingauth_chart'
  },
  amountWon: {
    chart: dc.rowChart("#amountwon_chart"),
    type: 'row',
    divId: 'amountwon_chart'
  },
  tendersRevenueRatio: {
    chart: dc.pieChart("#tendersrevenueratio_chart"),
    type: 'pie',
    divId: 'tendersrevenueratio_chart'
  },
  /*
  beneficiaries: {
    chart: dc.pieChart("#beneficiaries_chart"),
    type: 'pie',
    divId: 'beneficiaries_chart'
  },
  */
  salesRevenueRatio: {
    chart: dc.pieChart("#salesrevenueratio_chart"),
    type: 'pie',
    divId: 'salesrevenueratio_chart'
  },
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

var specialCharactersToPlain = {
  'Ú': 'U',
  'Ü': 'U',
  'Ó': 'O',
  'Ö': 'O',
  'É': 'E',
  'Á': 'A',
  'Í': 'I'
}

jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "stringhu-pre": function (str) {
    for (var key in specialCharactersToPlain) {
      str = str.replaceAll(key, specialCharactersToPlain[key]);
    }
    return str.toUpperCase();
  },
  "stringhu-asc": function (a, b) {
      return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "stringhu-desc": function ( a, b ) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});

function tendersRevenueRatioStreamlining(percentage) {
  /*
  if(percentage <= 50) {
    return "<= 50%";
  } else if(percentage <= 70) {
    return "> 50% - 70%";
  } else if(percentage <= 90) {
    return "> 70% - 90%";
  } else if(percentage <= 100) {
    return "> 90% - 100%";
  } else if(percentage <= 200) {
    return "> 100% - 200%";
  } else if(percentage <= 300) {
    return "> 200% - 300%";
  } else if(percentage > 300) {
    return "> 300%";
  } else {
    return "N/A"
  }
  */
  if(percentage <= 50) {
    return "<= 50%";
  } else if(percentage <= 70) {
    return "> 50% - 70%";
  } else if(percentage <= 90) {
    return "> 70% - 90%";
  } else if(percentage <= 100) {
    return "> 90% - 100%";
  } else if(percentage > 100) {
    return "> 100%";
  } else {
    return "N/A"
  }
}

function returnOnSalesStreamlining(percentage) {
  if(percentage > 20) {
    return "> 20%";
  } else if(percentage > 10) {
    return "> 10% - 20%";
  } else if(percentage > 5) {
    return "> 5% - 10%";
  } else if(percentage >= 0) {
    return "0% - 5%";
  } else if(percentage < 0) {
    return "< 0%";
  } else {
    return "N/A";
  }
}

function beneficiariesStreamlining(num) {
  num = parseInt(num);
  if(num > 20) {
    return "> 20";
  } else if(num > 10) {
    return "11 - 20";
  } else if(num > 5) {
    return "6 - 10";
  } else if(num > 1) {
    return "2 - 5";
  } else if(num == 1) {
    return "1";
  } else {
    return "0";
  }
}

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

//Format euro amount
function formatAmount(amt){
  if(isNaN(amt)) {
    return amt;
  }
  //return 'Ft ' + addcommas(amt);
  return addcommas(amt);
}

//Get URL parameters
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var organizationsDataset = './data/organizations_2022.json';
vuedata.selectedYear = '2022';
vuedata.parameterYears = '2019-2021';
vuedata.tendersFolder = 'tenders_2022';

if(getParameterByName('year') == '2021') {
  organizationsDataset = './data/organizations.json';
  vuedata.selectedYear = '2021';
  vuedata.parameterYears = '2018-2020';
  vuedata.tendersFolder = 'tenders';
}

if(vuedata.selectedYear == '2022') {
  _.each(vuedata.charts, function (c) {
    if(c.info_2022) {
      c.info = c.info_2022;
    }
  });
}

//Load data and generate charts
//Generate random parameter for dynamic dataset loading (to avoid caching)

var randomPar = '';
var randomCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for ( var i = 0; i < 5; i++ ) {
  randomPar += randomCharacters.charAt(Math.floor(Math.random() * randomCharacters.length));
}

var totalTenders = 0;
json(organizationsDataset + '?' + randomPar, (err, organizations) => {
csv('./data/cpv.csv?' + randomPar, (err, cpvNames) => {
  var fullCpvList = [];
  var fullAuthList = []
  //Parse data
  _.each(organizations, function (d) {
    d.revenue_tender_percent_category = tendersRevenueRatioStreamlining(d.revenue_tender_percent_latestyear);
    d.beneficiaries_range = beneficiariesStreamlining(d.beneficiaries_number);
    d.salesreturn_percent_category = returnOnSalesStreamlining(d.revenue_ratio_percent_latestyear);
    d.amount_won_category = amountWonStramlining(d.amount_won);
    d.amount_won_category_avg = amountWonStramlining(d.average_amt_tenders_won);
    totalTenders += d.tenders_num;
    //CPV Names
    d.cpvStrings = [];
    _.each(d.cpv, function (code) {
      var cpvName = _.find(cpvNames, function (x) { return x.CODE == code });
      if(cpvName) {
        var thisCpvString = cpvName.CPV_HU + ' (' + code + ')';
        d.cpvStrings.push(thisCpvString);
        if(fullCpvList.indexOf(thisCpvString) == -1) {
          fullCpvList.push(thisCpvString);
        }
      } else {
        d.cpvStrings.push(code);
      }
    }); 
    _.each(d.contractingAuth, function (auth) {
      //auth = auth.replaceAll('&Quot','');
      if(fullAuthList.indexOf(auth) == -1) {
        fullAuthList.push(auth);
      }
    });
    
    //Count risk indicators
    d.risk_indicators_list = [];
    d.risk_indicators = 0;
    /*
    if(d.beneficiaries_number == 0) {
      d.risk_indicators ++;
    }
    */
    if(d.revenue_ratio_percent_latestyear > 20) {
      d.risk_indicators ++;
      d.risk_indicators_list.push("high_revenue_ratio_percent");
    }
    if(d.revenue_tender_percent_latestyear > 100) {
      d.risk_indicators ++;
      d.risk_indicators_list.push("high_revenue_tender_percent");
    }
    if(d.amount_won_category == "> 5 Mrd Ft") {
      d.risk_indicators ++;
      d.risk_indicators_list.push("high_amount_won");
    }
    if(d.amount_won_category_avg == "> 1 - 5 Mrd Ft" || d.amount_won_category_avg == "> 5 Mrd Ft") {
      d.risk_indicators ++;
      d.risk_indicators_list.push("high_amount_won_avg");
    }
    //Flags list in textual form
    d.risk_indicators_list_strings = [];
    _.each(d.risk_indicators_list, function (f) {
      d.risk_indicators_list_strings.push(vuedata.flagsNames[f]);
    });
  });
  //Order cpv and auth lists and then apply to vuedata
  vuedata.fullCpvList = fullCpvList.sort(function(a, b){
    var aNum = parseFloat(a.split('(')[1].replace(')','').replace('-','.'));
    var bNum = parseFloat(b.split('(')[1].replace(')','').replace('-','.'));
    if(aNum < bNum) { return -1; }
    if(aNum > bNum) { return 1; }
    return 0;
  });
  vuedata.fullAuthList = fullAuthList.sort(function(a, b){
    if(a.replace('"','').replace('&','').trim() < b.replace('"','').replace('&','').trim()) { return -1; }
    if(a.replace('"','').replace('&','').trim() > b.replace('"','').replace('&','').trim()) { return 1; }
    return 0;
  });

  //Set totals for footer counters
  $('.count-box-tenders .total-count-tenders').text(totalTenders);

  //Set dc main vars
  var ndx = crossfilter(organizations);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.registered_name + " " + d.city + " " + d.county_registered;
      return entryString.toLowerCase();
  });
  var cpvDimension = ndx.dimension(function (d) {
    return d.cpvStrings;
  });
  var authDimension = ndx.dimension(function (d) {
    return d.contractingAuth;
  });

  //CHART 1 - Top Companies
  var topCompaniesDimension = ndx.dimension(function (d) {
    return d.registered_name;
  }); 
  var createTopCompaniesChart = function() {
    var chart = charts.topCompanies.chart;
    var dimension = topCompaniesDimension;
    var group = dimension.group().reduceSum(function (d) {
      return shortenNumber(parseFloat(d[vuedata.charts.topCompanies.filter]));
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
    var width = recalcWidth(charts.topCompanies.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(405)
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

  //CHART 2 - CPV
  var createCpvChart = function() {
    var chart = charts.cpv.chart;
    var dimension = ndx.dimension(function (d) {
      return d.cpvStrings;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var width = recalcWidth(charts.cpv.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(415)
      .cap(10)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(group)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key == "Others") {d.key = "Egyéb";}
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          if(d.key == "Others") {d.key = "Egyéb";}
          return d.key + ': ' + formatAmount(d.value);
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 3 - Amount Won
  var createAmountWonChart = function() {
    var chart = charts.amountWon.chart;
    var dimension = ndx.dimension(function (d) {
      return d[vuedata.charts.amountWon.filter];
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
    //var order = ["> 100B", "50B - 100B", "10B - 50B", "5B - 10B", "1B - 5B", "500M - 1B", "300M - 500M", "100M - 300M", "50M - 100M", "30M - 50M", "10M - 30M", "5M - 10M", "< 5M", "N/A"];
    //var order = ["> 5B", "> 1B - 5B", "> 500M - 1B", "> 100M - 500M", "<= 100M"];
    var order = ["> 5 Mrd Ft", "> 1 - 5 Mrd Ft", "> 500 M - 1 Mrd Ft", "<= 500 M Ft"];
    chart
      .width(width)
      .height(430)
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
        if(d.key == "> 5 Mrd Ft") { return vuedata.colors.flag; }
        if(d.key == "> 1 - 5 Mrd Ft" && vuedata.charts.amountWon.filter == 'amount_won_category_avg') { return vuedata.colors.flag; }
        return vuedata.colors.default;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 4 - Tenders Revenue Ratio
  var createTendersRevenueRatioChart = function() {
    var chart = charts.tendersRevenueRatio.chart;
    var dimension = ndx.dimension(function (d) {
      return d.revenue_tender_percent_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.tendersRevenueRatio.divId);
    //var order = ["N/A", "<= 50%", "> 50% - 70%", "> 70% - 90%", "> 90% - 100%", "> 100% - 200%", "> 200% - 300%", "> 300%"];
    var order = ["N/A", "<= 50%", "> 50% - 70%", "> 70% - 90%", "> 90% - 100%", "> 100%"];
    var orderNoFlag = ["<= 50%", "> 50% - 70%", "> 70% - 90%", "> 90% - 100%"];
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
        if(d.key == "> 100%") { return vuedata.colors.flag; }
        if(d.key == "N/A") { return vuedata.colors.grey; }
        return vuedata.colors.range2[orderNoFlag.indexOf(d.key)];
      });
    chart.render();
  }

  //CHART 5 - Sales Revenue Ratio
  var salesRevenueRatioChart = function() {
    var chart = charts.salesRevenueRatio.chart;
    var dimension = ndx.dimension(function (d) {
      return d.salesreturn_percent_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.salesRevenueRatio.divId);
    var order = ["N/A", "< 0%", "0% - 5%", "> 5% - 10%", "> 10% - 20%", "> 20%"];
    var orderNoFlag = ["< 0%", "0% - 5%", "> 5% - 10%", "> 10% - 20%"];
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
        if(d.key == "> 20%") { return vuedata.colors.flag; }
        if(d.key == "N/A") { return vuedata.colors.grey; }
        return vuedata.colors.range2[orderNoFlag.indexOf(d.key)];
      });
    chart.render();
  }

  //CHART 6 - Number of beneficiaries
  var createBeneficiariesChart = function() {
    var chart = charts.beneficiaries.chart;
    var dimension = ndx.dimension(function (d) {
      return d.beneficiaries_range;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.beneficiaries.divId);
    var order = ["0", "1", "2 - 5", "6 - 10", "11 - 20", "> 20"];
    var orderNoFlag = ["1", "2 - 5", "6 - 10", "11 - 20", "> 20"];
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
        if(d.key == "0") { return vuedata.colors.flag; }
        return vuedata.colors.range[orderNoFlag.indexOf(d.key) + 1];
      });
    chart.render();
  }

  //CHART 6 - CONTRACTING AUTH
  var createContractingAuthChart = function() {
    var chart = charts.contractingAuth.chart;
    var dimension = ndx.dimension(function (d) {
      return d.contractingAuth;
    }, true);
    var group = dimension.group().reduceSum(function (d) {
      return 1;
    });
    var width = recalcWidth(charts.contractingAuth.divId);
    var charsLength = recalcCharsLength(width);
    chart
      .width(width)
      .height(415)
      .cap(10)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(group)
      .dimension(dimension)
      .colorCalculator(function(d, i) {
        return vuedata.colors.default;
      })
      .label(function (d) {
          if(d.key == "Others") {d.key = "Egyéb";}
          if(d.key.length > charsLength){
            return d.key.substring(0,charsLength) + '...';
          }
          return d.key;
      })
      .title(function (d) {
          if(d.key == "Others") {d.key = "Egyéb";}
          return d.key + ': ' + formatAmount(d.value);
      })
      .elasticX(true)
      .xAxis().ticks(4);
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
      .height(475)
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
          "type":"stringhu",
          "data": function(d) {
            return d.registered_name.trim();
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 1,
          "defaultContent":"N/A",
          "data": function(d) {
            return d.county_registered;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 2,
          "defaultContent":"N/A",
          "className": "dt-body-right",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return d.employees_latestyear;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return formatAmount(shortenNumber(d.net_sales_revenue_latestyear));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return formatAmount(shortenNumber(d.tax_profit_latestyear));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return formatAmount(shortenNumber(d.amount_won));
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "className": "dt-body-right",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return d.single_bids_number + d.consortium_number;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 7,
          "defaultContent":"N/A",
          "className": "dt-body-center",
          "orderSequence": ["desc", "asc"],
          "data": function(d) {
            return d.beneficiaries_number;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
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
      "order": [[ 5, "desc" ]],
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
      json('./data/'+vuedata.tendersFolder+'/'+data.tax_number+'.json', (err, tenders) => {
        data.tenders = tenders;
        vuedata.selectedOrg = data;
        $('#detailsModal').modal();
        //Tenders table
        var dTable = $("#modalTendersTable");
        dTable.DataTable ({
            "data" : vuedata.selectedOrg.tenders,
            "destroy": true,
            "search": true,
            "pageLength": 10,
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
                  return "<a href='"+a.link_notice+"' target='_blank'>"+a.procurement_title+"</a>";
                }
              },
              { "type": "date-custom",
                "data" : function(a) { 
                  return a.date;
                }
              },
              { "data" : function(a) { 
                  return a.contracting_authority;
                } 
              },
              { "type": "num-html",
                "orderSequence": ["desc", "asc"],
                "data" : function(a) { 
                  return formatAmount(a.contract_value);
                } 
              },
              { "data" : function(a) { 
                  return a.company_names;
                } 
              },
              { "orderSequence": ["desc", "asc"],
                "data" : function(a) { 
                if(a.number_companies_win > 0) {
                  return formatAmount((a.contract_value / a.number_companies_win).toFixed(2));
                }
                return "/";
              } 
            },
            ]
        });
        /*
        $('#modalTendersTable tbody').on('click', 'tr', function () {
          var tdata = dTable.DataTable().row( this ).data();
          window.open(tdata.link_notice, '_blank');
        });
        */
        dTable.on( 'draw.dt', function () {
          var body = $( dTable.DataTable().table().body() ); 
        });
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

  //Cpv filter select
  $("#filterselect-cpv").change(function () {
    var selectedCpv = this.value;
    if(selectedCpv == "all") {
      cpvDimension.filter(null);
    } else {
      cpvDimension.filter(function(d) { 
        return d.indexOf(selectedCpv) !== -1;
      });
    }
    dc.redrawAll();
  });

  //Auth filter select
  $("#filterselect-auth").change(function () {
    var selectedAuth = this.value;
    if(selectedAuth == "all") {
      authDimension.filter(null);
    } else {
      authDimension.filter(function(d) { 
        return d.indexOf(selectedAuth) !== -1;
      });
    }
    dc.redrawAll();
  });

  //Top companies filter select
  $("#filterselect-topcompanies").change(function () {
    vuedata.charts.topCompanies.filter = this.value;
    createTopCompaniesChart();
  });

   //Amount won filter select
   $("#filterselect-amountwon").change(function () {
    vuedata.charts.amountWon.filter = this.value;
    createAmountWonChart();
  });

  //Reset charts
  var resetGraphs = function() {
    for (var c in charts) {
      if(charts[c].type !== 'table' && charts[c].chart.hasFilter()){
        charts[c].chart.filterAll();
      }
    }
    searchDimension.filter(null);
    cpvDimension.filter(null);
    authDimension.filter(null);
    $("#search-input").val("");
    $("#filterselect-cpv").val("all");
    $("#filterselect-auth").val("all");
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createTopCompaniesChart();
  createCpvChart();
  createAmountWonChart();
  //createBeneficiariesChart();
  createTendersRevenueRatioChart();
  salesRevenueRatioChart();
  createContractingAuthChart();
  createFlagsChart();
  createTable();

  $('.dataTables_wrapper').append($('.dataTables_length'));

  //Hide loader
  vuedata.loader = false;

  //COUNTERS
  //Main counter
  var all = ndx.groupAll();
  var counter = dc.dataCount('.dc-data-count')
    //.formatNumber(d3.format(","))
    .dimension(ndx)
    .group(all);
  counter.render();
  counter.on("renderlet.resetall", function(c) {
    RefreshTable();
  });

  //Custom counters
  function drawActivitiesCounter() {
    var dim = ndx.dimension (function(d) {
      if (!d.tax_number) {
        return "";
      } else {
        return d.tax_number;
      }
    });
    var group = dim.group().reduce(
      function(p,d) {  
        p.nb +=1;
        if (!d.tax_number) {
          return p;
        }
        p.tendersnum = +d.tenders_num;
        return p;
      },
      function(p,d) {  
        p.nb -=1;
        if (!d.tax_number) {
          return p;
        }
        p.tendersnum = +d.tenders_num;
        return p;
      },
      function(p,d) {  
        return {nb: 0, tendersnum:0}; 
      }
    );
    group.order(function(p){ return p.nb });
    var tendersnum = 0;
    var counter = dc.dataCount(".count-box-tenders")
    .dimension(group)
    .group({value: function() {
      return group.all().filter(function(kv) {
        if (kv.value.nb >0) {
          tendersnum += +kv.value.tendersnum;
        }
        return kv.value.nb > 0; 
      }).length;
    }})
    .renderlet(function (chart) {
      $(".nbtenders").text(formatAmount(tendersnum));
      tendersnum=0;
    });
    counter.render();
  }
  drawActivitiesCounter();

  //Window resize function
  window.onresize = function(event) {
    resizeGraphs();
  };

});
});
