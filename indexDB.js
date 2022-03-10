let galleryDB;
let galleryDBobj = indexedDB.open("Gallery");
let download;
galleryDBobj.addEventListener("success", function () {
  galleryDB = galleryDBobj.result;
  // alert("success");
});
galleryDBobj.addEventListener("upgradeneeded", function () {
  galleryDB = galleryDBobj.result;
  galleryDB.createObjectStore("gallery", { keyPath: "mId" });
  // alert("upgradeneeded")
});
galleryDBobj.addEventListener("error", function () {
  // alert("error");
});
function addMediaToGallery(data, type) {
  let tx = galleryDB.transaction("gallery", "readwrite");
  let galleryStore = tx.objectStore("gallery");
  galleryStore.add({ mId: Date.now(), type, media: data });
}
function getMediaOnGallery() {
  let gallerydata = document.querySelectorAll(".gallery-media-container");
  for (let i = 0; i < gallerydata.length; i++) {
    gallerydata[i].remove();
  }
  let tx = galleryDB.transaction("gallery", "readonly");
  let galleryStore = tx.objectStore("gallery");
  let pendingmedia = galleryStore.openCursor();
  pendingmedia.addEventListener("success", function () {
    let cursor = pendingmedia.result;
    //console.log(cursor);
    if (cursor) {
      if (cursor.value.type == "video") {
        console.log(1);
        //video container which hold video and download ,delete option
        let vidContainer = document.createElement("div");
        vidContainer.setAttribute("class", "gallery-media-container");
        galleryContainer.appendChild(vidContainer);
        //video element to stream video from DB
        let vid = document.createElement("video");
        vid.setAttribute("class", "media-size");
        vidContainer.appendChild(vid);
        //download btn
        let downloadbtn = document.createElement("button");
        downloadbtn.classList.add("download");
        downloadbtn.classList.add("action-btn");
        downloadbtn.setAttribute("mId", cursor.value.mId);
        downloadbtn.innerText = "Download";
        downloadbtn.addEventListener("click", downloadMedia);
        //delete btn
        let deletebtn = document.createElement("button");
        deletebtn.classList.add("delete");
        deletebtn.classList.add("action-btn");
        deletebtn.setAttribute("mId", `${cursor.value.mId}`);
        deletebtn.addEventListener("click", deleteHandler);
        deletebtn.innerText = "Delete";
        vidContainer.appendChild(downloadbtn);
        vidContainer.appendChild(deletebtn);
        vid.controls = true;
        vid.autoplay = true;
        vid.loop = true;
        vid.src = window.URL.createObjectURL(cursor.value.media);
      } else {
        console.log(1);
        //image container which hold image and download ,delete option
        let imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "gallery-media-container");
        galleryContainer.appendChild(imgContainer);
        //image element to display image from DB
        let img = document.createElement("img");
        img.setAttribute("class", "media-size");
        imgContainer.appendChild(img);
        //download btn
        let downloadbtn = document.createElement("button");
        downloadbtn.classList.add("download");
        downloadbtn.classList.add("action-btn");
        downloadbtn.setAttribute("mId", cursor.value.mId);
        downloadbtn.innerText = "Download";
        downloadbtn.addEventListener("click", downloadMedia);
        //download btn
        let deletebtn = document.createElement("button");
        deletebtn.classList.add("delete");
        deletebtn.classList.add("action-btn");
        deletebtn.setAttribute("mId", `${cursor.value.mId}`);
        deletebtn.addEventListener("click", deleteHandler);
        deletebtn.innerText = "Delete";
        imgContainer.appendChild(downloadbtn);
        imgContainer.appendChild(deletebtn);
        img.src = cursor.value.media;
      }
      cursor.continue();
    }
  });
}
function deleteHandler(e) {
  let mId = e.currentTarget.getAttribute("mId");
  let tx = galleryDB.transaction("gallery", "readwrite");
  let galleryStore = tx.objectStore("gallery");
  mId = Number(mId);
  galleryStore.delete(mId);
  e.currentTarget.parentNode.remove();
}

function downloadMedia(e) {
  let link = e.currentTarget.parentNode.children[0].src;
  let a = document.createElement("a");
  console.log(e.currentTarget.parentNode.children[0].nodeName);
  if (e.currentTarget.parentNode.children[0].nodeName == "VIDEO") {
    a.download = "video.mp4";
  } else {
    a.download = "image.jpeg";
  }
  a.href = link;
  a.click();
  a.remove();
}
