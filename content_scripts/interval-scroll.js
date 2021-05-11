(function() {

  if (window.hasRun) {
    return;
  }

  window.hasRun = true;
  window.intervalScrollDelay = null;

  function scroll(interval, pixels) {
    if (window.intervalScrollDelay) {
      clearTimeout(window.intervalScrollDelay);
    }
    window.scrollBy({
      left: 0, 
      top: pixels,
      behavior: 'smooth'
    });
    window.intervalScrollDelay = setTimeout(function() {
      scroll(interval, pixels);
    }, interval*1000);
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command == 'start-interval-scroll') {
      scroll(message.interval, message.pixels);
    } else if (message.command == 'stop-interval-scroll' && window.intervalScrollDelay) {
      clearTimeout(window.intervalScrollDelay);
    }
  });

})();