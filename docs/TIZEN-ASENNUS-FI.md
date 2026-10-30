# Fiishani AI Home 3D – Samsung M8

Nykyistä projektia jatkava Tizen TV -sovelluksen valmistelu, 31.10.2026.
Malli LS32BM801UUXEN (M80B). M8:n tarkkaa TV SDK -tukea tai laiteohjelmiston
Tizen-versiota ei ole vahvistettu laitteella. TV-ohjeista ei voi päätellä,
että jokainen Smart Monitor hyväksyy kehittäjäasennuksen. Ensimmäinen portti
on Developer Mode ja onnistunut yhteys Tizen Studio Device Manageriin.
Jos kehittäjätila ei avaudu, älä käytä huoltovalikkoa tai muuta piiloasetuksia.
Ilmoita näkyvä valikko ja ohjelmistoversio jatkoselvitykseen.

## 1. Tarkista näytöllä nyt

- Yhdistä M8 ja Windows samaan kotiverkkoon.
- Avaa M8:n Home > Apps / Sovellukset. Samsungin nykyinen TV-ohje neuvoo
  avaamaan Apps Settings / Sovellusasetukset ja syöttämään `12345`
  kaukosäätimen numeronäppäimistöllä. Vanhemmassa käyttöliittymässä sarja
  syötetään suoraan Apps-näkymässä.
- Jos Developer Mode -ikkuna avautuu, kytke se päälle. Windowsin `ipconfig`
  näyttää käytössä olevan Wi-Fi/Ethernet-yhteyden IPv4-osoitteen: kirjoita
  tämä tietokoneen osoite näytön Developer Mode -kohtaan.
- Käynnistä näyttö uudelleen. Tarkista Develop Mode -merkintä.

## 2. Windowsin ilmaiset työkalut

VS Code sopii koodin muokkaamiseen. Se ei yksin allekirjoita/asennna TV-sovellusta.
Asenna Tizen Studio Samsungin virallisen ohjeen kautta:
https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/installing-tv-sdk.html

Package Manager > Extension SDK: Samsung TV Extensions ja Samsung Certificate
Extension. Käytä nykyistä Certificate Extension -versiota: Samsungin mukaan
alle 2.0.73 -versioilla varmenteiden luonti ei enää onnistu syyskuun 2025 jälkeen.
Älä osta lisäosia.

## 3. Laiteyhteys ja allekirjoitus

Tizen Studio > Tools > Device Manager > Remote Device Manager > +:
M8:n oma IP-osoite (näytön verkkoasetuksista), portti 26101. Connection On.
Älä avaa portteja internetiin. Tietokoneen ja M8:n IP-osoitteet ovat eri asioita.
Jos Windows kysyy, salli työkalun yhteys vain luotetussa kotiverkossa.

Tools > Certificate Manager > uusi Samsung TV -profiili. Kirjaudu omalle
Samsung-kehittäjätilillesi. Luo author- ja distributor-varmenne, public-oikeustaso,
sekä lisää yhdistetyn M8:n DUID. Säilytä author-varmenne ja salasana itse
myös myöhempiä päivityksiä varten. Älä lähetä salasanaa tai .p12-tiedostoja
chattiin tai GitHubiin. Device Managerissa voi olla tarpeen valita laitteen
pikavalikosta Permit to install applications.

## 4. Rakenna ja asenna

Lataa projektin `feat/tizen-m8`-haara (tai PR:n yhdistämisen jälkeen main).
Jos Python on asennettu, suorita projektin juuressa:

```powershell
python tools/prepare_tizen.py
```

Tämä luo `dist/tizen`-hakemiston ja **allekirjoittamattoman**
`dist/FiishaniAIHome3D-unsigned.wgt`-paketin. Tämä WGT ei ole vielä asennettava.
Ilman Pythonia tee tyhjä kansio ja kopioi siihen vain index.html, config.xml,
icon.png ja js-kansio.

Tizen Studio: File > Import > Tizen > Tizen Project (valikon nimi voi vaihdella)
ja valitse valmisteltu kansio. Jos import ei tunnista kansiota, luo Samsung TV
Basic Web Application -projekti ja korvaa sen sisältö näillä tiedostoilla.
Valitse oma Samsung-varmenneprofiilisi aktiiviseksi, sitten Build Project ja
Run As > Tizen Web Application yhdistetylle M8:lle. Tämä rakentaa, allekirjoittaa
ja asentaa. Emulaattorin onnistuminen ei vahvista M8-yhteensopivuutta.

