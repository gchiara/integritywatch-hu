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
  <link rel="stylesheet" href="static/beneficial_owners.css?v=4">
</head>
<body>
    <div id="app" class="owners-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Tenderbajnok | <span class="h1-smaller">Végső tulajdonosok</span></h1>
              <h2>Interaktív adatbázis a közbeszerzéseken nyertes cégekről, tulajdonosaikról és közhatalmi szerepvállalásukról</h2>
              <button class="download-share-btn" @click="downloadDataset"><i class="material-icons">cloud_download</i> Szűrt adatok letöltése (.csv)</button>
              <p>Az alábbi grafikonra vagy listára kattintva a felhasználók rangsorolhatják, rendezhetik és szűrhetik a szervezeteket.</p>
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
            <div class="boxed-container chart-container owners_1">
              <chart-header :title="charts.topOwners.title" :info="charts.topOwners.info" ></chart-header>
              <div class="filterselect-container">
                <select id="filterselect-topowners">
                  <option value="total_amount_won_2018_2020">Az összes érdekeltségük által elnyert közbeszerzések teljes értéke szerint (million Ft)</option>
                  <option value="total_amount_won_2018_2020_percentage">Az érdekeltségeik által elnyert közbeszerzések értékének aránya (%) a vizsgált összes közbeszerzésen belül</option>
                </select>
              </div>
              <div class="chart-inner" id="topowners_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container owners_2">
              <chart-header :title="charts.politicalConnections.title" :info="charts.politicalConnections.info" ></chart-header>
              <div class="chart-inner" id="politicalconnections_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container owners_3">
              <chart-header :title="charts.amountWonPoliticalConnection.title" :info="charts.amountWonPoliticalConnection.info" ></chart-header>
              <div class="chart-inner" id="amountwonpoliticalconnection_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container owners_4">
              <chart-header :title="charts.amountWon.title" :info="charts.amountWon.info" ></chart-header>
              <div class="chart-inner" id="amountwon_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container owners_5">
              <chart-header :title="charts.percentageTenders.title" :info="charts.percentageTenders.info" ></chart-header>
              <div class="chart-inner" id="percentagetenders_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container owners_6">
              <chart-header :title="charts.pressMentions.title" :info="charts.pressMentions.info" ></chart-header>
              <div class="chart-inner" id="pressmentions_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container owners_7">
              <chart-header :title="charts.flags.title" :info="charts.flags.info" ></chart-header>
              <div class="chart-inner" id="flags_chart"></div>
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
                      <th class="header">Végső tulajdonos neve/sorszáma</th> 
                      <th class="header dt-body-right">Tulajdonolt cégek száma, 2021 (db)</th> 
                      <th class="header dt-body-right">Az összesen elnyert közbeszerzési eljárások értéke, 2018-2020 (million Ft)</th> 
                      <th class="header">Közhatalmi pozíciók száma (db)</th> 
                      <th class="header">A közhatalmi pozíció megnevezése</th>
                      <th class="header dt-body-center">Említések száma a sajtóban (db)</th>
                      <th class="header header-red dt-body-center">Red flagek száma (db)</th> 
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
              <input type="text" id="search-input" placeholder="Keresés név vagy cégnév szerint">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>tulajdonos <strong class="total-count">0</strong> ból
            </div>
          </div>
        </div>
        <!-- Reset filters -->
        <button class="reset-btn"><i class="material-icons">settings_backup_restore</i><span class="reset-btn-text">Szűrők visszaállítása</span></button>
      </div>
      <!-- DETAILS MODAL -->
      <div class="modal" id="detailsModal">
        <div class="modal-dialog">
          <div class="modal-content" v-if="selectedOrg">
            <!-- Modal Header -->
            <div class="modal-header">
              <div class="modal-title">
                <div class="name">{{ selectedOrg.bo_name }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line" v-if="selectedOrg.companies"><span class="details-line-title">Tulajdonolt cégek száma, 2021 (db):</span> {{ selectedOrg.companies.length }}</div>
                    <div class="details-line" v-if="selectedOrg.total_amount_won_2018_2020"><span class="details-line-title">Az összesen elnyert közbeszerzési eljárások értéke, 2018-2020 (million Ft):</span> {{ formatModalAmount(shortenNumber(selectedOrg.total_amount_won_2018_2020)) }}</div>
                    <div class="details-line" v-if="selectedOrg.k_monitor_match"><span class="details-line-title">Említések száma a sajtóban (db):</span> {{ selectedOrg.k_monitor_match }}</div>
                    <div class="details-line" v-if="selectedOrg.public_auth_positions"><span class="details-line-title">Közhatalmi pozíciók száma:</span> {{ selectedOrg.public_auth_positions }}</div>
                    <div class="details-line" v-else><span class="details-line-title">Közhatalmi pozíciók száma:</span> 0</div>
                    <div class="details-line" v-if="selectedOrg.pol_relationship && selectedOrg.pol_relationship == 1"><span class="details-line-title">A közhatalmi pozíció megnevezése:</span> {{ selectedOrg.pol_relationship_position_name }}</div>
                    <div class="details-line" v-if="selectedOrg.risk_indicators_list_strings && selectedOrg.risk_indicators_list_strings.length > 0"><span class="details-line-title details-line-title-red">Red flagek (figyelmeztető jelzések):</span> {{ selectedOrg.risk_indicators_list_strings.join('; ') }}</div>
                  </div>
                  <!-- Companies table -->
                  <div class="col-md-12">
                    <div class="companies-table-title">Érdekeltségek</div>
                    <table id="modalCompaniesTable" class="companies-table">
                      <thead>
                        <tr><th>Cégnév</th><th>Adószám</th><th>Közbeszerzésen elnyert összeg</th></tr>
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
      <loader v-if="loader" :text="''" />
    </div>

    <script type="text/javascript" src="vendor/js/d3.v5.min.js"></script>
    <script type="text/javascript" src="vendor/js/d3.layout.cloud.js"></script>
    <script type="text/javascript" src="vendor/js/crossfilter.min.js"></script>
    <script type="text/javascript" src="vendor/js/dc.js"></script>
    <script type="text/javascript" src="vendor/js/dc.cloud.js"></script>

    <script src="static/beneficial_owners.js?v=4"></script>

 
</body>
</html>