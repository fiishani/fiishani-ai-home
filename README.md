# Fiishani AI Home 3D

Existing dark blue glass-style home page, now prepared as a Samsung Tizen TV web application.

- [Suomenkielinen Windows/M8-asennusohje](docs/TIZEN-ASENNUS-FI.md)
- Web preview: https://fiishani.github.io/fiishani-ai-home/
- Model: Samsung Smart Monitor M8 LS32BM801UUXEN. Developer installation support must still be verified on this actual device.

## Checks and package preparation

```sh
node --test tests/*.test.cjs
python tools/prepare_tizen.py
```

The generated `dist/FiishaniAIHome3D-unsigned.wgt` is an **unsigned preparation archive**, not an installable signed package. Sign `dist/tizen` using a Samsung TV certificate profile including your monitor's DUID. Never commit certificates or passwords.

Existing browser links remain available on the web. In Tizen, native apps are discovered from the device instead of using guessed app IDs. The original app icons are referenced without modification; availability and launch permissions require device testing.

No guaranteed power-on launch, no Smart Hub/Home replacement, no USB WGT installation. Try the device's last-app setting only if available.

## Verification limits (31 October 2026)

11 Node tests cover Helsinki winter/summer offsets, date rollover, stored language, rejected times/date responses, network failure, valid timing display/countdown state, next-day Fajr, installed app ID/icon mapping and API denial. API responses in tests are fixtures. Live AlAdhan access returned HTTP/API 200 for Helsinki on 31 October 2026 with all five valid prayer times. This does not verify the monitor’s own network/TLS access.

XML parsing, package ID length, required local content and archive integrity checked by the preparation script. JavaScript syntax checked using Node. No Tizen SDK, emulator or real M8 was available; no signed build or installation is claimed. Browser visual verification was attempted but could not run because the environment lacked a Chromium executable. Check remote navigation, rendering, TLS/API access and native launches on the monitor before relying on it.
