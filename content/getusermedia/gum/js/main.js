/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: { facingMode: { exact: "environment" } }
};

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    let v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const afterStream = new MediaStream();
    processStream(stream, afterStream);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

async function processStream(beforeVideo, afterStream) {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const process = () => {
    canvas.width = beforeVideo.videoWidth;
    canvas.height = beforeVideo.videoHeight;
    context.drawImage(beforeVideo, 0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgb(0, 0, 0)';
    context.fillRect(150, 125, canvas.width - 300, 50);
    const bufferStream = canvas.captureStream();
    const tracks = bufferStream.getVideoTracks();
    for (const track of tracks) {
      afterStream.addTrack(track);
    }
    requestAnimationFrame(process);
  };
  process();
}

document.querySelector('#showVideo').addEventListener('click', e => init(e));