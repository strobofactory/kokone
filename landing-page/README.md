# Kokone landing page

Production domain: https://kokone.hapiveri.com
Source: strobofactory/kokone, main branch, landing-page/
Hosting: Vercel, strobofactorys-projects team, kokone project.

## Deployment
Framework: Other (no framework). Root Directory: landing-page.
Build command: empty. Install command: empty. Output Directory: dist.
Pushing main deploys the checked-in dist directory automatically.
The repository root index.html is the existing privacy policy and must be preserved.

## Editing
Edit i18n/ja.html and UTF-8 catalogs i18n/{en,es,zh,ko}.txt.
Run `python scripts/build-locales.py` and commit regenerated dist pages.
Shared CSS and JavaScript are in dist. Images are local WebP files.
Languages: Japanese /, English /en/, Spanish /es/, Simplified Chinese /zh/, Korean /ko/.
A saved language choice is restored on the root page. Explicit locale URLs take precedence.
App screenshots remain Japanese; the LP notes this. No change to the iOS app.

## Validation
HTML local assets and anchors validated; JavaScript syntax checked.
Language routing checked, including unavailable local storage.
No browser visual verification was available during the original build.
