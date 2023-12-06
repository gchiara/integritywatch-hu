<html lang="en">
<head>
    <?php include 'gtag.php' ?>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Integrity Watch Hungary</title>
    <title>Tenderbajnok</title>
    <meta property="og:url" content="https://tenderbajnok.transparency.hu/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Tenderbajnok" />
    <meta property="og:description" content="Tenderbajnok" />
    <meta property="og:image" content="https://tenderbajnok.transparency.hu/images/thumbnail.jpg" />
    <link rel='shortcut icon' type='image/x-icon' href='/favicon.ico' />
    <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Quicksand:500" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="static/landing.css?v=2">
</head>
<body>
    <div id="app">  
      <?php include 'header.php' ?> 
      <!-- TOP AREA -->
      <div class="container-fluid top-box-landing" style="background-image:url('./images/landing-bg-hu.jpg')">
        <div class="row">
          <div class="col-md-12 top-description-content">
            <div class="top-description-text">
              <h1>Tenderbajnok</h1>
              <p>A Transparency International (TI) Magyarország kizárólag nyilvános adatokra épülő projektje bemutatja a közpénzt elnyerő cégeket, közbeszerzési tevékenységüket, eredményüket, tulajdonosi hátterüket és közhatalmi kapcsolataikat, hogy ezzel online eszközt biztosítson a politikai korrupció felderítésére és megelőzésére. A tisztességes verseny elősegítése érdekében red flagekkel jelöltük azon kirívó értékű mutatókat, amelyek, habár nem jelentenek bizonyítékot bűncselekményre, azonban növelik a korrupciós vagy más visszaélésekkel kapcsolatos kockázatokat.</p>
              <a href="about.php" class="read-more-btn">Az oldalról <i class="material-icons">chevron_right</i> </a>
            </div>
          </div>
        </div>
      </div>
      <!-- CONTENT BOXES --> 
      <div class="container">
        <div class="panel-group" id="accordion">
          <!-- BLOCK 1 -->
          <div class="panel panel-default panel-static">
            <div class="panel-heading">
              <h2 class="panel-title">Mi látható az oldalon?</h2>
            </div>
            <div id="contact" class="panel-collapse">
              <div class="panel-body">
              <p>Az oldalon olyan cégek szerepelnek, amelyeknek a fő bevételi forrásai az elnyert közbeszerzésekből származnak. A legfrissebb adatsorban azon cégek adatait dolgoztuk fel, amelyek esetében a 2019-ben, 2020-ban és 2021-ben összesen elnyert közbeszerzések összértéke meghaladta a 2022-es (minimum 100 millió forintos) nettó árbevételük 50%-át. Az összehasonlításban azért szerepelnek különböző időszakok, mivel az elnyert közbeszerzések értéke gyakorta csak a közbeszerzés eredményének kihirdetését követő években, a megbízás megvalósítását követően jelenik meg a cégek eredményében. Az eredmények a közbeszerzéseket elnyerő cégek, illetve a vizsgált vállalatok végső tulajdonosai szerint is lekérdezhetőek.</p>
              <div class="landing-section-buttons-container">
                <a href="./organizations.php" class="landing-sections-button">Cégek és közbeszerzések <i class="material-icons">chevron_right</i></a>
                <a href="./beneficial_owners.php" class="landing-sections-button">Végső tulajdonosok <i class="material-icons">chevron_right</i></a>
              </div>
            </div>
            </div>
          </div>
          <!-- BLOCK 2 -->
          <div class="panel panel-default panel-static">
            <div class="panel-heading">
              <h2 class="panel-title">Hogyan használható?</h2>
            </div>
            <div id="contact" class="panel-collapse">
              <div class="panel-body">
              <p>A grafikonok, táblázatok elemeire kattintva rangsorolhatóak és szűrhetőek az adatok, minden ábra a kiválasztáshoz idomul. Az interaktív eszköz használatához az alábbi videó nyújt segítséget.</p>
              <iframe class="landing-video" src="https://www.youtube.com/embed/6nfTWgFMWVc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
            </div>
          </div>


        </div>
      </div>
    </div>
    <script src="static/landing.js?v=1"></script>
</body>
</html>