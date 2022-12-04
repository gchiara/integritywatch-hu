<html lang="en">
<head>
  <?php include 'gtag.php' ?>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Integrity Watch Hungary</title>
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@TI_EU" />
  <meta name="twitter:creator" content="@eucampaign" />
  <meta property="og:url" content="https://www.integritywatch.hu" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Integrity Watch Hungary" />
  <meta property="og:description" content="Integrity Watch Hungary" />
  <meta property="og:image" content="http://www.integritywatch.eu/images/thumbnail.jpg" />
  <meta property="fb:app_id" content="1611680135716224" />
  <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="static/organizations.css?v=1">
</head>
<body>
    <div id="app" class="organizations-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>INTEGRITY WATCH HUNGARY | Organizations</h1>
              <h2>This is a user-friendly interactive database that provides a unique overview of organisations and tenders.</h2>
              <a class="read-more-btn" href="./about.php?section=4">Read more</a>
              <button class="social-share-btn twitter-btn" @click="share('twitter')"><img src="./images/twitter-nobg.png" />Share on Twitter</button>
              <button class="social-share-btn  facebook-btn" @click="share('facebook')"><img src="./images/facebook-nobg.png" />Share on Facebook</button>
              <p>By simply clicking on the graph or list below users can rank, sort and filter the organisations.</p>
            </div>
            <i class="material-icons close-btn" @click="showInfo = false">close</i>
          </div>
        </div>
      </div>
      <!-- MAIN -->
      <div class="container-fluid dashboard-container-outer">
        <div class="row dashboard-container">
          <!-- CHARTS - FIRST ROW -->
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container organizations_2">
              <chart-header :title="charts.topCompanies.title" :info="charts.topCompanies.info" ></chart-header>
              <div class="chart-inner" id="topcompanies_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.tendersRevenueRatio.title" :info="charts.tendersRevenueRatio.info" ></chart-header>
              <div class="chart-inner" id="tendersrevenueratio_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.salesRevenueRatio.title" :info="charts.salesRevenueRatio.info" ></chart-header>
              <div class="chart-inner" id="salesrevenueratio_chart"></div>
            </div>
          </div>
          <div class="col-md-6 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.amountWon.title" :info="charts.amountWon.info" ></chart-header>
              <div class="chart-inner" id="amountwon_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_3">
              <chart-header :title="charts.cpv.title" :info="charts.cpv.info" ></chart-header>
              <div class="chart-inner" id="cpv_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.beneficiaries.title" :info="charts.beneficiaries.info" ></chart-header>
              <div class="chart-inner" id="beneficiaries_chart"></div>
            </div>
          </div>
          <!-- TABLE -->
          <div class="col-12 chart-col">
            <div class="boxed-container chart-container chart-container-table">
              <chart-header :title="charts.table.title" :info="charts.table.info" ></chart-header>
              <div class="chart-inner chart-table">
                <table class="table table-hover dc-data-table" id="dc-data-table">
                  <thead>
                    <tr class="header">
                      <th class="header">Nr</th> 
                      <th class="header">Name</th> 
                      <th class="header">County</th> 
                      <th class="header">Employees</th> 
                      <th class="header">Revenue 18-22</th> 
                      <th class="header">Profit 18-22</th> 
                      <th class="header">Amount won 18-22</th> 
                      <th class="header">Beneficiaries</th> 
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom bar -->
      <div class="container-fluid footer-bar">
        <div class="row">
          <div class="footer-col col-8 col-sm-4">
            <div class="footer-input">
              <input type="text" id="search-input" placeholder="Filter by organization, city or county">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>out of <strong class="total-count">0</strong> organizations
            </div>
            <div class="count-box count-box-tenders">
              <div class="filter-count nbtenders">0</div>van de <strong class="total-count-tenders">0</strong> tenders
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Reset filters</span></button>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content" v-if="selectedOrg">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="name">{{ selectedOrg.registered_name }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line"><span class="details-line-title">T:</span> </div>
                    
                  </div>
                  <!-- Tenders table -->
                  <div class="col-md-12">
                    <table id="modalTendersTable" class="tenders-table">
                      <thead>
                        <tr><th>Title</th><th>Date</th><th>Authority</th><th>Contract Value</th></tr>
                      </thead>
                    </table>
                  </div>
                  <!-- End tenders table -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Loader -->
      <loader v-if="loader" :text="'Lorem ipsum sit dolor amet.'" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/organizations.js"></script>

 
</body>
</html>