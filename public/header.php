<nav class="navbar navbar-expand-lg navbar-light bg-light" id="iw-nav">
  <a class="navbar-brand" href="https://transparency.hu/" target="_blank"><img src="./images/logo-hu.png" alt="" /> </a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a href="./" class="nav-link nav-link-section" :class="{active: page == 'landing'}">Tenderbajnok</a>
      </li>
      <li class="nav-item">
        <a href="./organizations.php" class="nav-link nav-link-section" :class="{active: page == 'organizations'}">Cégek és közbeszerzések</a>
      </li>
      <li class="nav-item">
        <a href="./beneficial_owners.php" class="nav-link nav-link-section" :class="{active: page == 'owners'}">Végső tulajdonosok</a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a href="./about" class="nav-link nav-link-about" :class="{active: page == 'about'}">Az oldalról</a>
      </li>
    </ul>
  </div>
</nav>