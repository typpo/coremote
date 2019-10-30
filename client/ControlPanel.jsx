import React from 'react';
import PropTypes from 'prop-types';

import { post } from './util';

const IMAGE_REFRESH_MS = 10000;
const IMAGE_WIDTH_PX = 320;
const IMAGE_QUALITY = 0.7;

function captureImage() {
  var video = document.querySelector('video');
  var canvas = document.createElement('canvas');
  const scale = IMAGE_WIDTH_PX / video.videoWidth;
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

  // TODO(ian): Hacky
  var img = document.getElementById('me');
  var imgData = canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
  img.src = imgData;
  post('/api/image', {
    val: imgData,
  });
}

function startCamera() {
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
          // TODO(ian): Hacky
          const progressBar = document.querySelector('#me-container .progress-image');
          progressBar.style.width =
            (count / IMAGE_REFRESH_MS) * 100 + '%';
          if (count >= IMAGE_REFRESH_MS) {
            captureImage();
            count = 0;
          }
        }, 100);
      };
    })
    .catch(function(err) {
      console.error(err);
    });
}

class ControlPanel extends React.Component {
  constructor() {
    super();

    this.onStatusChange = this.onStatusChange.bind(this);
    this.onMoodChange = this.onMoodChange.bind(this);
    this.onJoin = this.onJoin.bind(this);
  }

  onStatusChange(e) {
    post('/api/status', {
      val: e.target.value,
    });
  }

  onMoodChange(e) {
    post('/api/mood', {
      val: e.target.value,
    });
  }

  onJoin(e) {
    e.target.style.display = 'none';
    startCamera();
  }

  render() {
    const { status, mood } = this.props;
    console.log(this.props)
    return (
      <div className="top">
        <div className="summary-container">
          <div className="summary">
            Welcome to online coworking. There's no point, except to work while others work.  Snacks are in the kitchen.
          </div>
        </div>
        <div className="controls">
          <div className="control">
            <input id="status" className="input-status" type="text" placeholder="What are you working on?" defaultValue={status} onChange={this.onStatusChange} />
          </div>
          <div className="control">
            <select id="mood" className="select-mood" defaultValue={mood} onChange={this.onMoodChange}>
              <option value="">Feeling...</option>
              <option value="PRODUCTIVE">✍️ Productive</option>
              <option value="THOUGHTFUL">🤔 Thoughtful</option>
              <option value="HAPPY">😁 Happy</option>
              <option value="SAD">😢 Sad</option>
              <option value="ANXIOUS">😟 Anxious</option>
              <option value="EXCITED">🤩 Excited</option>
              <option value="BORED">🤤 Bored</option>
              <option value="ENNUI">❓ Ennui</option>
            </select>
          </div>
          <div className="control">
            <button className="btn-join" onClick={this.onJoin}>Start Coworking</button>
          </div>
        </div>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  status: PropTypes.string,
  mood: PropTypes.string,
};

export default ControlPanel;
