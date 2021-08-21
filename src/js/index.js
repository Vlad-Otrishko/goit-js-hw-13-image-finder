import galleryTmpl from "../templates/gallery.hbs";
import apiService from "./apiService.js";
import * as basicLightbox from "basiclightbox";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import {
  alert,
  notice,
  info,
  success,
  error,
  defaultModules,
} from "@pnotify/core";
import "animate.css";


const searchFormRef = document.querySelector("#search-form");
const galleryContainerRef = document.querySelector(".gallery");
const galleryApi = new apiService();


searchFormRef.addEventListener('submit', onSubmit);
galleryContainerRef.addEventListener("click", displayBigImage);

// declare Instance of Intersection observer, for further using infinite scroll
const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          displayResult();
}
      });
    },
    {rootMargin:'200px',
      threshold: 1,
    }
);


function onSubmit(e) {
  e.preventDefault();
  if (
    e.currentTarget.elements.query.value === "" ||
    e.currentTarget.elements.query.value===" "
  ) {return notice({
    text: "YOU DID NOT INPUT ANY WORD",
    addClass: "animate__animated animate__rubberBand",
    delay: "2500"
  });
  }

  galleryContainerRef.innerHTML = ""; // sweep gallery
  galleryApi.searchReset(); //resets page to No1
  galleryApi.searchRequest = e.currentTarget.elements.query.value;  //transmits search query from input to apiService instance
  displayResult;
  observer.observe(document.querySelector("#infinite-target")); // tells to observer to watch over div placed below the created gallery

}
 // read data from storage, checks for unmatching requests and end of data, displays in browser  
function displayResult() {

  galleryApi.fetchCards().then((data) => {
    if (data.length < 1) {
      observer.unobserve(document.querySelector("#infinite-target"));// removing observation from target element after wron search query
      return noMatch();
 }
    if (galleryApi.totalFound < galleryApi.page * 12) {
      return reportEnd();
    }
    buildGallery(data);
  })
    .catch(err => console.log(err));
}

    //create markup through Handlebar template
function buildGallery(data) {
      galleryContainerRef.insertAdjacentHTML("beforeend", galleryTmpl(data));
    }

    // modal window with big image
    function displayBigImage(event) {
      const instance = basicLightbox.create(
        `<img src='${event.target.attributes[2].value}'>`
      );
      instance.show();
}
//functions of creating messages on the 'no match' or 'end of content' result
function reportEnd() {
         success({
      text: "ALL PICTURES ARE SHOWN",
      addClass: "animate__animated animate__heartBeat",
      delay: "2500",
         });
}
function noMatch() {
    info({
      text: "SORRY, MO MATCH FOR YOUR REQUEST",
      addClass: "animate__animated animate__heartBeat",
      delay: "2500",
    });
}
