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
  <link rel="stylesheet" href="static/organizations.css?v=4">
</head>
<body>
    <div id="app" class="organizations-page">   
      <?php include 'header.php' ?>
      <!-- TOP AREA -->
      <div class="container-fluid top-description-container" v-if="showInfo">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Tenderbajnok | <span class="h1-smaller">Főbb közbeszerzési és cégmutatók</span></h1>
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
            <div class="boxed-container chart-container organizations_1">
              <chart-header :title="charts.topCompanies.title" :info="charts.topCompanies.info" ></chart-header>
              <div class="filterselect-container">
                <select id="filterselect-topcompanies">
                  <option value="amount_won_18_20">Összes elnyert pályázat szerint</option>
                  <option value="single_bids_amount">Egyedül elnyert eljárások szerint</option>
                  <option value="consortium_amount">Konzorciumban elnyert eljárások szerint</option>
                </select>
              </div>
              <div class="chart-inner" id="topcompanies_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_2">
              <chart-header :title="charts.tendersRevenueRatio.title" :info="charts.tendersRevenueRatio.info" ></chart-header>
              <div class="chart-inner" id="tendersrevenueratio_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_3">
              <chart-header :title="charts.salesRevenueRatio.title" :info="charts.salesRevenueRatio.info" ></chart-header>
              <div class="chart-inner" id="salesrevenueratio_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_4">
              <chart-header :title="charts.amountWon.title" :info="charts.amountWon.info" ></chart-header>
              <div class="filterselect-container">
                <select id="filterselect-amountwon">
                  <option value="amount_won_category">Az elnyert eljárások összes értéke szerint</option>
                  <option value="amount_won_category_avg">Elnyert eljárások átlagos összege szerint</option>
                </select>
              </div>
              <div class="chart-inner" id="amountwon_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_5">
              <chart-header :title="charts.cpv.title" :info="charts.cpv.info" ></chart-header>
              <div class="filterselect-container">
                <select id="filterselect-cpv">
                  <option value="all">All</option>
                  <option v-for="(item, index) in fullCpvList" :value="item" :key="index">{{item}}</option>
                </select>
              </div>
              <div class="chart-inner" id="cpv_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_6">
              <chart-header :title="charts.contractingAuth.title" :info="charts.contractingAuth.info" ></chart-header>
              <div class="filterselect-container">
                <select id="filterselect-auth">
                  <option value="all">All</option>
                  <option v-for="(item, index) in fullAuthList" :value="item" :key="index">{{item}}</option>
                </select>
              </div>
              <div class="chart-inner" id="contractingauth_chart"></div>
            </div>
          </div>
          <div class="col-md-3 chart-col">
            <div class="boxed-container chart-container organizations_7">
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
                      <th class="header">Cégnév</th> 
                      <th class="header">A cég székhelye (megye)</th> 
                      <th class="header dt-body-right">Alkalmazottak száma, 2021 (fő)</th> 
                      <th class="header dt-body-right">Az értékesítés nettó árbevétele, 2021 (million Ft)</th> 
                      <th class="header dt-body-right">Adózott eredmény, 2021 (Ft)</th> 
                      <th class="header dt-body-right">Elnyert eljárások értéke, 2018-2020 (million Ft)</th>
                      <th class="header dt-body-right">Elnyert eljárások száma, 2018-2020 (db)</th>
                      <th class="header dt-body-center">Ismert végső tulajdonosok száma, 2021 (fő)</th>
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
              <input type="text" id="search-input" placeholder="Keresés szervezet, város vagy megye szerint">
              <i class="material-icons">search</i>
            </div>
          </div>
          <div class="footer-col col-4 col-sm-8 footer-counts">
            <div class="dc-data-count count-box">
              <div class="filter-count">0</div>szervezet az <strong class="total-count">0</strong> ból
            </div>
            <div class="count-box count-box-tenders">
              <div class="filter-count nbtenders">0</div>eljárás az <strong class="total-count-tenders">0</strong> ból
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
                <div class="name">{{ selectedOrg.registered_name }}</div>
              </div>
              <button type="button" class="close" data-dismiss="modal"><i class="material-icons">close</i></button>
            </div>
            <!-- Modal body -->
            <div class="modal-body">
              <div class="container">
                <div class="row">
                  <div class="col-md-12">
                    <div class="details-line" v-if="selectedOrg.tax_number"><span class="details-line-title">Adószám:</span> {{ selectedOrg.tax_number }}</div>
                    <div class="details-line" v-if="selectedOrg.city && selectedOrg.county_registered"><span class="details-line-title">A cég székhelye (város és megye):</span> {{ selectedOrg.city }} - {{ selectedOrg.county_registered }}</div>
                    <div class="details-line" v-if="selectedOrg.most_recent_employees"><span class="details-line-title">Alkalmazottak száma, 2021 (fő):</span> {{ selectedOrg.employees_2021 }}</div>
                    <div class="details-line" v-if="selectedOrg.amount_won_18_20"><span class="details-line-title">A közbeszerzésen elnyert összeg, 2018-2020 (million Ft):</span> {{ formatModalAmount(shortenNumber(selectedOrg.amount_won_18_20)) }}</div>
                    <div class="details-line" v-if="selectedOrg.single_bids_number"><span class="details-line-title">Egyedül elnyert eljárások száma, 2018-2020 (db):</span> {{ selectedOrg.single_bids_number}}</div>
                    <div class="details-line" v-if="selectedOrg.consortium_number"><span class="details-line-title">Konzorciumban nyert eljárások száma, 2018-2020 (db):</span> {{ selectedOrg.consortium_number}}</div>
                    <div class="details-line" v-if="selectedOrg.notes"><span class="details-line-title">Megjegyzés:</span> {{ selectedOrg.notes }}</div>
                    <div class="details-line" v-if="selectedOrg.risk_indicators_list_strings && selectedOrg.risk_indicators_list_strings.length > 0"><span class="details-line-title details-line-title-red">Red flagek (figyelmeztető jelzések):</span> {{ selectedOrg.risk_indicators_list_strings.join('; ') }}</div>
                  </div>
                  <!-- Tenders table -->
                  <div class="col-md-12">
                    <div class="tenders-table-title">Eljárások</div>
                    <table id="modalTendersTable" class="tenders-table">
                      <thead>
                        <tr><th>Cím</th><th>Dátum</th><th>Ajánlatkérő szervezet neve</th><th>A szerződés egy cégre jutó értéke</th><th>Partnercégek neve neve (konzorcium esetén)</th><th>A konzorcium által elnyert teljes érték</th></tr>
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

    <script src="static/organizations.js?v=4"></script>

 
</body>
</html>