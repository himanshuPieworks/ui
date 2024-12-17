import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/assets/sw-custom.js')
//         .then(registration => {
//           console.log('Custom Service Worker registered with scope:', registration.scope);
//         })
//         .catch(err => {
//           console.error('Custom Service Worker registration failed:', err);
//         });
//     });
//   }

//   if ('serviceWorker' in navigator) {
    
//     navigator.serviceWorker.register('/assets/sw-custom.js');
//   }
  
  