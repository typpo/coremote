function post(url, data) {
  fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function captureImage() {
  var video = document.querySelector('video');
  var canvas = document.createElement('canvas');
  const scale = 320 / video.videoWidth;
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  var img = document.getElementById('me');
  var imgData = canvas.toDataURL('image/jpeg', 0.7);
  img.src = imgData;
  post('/api/image', {
    val: imgData,
  });
}

// Note that this won't work on Firefox unless the tab is focused:
// https://bugzilla.mozilla.org/show_bug.cgi?id=1195654
navigator.mediaDevices
  .getUserMedia({
    video: true,
  })
  .then(function(mediaStream) {
    var video = document.querySelector('video');
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
      var count = 0;
      setTimeout(function() {
        // Initial image capture is delayed slightly. Mac video feed doesn't
        // start immediately.
        captureImage();
      }, 100);
      setInterval(function() {
        count += 100;
        document.querySelector('#me-container .progress-image').style.width =
          (count / 10000) * 100 + '%';
        if (count === 10000) {
          captureImage();
          count = 0;
        }
      }, 100);
    };
  })
  .catch(function(err) {
    console.error(err);
  });

var statusElt = document.getElementById('status');
var moodElt = document.getElementById('mood');
var joinElt = document.getElementById('join');

statusElt.onchange = function(e) {
  post('/api/status', {
    val: statusElt.value,
  });
};

moodElt.onchange = function(e) {};

joinElt.onclick = function() {
  // temporary test handler
  fetch('/api/people')
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      var othersElt = document.getElementById('others');
    });
};
