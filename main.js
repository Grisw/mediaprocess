async function getBeforeVideo() {
  const beforeVideo = document.getElementById('before');
  const beforeStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
  beforeVideo.srcObject = beforeStream;
  beforeVideo.play();
  return beforeVideo;
}

function getAfterStream() {
  const afterVideo = document.getElementById('after');
  const afterStream = new MediaStream();
  afterVideo.srcObject = afterStream;
  afterVideo.play();
  return afterStream;
}

async function main() {
  const beforeVideo = await getBeforeVideo();
  const afterStream = getAfterStream();
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

main().catch(error => console.error(error));
