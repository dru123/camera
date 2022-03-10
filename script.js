let video = document.querySelector("video");
let recordbtn = document.querySelector(".record");
let clickbtn = document.querySelector(".click");
let filters = document.querySelectorAll(".filter-container>*");
let filterLayout = document.querySelector(".filter-layout");
let zoomIn = document.querySelector(".plus");
let zoomOut = document.querySelector(".minus");
let gallery = document.querySelector(".gallery-icon");
let galleryContainer = document.querySelector(".gallery");
let videoContainer = document.querySelector(".video-container");
let back = document.querySelector(".back");
let gallerydata = document.querySelectorAll(".gallery-media-container");
let scaleUp = 1;
let recordflag = false;
let recording = [];
let constraints = {
  video: true,
  audio: false,
};
let mediadeviceObjectofCurrStream;
let filter = "";
let counter = 0;
let timer = document.querySelector(".timer");
//navigator->navigator is the object of browser through which we can use browser API
//just like document is for HTMLpage navigator is for browser
//mediadevices.getUserMedia->gives us stream of requestedmedia devices if user allows it returns a promise
//if user allowsit gives us the stream else if any error occur or user doesn'tallow it gives error
let streamPromise = navigator.mediaDevices.getUserMedia(constraints);
streamPromise
  .then(function (stream) {
    video.srcObject = stream;
    mediadeviceObjectofCurrStream = new MediaRecorder(stream);
    //every time when data is available this event will be fired and push data in recording array
    //data of video stream is available in chunks
    mediadeviceObjectofCurrStream.ondataavailable = function (e) {
      recording.push(e.data);
    };
    //this event is fired when recording is stopped
    mediadeviceObjectofCurrStream.onstop = function (e) {
      const blob = new Blob(recording, { type: "video/mp4" }); //new Blob(recording, { type: 'video/mp4' });
      addMediaToGallery(blob, "video");
      /* const url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "file.mp4";
        a.click();
        a.remove();*/
      recording = [];
    };
  })
  .catch(function (e) {
    console.log(e);
    alert("error occured please allow video and audio");
  });
recordbtn.addEventListener("click", function () {
  if (mediadeviceObjectofCurrStream === undefined) {
    alert("please select the audio and video device");
    return;
  }
  if (recordflag == false) {
    //this will start the recording
    recordbtn.classList.add("record-animation");
    mediadeviceObjectofCurrStream.start();

    startTimer();
  } else {
    //this will stop the recording
    recordbtn.classList.remove("record-animation");
    mediadeviceObjectofCurrStream.stop();
    timer.style.display = "none";
    stopTimer();
  }
  recordflag = !recordflag;
});
for (let i = 0; i < filters.length; i++) {
  filters[i].addEventListener("click", function () {
    filter = filters[i].style.backgroundColor;
    filterLayout.style.backgroundColor = filter;
    filterLayout.style.display = "block";
  });
}
//to capture image draw image on canvas and download it
clickbtn.addEventListener("click", function () {
  let canvas = document.createElement("canvas");
  clickbtn.classList.add("click-animation");
  setTimeout(function () {
    clickbtn.classList.remove("click-animation");
  }, 1000);
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  let tool = canvas.getContext("2d");
  tool.scale(scaleUp, scaleUp);

  const x = (tool.canvas.width / scaleUp - video.videoWidth) / 2;
  const y = (tool.canvas.height / scaleUp - video.videoHeight) / 2;
  //  this will pick the frame from video at the time when click btn is clicked
  tool.drawImage(video, 0, 0);
  //if we apply filter we have to apply it on canvas also so that our image can get that filter
  //filter visible on UI is on the layer(filter-layout)
  if (filter) {
    tool.fillStyle = filter;
    tool.fillRect(0, 0, canvas.width, canvas.height);
  }
  let url = canvas.toDataURL();
  addMediaToGallery(url, "image");
  /* let a=document.createElement("a");
    a.download="image.jpeg";
    a.href=url;
    a.click();
    a.remove();
    canvas.remove();*/
});
//*************Timer******************
let clearObj;
function startTimer() {
  timer.style.display = "block";
  function fn() {
    let hours = Number.parseInt(counter / 3600);
    let remSeconds = counter % 3600;
    let minutes = Number.parseInt(remSeconds / 60);
    let seconds = remSeconds % 60;
    hours = hours < 10 ? `0${hours}` : `${hours}`;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    timer.innerText = `${hours}:${minutes}:${seconds}`;
    counter++;
  }
  clearObj = setInterval(fn, 1000);
}
function stopTimer() {
  timer.style.display = "none";
  clearInterval(clearObj);
}
/**********-zoom-in-zoom-out***************/
zoomIn.addEventListener("click", function () {
  if (scaleUp < 1.7) {
    scaleUp += 0.1;
    video.style.transform = `scale(${scaleUp})`;
  }
});
zoomOut.addEventListener("click", function () {
  if (scaleUp > 1) {
    scaleUp -= 0.1;
    video.style.transform = `scale(${scaleUp})`;
  }
});
gallery.addEventListener("click", function () {
  galleryContainer.style.display = "flex";
  videoContainer.style.display = "none";
  getMediaOnGallery();
});
back.addEventListener("click", function () {
  galleryContainer.style.display = "none";
  videoContainer.style.display = "block";
});
