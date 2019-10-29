function captureImage() {
  var scale = 1.0;
  var video = document.querySelector('video');
  var canvas = document.createElement('canvas');
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
  canvas.getContext('2d')
    .drawImage(video, 0, 0, canvas.width, canvas.height);

  var img = document.getElementById('me');
  img.src = canvas.toDataURL();
}

navigator.mediaDevices.getUserMedia({ video: true })
.then(function(mediaStream) {
  /* use the stream */
  var video = document.querySelector('video');
  video.srcObject = mediaStream;
  video.onloadedmetadata = function(e) {
    video.play();
    captureImage();
    var count = 0;
    setInterval(function() {
      count += 100;
      document.querySelector('#me-container .progress-image').style.width = (count / 10000 * 100) + '%';
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
