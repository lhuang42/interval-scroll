function listenForClicks() {
  document.addEventListener("click", (e) => {

    function start(tabs) {
      var values = validate();

      browser.tabs.sendMessage(tabs[0].id, {
        command: 'start-interval-scroll',
        interval: values.interval,
        pixels: values.pixels
      });
    }

    function stop(tabs) {
      browser.tabs.sendMessage(tabs[0].id, {
        command: 'stop-interval-scroll'
      })
    }

    if (e.target.id == "interval-scroll-start") {
      browser.tabs.query({active: true, currentWindow: true})
        .then(start)
        .catch(reportError);
    } else if (e.target.id == "interval-scroll-stop") {
      browser.tabs.query({active: true, currentWindow: true})
        .then(stop)
        .catch(reportError);
    }

  })
}

function validate() {
  var intervalInput = document.querySelector('#interval-input');
  var pixelsInput = document.querySelector('#pixels-input');
  var interval = Number(intervalInput.value);
  var pixels = Number(pixelsInput.value);

  if (isNaN(interval)) {
    interval = 10;
    intervalInput.value = '10';
  }
  if (isNaN(pixels)) {
    pixels = 100;
    pixelsInput.value = '100'
  }
  var values = {interval: interval, pixels: pixels};
  browser.storage.local.set(values);
  return values;
}

function reportError(error) {
  console.error(`Could not autoscroll: ${error}`);
}

function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute interval-scroll content script: ${error.message}`);
}

///// init

browser.storage.local.get('interval').then(function(interval) {
  document.querySelector('#interval-input').value = interval.interval;
  validate();
}, function() {
  document.querySelector('#interval-input').value = '10';
});

var pixels = browser.storage.local.get('pixels').then(function(pixels) {
  document.querySelector('#pixels-input').value = pixels.pixels;
  validate();
}, function() {
  document.querySelector('#pixels-input').value = '100';
});

browser.tabs.executeScript({file: "/content_scripts/interval-scroll.js"})
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
