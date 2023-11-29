import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module'; 
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  const root = document.documentElement;

function setCustomColor(color:any) {
    root.style.setProperty('--DBlue', color);
}
  
setCustomColor('');