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


// Data object - is also used by Vue

var vuedata = {
  page: 'organizations',
  loader: true,
  showInfo: true,
  showShare: true,
  chartMargin: 40,
  charts: {
    topCompanies: {
      title: 'Top Companies',
      info: 'Top Companies by won value',
      filter: 'amount_won_18_20'
    },
    cpv: {
      title: 'Top CPV',
      info: 'Lorem ipsum'
    },
    amountWon: {
      title: 'Companies by Amount Won',
      info: 'Lorem ipsum',
      filter: 'amount_won_category'
    },
    tendersRevenueRatio: {
      title: 'Tenders Revenue Ratio',
      info: 'Lorem ipsum'
    },
    beneficiaries: {
      title: 'Beneficiaries',
      info: 'Lorem ipsum'
    },
    salesRevenueRatio: {
      title: 'Return on Sales Ratio',
      info: 'Lorem ipsum'
    },
    table: {
      chart: null,
      type: 'table',
      title: 'Organisations',
      info: 'Lorem ipsum'
    }
  },
  selectedOrg: {"Name": ""},
  colors: {
    //default: "#009fe2",
    default: "#0aafec",
    //range: ["#0476c7", "#009fe2", "#0079ca", "#005db5", "#014aa5"],
    range: ["#25C3F7", "#0aafec", "#009fe2", "#0088d4", "#0476c7", "#0061b5"],
    range2: ["#25C3F7", "#0aafec", "#009fe2", "#0476c7", "#0061b5"],
    flag: "#fc8803",
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
  beneficiaries: {
    chart: dc.pieChart("#beneficiaries_chart"),
    type: 'pie',
    divId: 'beneficiaries_chart'
  },
  salesRevenueRatio: {
    chart: dc.pieChart("#salesrevenueratio_chart"),
    type: 'pie',
    divId: 'salesrevenueratio_chart'
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

//Add commas to thousands
function addcommas(x){
  if(parseInt(x)){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    var x = a.replace('€', '').replaceAll('Ft', '').replaceAll(',','').trim();
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

//Custom ordering for range costs string
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
  "amt-range-pre": function (a) {
    if(!a) {
      return -1;
    }
    var x = a.split("-");
    if(x.length < 2) {
      x = x[0].replace('€', '').replaceAll(',','').trim();
    } else {
      x = x[1].replace('€', '').replaceAll(',','').trim();
    }
    if(x == '' || isNaN(x)) {
      return -1;
    }
    return parseFloat(x);
  },
  "amt-range-asc": function (a, b) {
    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
  },
  "amt-range-desc": function (a, b) {
      return ((a < b) ? 1 : ((a > b) ? -1 : 0));
  }
});


function tendersRevenueRatioStreamlining(percentage) {
  if(percentage < 50) {
    return "< 50%";
  } else if(percentage < 70) {
    return "50% - 70%";
  } else if(percentage < 90) {
    return "70% - 90%";
  } else if(percentage < 100) {
    return "90% - 100%";
  } else if(percentage < 200) {
    return "100% - 200%";
  } else if(percentage <= 300) {
    return "200% - 300%";
  } else if(percentage > 300) {
    return "> 300%";
  } else {
    return "N/A"
  }
}

function returnOnSalesStreamlining(percentage) {
  /*
  if(percentage > 30) {
    return "> 30%";
  } else if(percentage > 20) {
    return "20% - 30%";
  } else if(percentage > 10) {
    return "10% - 20%";
  } else if(percentage > 5) {
    return "5% - 10%";
  } else if(percentage >= 0) {
    return "0% - 5%";
  } else if(percentage < 0) {
    return "< 0%";
  } else {
    return "N/A"
  }
  */
  if(percentage > 20) {
    return "> 20%";
  } else if(percentage > 10) {
    return "10% - 20%";
  } else if(percentage > 5) {
    return "5% - 10%";
  } else if(percentage >= 0) {
    return "0% - 5%";
  } else if(percentage < 0) {
    return "< 0%";
  } else {
    return "N/A"
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
  num = parseFloat(num);
  /*
  if(num > 100000000000) {
    return "> 100B";
  } else if(num > 50000000000) {
    return "50B - 100B";
  } else if(num > 10000000000) {
    return "10B - 50B";
  } else if(num > 5000000000) {
    return "5B - 10B";
  } else if(num > 1000000000) {
    return "1B - 5B";
  } else if(num > 500000000) {
    return "500M - 1B";
  } else if(num > 300000000) {
    return "300M - 500M";
  } else if(num > 100000000) {
    return "100M - 300M";
  } else if(num >= 50000000) {
    return "50M - 100M";
  } else if(num < 50000000) {
    return "< 50M";
  } else {
    return "0";
  }
  */
 //<100 million, 100-500 million, 500-1 billion, 1-5 billion, > 5 billion
  if(num > 5000000000) {
    return "> 5B";
  } else if(num > 1000000000) {
    return "1B - 5B";
  } else if(num > 500000000) {
    return "500M - 1B";
  } else if(num > 100000000) {
    return "100M - 500M";
  } else {
    return "< 100M";
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

var totalTenders = 0;
json('./data/organizations.json?' + randomPar, (err, organizations) => {
csv('./data/cpv.csv?' + randomPar, (err, cpvNames) => {
  //Parse data
  _.each(organizations, function (d) {
    d.revenue_tender_percent_category = tendersRevenueRatioStreamlining(d.revenue_tender_percent_2021);
    d.beneficiaries_range = beneficiariesStreamlining(d.beneficiaries_number);
    d.salesreturn_percent_category = returnOnSalesStreamlining(d.revenue_ratio_percent_2021);
    d.amount_won_category = amountWonStramlining(d.amount_won_18_20);
    d.amount_won_category_avg = amountWonStramlining(d.average_amt_tenders_won);
    totalTenders += d.tenders_num;
    //CPV Names
    d.cpvStrings = [];
    _.each(d.cpv, function (code) {
      var cpvName = _.find(cpvNames, function (x) { return x.CODE == code });
      if(cpvName) {
        d.cpvStrings.push(cpvName.CPV_HU + ' (' + code + ')' );
      } else {
        d.cpvStrings.push(code);
      }
    });     
    //Count risk indicators
    d.risk_indicators = 0;
    if(d.beneficiaries_number == 0) {
      d.risk_indicators ++;
    }
    if(d.revenue_ratio_percent_2021 > 30) {
      d.risk_indicators ++;
    }
    if(d.revenue_tender_percent_2021 > 300) {
      d.risk_indicators ++;
    }
    if(d.amount_won_category == "> 5B" || d.amount_won_category_avg == "1B - 5B" || d.amount_won_category_avg == "> 5B") {
      d.risk_indicators ++;
    }
  });

  //Set totals for footer counters
  $('.count-box-tenders .total-count-tenders').text(totalTenders);

  //Set dc main vars
  var ndx = crossfilter(organizations);
  var searchDimension = ndx.dimension(function (d) {
      var entryString = "" + d.registered_name + " " + d.city + " " + d.county_registered;
      return entryString.toLowerCase();
  });

  //CHART 1 - Top Companies
  var topCompaniesDmension = ndx.dimension(function (d) {
    return d.registered_name;
  }); 
  var createTopCompaniesChart = function() {
    var chart = charts.topCompanies.chart;
    var dimension = topCompaniesDmension;
    var group = dimension.group().reduceSum(function (d) {
      return parseFloat(d[vuedata.charts.topCompanies.filter]);
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
          return d.key + ': ' + d.value;
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
      .height(450)
      .cap(10)
      .margins({top: 0, left: 0, right: 0, bottom: 20})
      .group(group)
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
          return d.key + ': ' + d.value;
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
    var order = ["> 5B", "1B - 5B", "500M - 1B", "100M - 500M", "< 100M"];
    chart
      .width(width)
      .height(400)
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
          return d.key + ': ' + d.value;
      })
      .colorCalculator(function(d, i) {
        if(d.key == "> 5B") { return vuedata.colors.flag; }
        if(d.key == "1B - 5B" && vuedata.charts.amountWon.filter == 'amount_won_category_avg') { return vuedata.colors.flag; }
        return vuedata.colors.default;
      })
      .elasticX(true)
      .xAxis().ticks(4);
    chart.render();
  }

  //CHART 4 - Tenders Revenue Ratio
  var tendersRevenueRatioChart = function() {
    var chart = charts.tendersRevenueRatio.chart;
    var dimension = ndx.dimension(function (d) {
      return d.revenue_tender_percent_category;
    });
    var group = dimension.group().reduceSum(function (d) { return 1; });
    var sizes = calcPieSize(charts.tendersRevenueRatio.divId);
    var order = ["N/A", "< 50%", "50% - 70%", "70% - 90%", "90% - 100%", "100% - 200%", "200% - 300%", "> 300%"];
    var orderNoFlag = ["< 50%", "50% - 70%", "70% - 90%", "90% - 100%", "100% - 200%", "200% - 300%"];
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
        if(d.key == "> 300%") { return vuedata.colors.flag; }
        if(d.key == "N/A") { return vuedata.colors.grey; }
        return vuedata.colors.range[orderNoFlag.indexOf(d.key)];
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
    //var order = ["N/A", "< 0%", "0% - 5%", "5% - 10%", "10% - 20%", "20% - 30%", "> 30%"];
    //var orderNoFlag = ["< 0%", "0% - 5%", "5% - 10%", "10% - 20%", "20% - 30%"];
    var order = ["N/A", "< 0%", "0% - 5%", "5% - 10%", "10% - 20%", "> 20%"];
    var orderNoFlag = ["< 0%", "0% - 5%", "5% - 10%", "10% - 20%"];
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
        return d.key + ': ' + d.value;
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

  //TABLE
  var createTable = function() {
    var count=0;
    charts.table.chart = $("#dc-data-table").dataTable({
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
            return d.registered_name;
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
          "data": function(d) {
            return d.employees_2021;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 3,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "data": function(d) {
            return formatAmount(d.net_sales_revenue_2021);
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 4,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "data": function(d) {
            return formatAmount(d.tax_profit_2021);
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 5,
          "defaultContent":"N/A",
          "type": "num-html",
          "className": "dt-body-right",
          "data": function(d) {
            return formatAmount(d.amount_won_18_20);
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 6,
          "defaultContent":"N/A",
          "className": "dt-body-right",
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
          "data": function(d) {
            return d.beneficiaries_number;
          }
        },
        {
          "searchable": false,
          "orderable": true,
          "targets": 8,
          "defaultContent":"N/A",
          "className": "dt-body-center",
          "data": function(d) {
            return d.risk_indicators;
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
      json('./data/tenders/'+data.tax_number+'.json', (err, tenders) => {
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
            "columns" : [
              { "data" : function(a) { 
                  return a.procurement_title;
                }
              },
              { "data" : function(a) { 
                  return a.date;
                }
              },
              { "data" : function(a) { 
                  return a.contracting_authority;
                } 
              },
              { "type": "num-html",
                "data" : function(a) { 
                  return formatAmount(a.contract_value);
                } 
              },
              { "data" : function(a) { 
                  return a.company_names;
                } 
              },
            ]
        });
        $('#modalTendersTable tbody').on('click', 'tr', function () {
          var tdata = dTable.DataTable().row( this ).data();
          window.open(tdata.link_notice, '_blank');
        });
        dTable.on( 'draw.dt', function () {
          var body = $( dTable.DataTable().table().body() );
          body.unhighlight();
          body.highlight( dTable.DataTable().search() );  
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
    $('#search-input').val('');
    dc.redrawAll();
  }
  $('.reset-btn').click(function(){
    resetGraphs();
  })
  
  //Render charts
  createTopCompaniesChart();
  createCpvChart();
  createAmountWonChart();
  createBeneficiariesChart();
  tendersRevenueRatioChart();
  salesRevenueRatioChart();
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
      $(".nbtenders").text(tendersnum);
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
