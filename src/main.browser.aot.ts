import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core'; 
import { AppModuleNgFactory } from '../compiled/src/app/app.module.ngfactory';

export const platformRef = platformBrowser();

export function main(): Promise<any> {
  if( webpack.enableProdMode ) {
    enableProdMode();
  }
  return platformRef
    .bootstrapModuleFactory(AppModuleNgFactory)
    .catch(err => console.error(err));
}

// support async tag or hmr
switch (document.readyState) {
  case 'interactive':
  case 'complete':
    main();
    break;
  case 'loading':
  default:
    document.addEventListener('DOMContentLoaded', () => main());
}