Vaihtoehtoisesti Tizen CLI (tizen.bat on SDK:n tools/ide/bin-hakemistossa):

```powershell
tizen build-web -- .\dist\tizen
tizen package -t wgt -s OMA_PROFIILIN_NIMI -- .\dist\tizen\.buildResult
```

Käytä Certificate Managerin todellista profiilinimeä. SDK:n asennus/pakettitarkistus
voi paljastaa vielä laitekohtaisia vaatimuksia; SDK ei ole ollut käytettävissä
tässä valmisteluympäristössä. WGT:tä ei voi asentaa kuluttajalaitteeseen
kopioimalla sitä USB-tikulle.

## 5. Mitä testataan M8:ssa

- Näkymä täyttää näytön, tekstit ja lasimainen ulkoasu näkyvät oikein.
- Nuolet siirtävät kohdistusta, OK avaa kohteen, Return piilottaa oman
  sovelluksen. Kielipainike saa alkukohdistuksen. Select-valikossa ylös/alas
  vaihtaa laskentatapaa, vasen/oikea siirtyy pois; Return palauttaa kielipainikkeelle.
- Suomen/somalin valinta ja laskentatapa säilyvät uudelleenkäynnistyksessä.
- Viisi aikaa tulee AlAdhanista Helsingin päivälle. Ne ovat laskennalliset,
  eivät moskeijan vahvistama aikataulu; vertaa oman moskeijan aikoihin.
- Sekuntilaskuri siirtyy seuraavaan rukoukseen ja Ishan jälkeen huomisen Fajriin.
  Keskiyö, verkkokatko ja paluu toisesta sovelluksesta pitää kokeilla.
- Asennetut sovellukset tulevat getAppsInfo-rajapinnasta, niiden nimet,
  tunnisteet ja kuvaketiedostot säilytetään. launch käyttää todellista ID:tä.
  Osa järjestelmä- tai kumppanisovelluksista voi puuttua tai estää avauksen.
  Kuvaketiedoston näyttö voi myös olla laitteella estetty. Avaa silloin
  alkuperäinen sovellus kaukosäätimen Home-valikosta. Sovellus ei muuta,
  poista tai korvaa Samsungin sovelluksia tai niiden kuvakkeita.
- Selaimessa Tizen-rajapintoja ei ole: siellä vanhat verkkolinkit säilyvät.
  Suoratoiston verkkosivu ei takaa toimivaa TV-toistoa. Käytä M8:ssa alkuperäisiä sovelluksia.

## 6. Käynnistyminen virran kytkennän jälkeen

Tämä sovellus ei korvaa Smart Hubia eikä kaappaa Home-painiketta. Julkisilla
TV-rajapinnoilla ei toteuteta taattua käynnistymistä virrankytkennästä.
Vanha prelaunch-määritys tarkoittaa taustalatausta, eikä se ole Samsungin
mukaan tuettu vuoden 2019 ja uudemmissa televisioissa.

Jos M8:n asetuksissa näkyy Aloitusnäytön asetukset / Start Screen Options /
Smart Features > Autorun Last App / Suorita viimeisin sovellus automaattisesti,
voit kokeilla sitä: avaa Fiishani-sovellus viimeiseksi, sammuta ja käynnistä.
Toista koe kylmäkäynnistyksellä sekä toisen sovelluksen käytön jälkeen.
Asetuksen löytymistä ja toimintaa itse asennetulle sovellukselle ei ole vahvistettu.
Jos se toimii, käynnistys seuraa viimeksi käytettyä sovellusta; se ei lukitse
Fiishania aina aloitusnäkymäksi. Vaihtoehtona pidä Fiishani helposti saatavilla
Smart Hubissa, jos Lisää aloitusnäyttöön -toiminto on käytettävissä.

## Lähteet

- Mallin tukisivu: https://www.samsung.com/fi/support/model/LS32BM801UUXEN/
- Kehittäjätila/yhteys: https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html
- Varmenteet: https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html
- Pakkaus: https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/command-line-interface.html
- Sovellusrajapinta: https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html
- USB-rajoitukset: https://developer.samsung.com/smarttv/develop/faq/application-installation.html
- Prelaunch: https://developer.samsung.com/smarttv/develop/guides/fundamentals/prelaunching-applications.html
- Last app: https://www.samsung.com/ae/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/
