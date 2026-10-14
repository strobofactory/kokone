"""Generate static locale pages. Edit i18n/ja.html and the parallel UTF-8 catalogs."""
import json,re,html
from pathlib import Path
root=Path(__file__).resolve().parents[1]
source=(root/'i18n/ja.html').read_text()
strings=json.loads((root/'i18n/source-strings.json').read_text())
langs={'ja':'日本語','en':'English','es':'Español','zh':'简体中文','ko':'한국어'}
labels={'ja':['今日を残す','気持ちに気づく','日々を振り返る'],'en':['Capture your day','Notice your feelings','Look back'],'es':['Guarda tu día','Observa tus emociones','Mira atrás'],'zh':['留下今天','看见心情','回顾日常'],'ko':['오늘을 남기기','마음 알아보기','일상 돌아보기']}
notes={'ja':'掲載画面は日本語版です。アプリの対応言語はApp Storeでご確認ください。','en':'Screens shown are in Japanese. Check the App Store for languages supported by the app.','es':'Las pantallas se muestran en japonés. Consulta los idiomas de la app en el App Store.','zh':'展示画面为日语版。应用支持的语言请以 App Store 为准。','ko':'화면은 일본어 버전입니다. 앱 지원 언어는 App Store에서 확인해 주세요.'}
for locale in langs:
    page=source
    if locale!='ja':
        translated=(root/f'i18n/{locale}.txt').read_text().splitlines()
        assert len(translated)==len(strings),(locale,len(translated),len(strings))
        mapping=dict(zip(strings,translated))
        pattern=re.compile('|'.join(re.escape(s) for s in sorted(strings,key=len,reverse=True)))
        page=pattern.sub(lambda m:html.escape(mapping[m.group()],quote=True),page)
        if locale in ('en','es'): page=page.replace('<br>','<br> ')
        page=page.replace('lang="ja"',f'lang="{"zh-Hans" if locale=="zh" else locale}"')
        page=page.replace('https://apps.apple.com/jp/app/','https://apps.apple.com/app/')
    # Root-absolute asset paths work from every localized route.
    page=re.sub(r'((?:src|href|data-zoom)=")((?:assets/)[^"]+|styles\.css|script\.js)',r'\1/\2',page)
    nav='<div class="nav-actions"><details class="language-menu"><summary aria-label="Language / 言語">'+langs[locale]+' <span aria-hidden="true">⌄</span></summary><div class="language-options">'
    for code,name in langs.items():
        route='/' if code=='ja' else f'/{code}/'
        nav+=f'<a href="{route}" lang="{code}" hreflang="{code}" data-language="{code}"'+(' aria-current="page"' if code==locale else '')+'>'+name+'</a>'
    nav+='</div></details>'
    page=page.replace('<a class="nav-cta"',nav+'<a class="nav-cta"',1).replace('</a></header>','</a></div></header>',1)
    page=page.replace('</main><footer>',f'<p class="locale-note">{notes[locale]}</p></main><footer>')
    page=page.replace('<head>','<head>\n<script src="/language.js"></script>')
    page=page.replace('<body>',f'<body data-story-labels="{html.escape(json.dumps(labels[locale],ensure_ascii=False),quote=True)}">')
    links=''.join(f'<link rel="alternate" hreflang="{"zh-Hans" if c=="zh" else c}" href="https://kokone.hapiveri.com/{"" if c=="ja" else c+"/"}">' for c in langs)
    page=page.replace('</head>',links+'</head>')
    path=root/'dist'/('index.html' if locale=='ja' else f'{locale}/index.html')
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(page)
print('Built 5 language pages; translated strings per locale:',len(strings))
