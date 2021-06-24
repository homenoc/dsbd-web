import {enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

declare const require;

const translationProviders = (() => {
  const browserLanguage: string = (() => {
    console.log(navigator.languages);
    if (navigator.languages.length > 0) {
      return navigator.languages[0];
    }
    if (navigator.language) {
      return navigator.language;
    }
    return 'en';
  })();
  console.log(browserLanguage);

  if (browserLanguage.match(/^ja$|^ja-/)) {
    const translations = require('raw-loader!./locale/messages.ja.xlf');
    return [
      {provide: TRANSLATIONS, useValue: translations},
      {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
    ];
  }
})();

platformBrowserDynamic().bootstrapModule(AppModule, {providers: [].concat(translationProviders)})
  .catch(err => console.error(err));
