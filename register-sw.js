/* Ampidiro amin'ny faran'ny <body> ao amin'ny index.html SY tefy.html:
   <script src="register-sw.js"></script>  */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .catch(err => console.warn('SW tsy voasoratra:', err));
  });
}
