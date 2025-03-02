import { POINTS } from "./constants/points.js";
import { data } from "./constants/data.js";

const MAX_FRIENDS_ITEMS = 8; // max capacity of friends tray

const {friends, rating} = data;
const path = document.querySelector(".path");
const hero = document.querySelector(".hero");
const btnToUniversity = document.querySelector(".friends__button_touniversity");
const friendsButtonLeft = document.querySelector(".friends__button_left");
const friendsButtonRight = document.querySelector(".friends__button_right");
const btnScores = document.querySelector(".friends__button_scores");
const friendsContentItemsContainer = document.querySelector(".friends__content-items");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalExitButton = document.querySelector(".modal__exit-button");
const scoresContentItemsContainer = document.querySelector(".modal__content-items");

let friendsItemsOffset = 0;
let currentHeroPosition = 0;

btnToUniversity.addEventListener("click", handleToUniversityButtonClick);
friendsButtonLeft.addEventListener("click", handleFriendsLeftArrowClick);
friendsButtonRight.addEventListener("click", handleFriendsRightArrowClick);
btnScores.addEventListener("click", handleOpenScoresModal);

// moves hero to next pcheckoint
function handleToUniversityButtonClick() {
  currentHeroPosition < POINTS.length - 1
    ? currentHeroPosition++
    : (currentHeroPosition = 0);
  placeHero();
  btnToUniversity.disabled = true;
  setTimeout(() => {
    btnToUniversity.disabled = false;
  }, 1000);
}

// slides friends items by 1 to right if qty is over 8 pcs
function handleFriendsLeftArrowClick() {
  if (friendsItemsOffset > 0) {
    friendsItemsOffset--;
    friendsContentItemsContainer.style.left = `${friendsItemsOffset * -60}px`;
  }
}

// slides friends items by 1 to left if qty is over 8 pcs
function handleFriendsRightArrowClick() {
  if (
    friends.length > MAX_FRIENDS_ITEMS &&
    friends.length - friendsItemsOffset > MAX_FRIENDS_ITEMS
  ) {
    friendsItemsOffset++;
    friendsContentItemsContainer.style.left = `${friendsItemsOffset * -60}px`;
  }
}

// test-feature to add mock friends to test slider buttons
function handleAddFriend() {
  const MOCK_FRIEND = {
    "id": Math.round(Math.random() * 999).toString(),
    "name": "test",
    "lastName": "test",
    "img": !!Math.round(Math.random()) ? "./male.png" : "./female.png"
  };
  friends.push(MOCK_FRIEND);
  const addButton = document.querySelector(".friends__content-button_plus");
  addButton.removeEventListener("click", handleAddFriend);
  renderFriends(friendsContentItemsContainer, friends);
}

// shows overlay
function showOverlay() {
  overlay.classList.add("overlay_visible");
}

// hides overlay
function hideOverlay() {
  overlay.classList.remove("overlay_visible");
}

// opens modal with scores
function handleOpenScoresModal() {
  function handleCloseScoresModalOnEsc(e) {
    if(e.key === "Escape") {
      handleCloseScoresModal();
      window.removeEventListener("keyup", handleCloseScoresModalOnEsc);    
    }
  }
  showOverlay();
  modal.classList.add("modal_visible");
  overlay.addEventListener("click", handleCloseScoresModal);
  modalExitButton.addEventListener("click", handleCloseScoresModal);
  renderScores(scoresContentItemsContainer, rating, friends);
  window.addEventListener("keyup", handleCloseScoresModalOnEsc);
}

// closes modal with scores
function handleCloseScoresModal() {
  hideOverlay();
  modal.classList.remove("modal_visible");
  overlay.removeEventListener("click", handleCloseScoresModal);
  modalExitButton.removeEventListener("click", handleCloseScoresModal);
}

// custom func to create element node with classes in array and textContent if needed
function createNewElement(type = "div", classArr = [], textContent = "") {
  const el = document.createElement(type);
  if(!el) return undefined;
  if(!Array.isArray(classArr)) classArr = [];
  if(classArr.length) el.classList.add(...classArr);
  if (textContent && !["img", "br"].includes(type)) {
    el.textContent = textContent.toString();
  }
  return el;
}

// renders checkpoint items
function renderCheckPoints() {
  POINTS.forEach((p, i) => {
    let point = createNewElement("button", ["point", `point_${p.type}`, `p_${i}`])
    point.style.left = `${p.x}px`;
    point.style.top = `${p.y}px`;
    path.prepend(point);
  });
}

// places hero to the current checkpoint
function placeHero() {
  hero.style.left = `${POINTS[currentHeroPosition].x}px`;
  hero.style.top = `${POINTS[currentHeroPosition].y}px`;
}

// renders actual friends icons in menu
function renderFriends(friendsParentElement, friendsData) {
  if(friendsParentElement) {
    friendsParentElement.replaceChildren();
    for (let i = 0; i < Math.max(MAX_FRIENDS_ITEMS, friendsData.length); i++) {
      let friend;
      if(i < friendsData.length) {
        friend = createNewElement("li", ["friends__content-item"]);
        friend.style["background-image"] = `url(./images/${friendsData[i].img.split("/")[1]})`
      } else { 
        friend = createNewElement("li", ["friends__content-item"]); 
      }
      if (i === 0) {
        const button = createNewElement("button", ["friends__content-button_plus"]);
        button.addEventListener("click", handleAddFriend);
        friend.append(button);
      }
      friendsParentElement.append(friend);
    }
  }
}

// renders actual scores in modal window
function renderScores(scoresContainer, ratingsData, friendsArr) {

  if(scoresContainer && ratingsData.length && friendsArr) {
    scoresContainer.replaceChildren();
    let ratingsSortedArr = ratingsData.toSorted((a, b) => b.points - a.points);
    ratingsSortedArr.forEach((el, i) => {
      const isFriend = !!friendsArr.find((f) => f.id === el.id);
      const textClasses = ["modal__content-item-text"];
      const imgClasses = ["modal__content-item-img"];
      if (isFriend) textClasses.push("modal__content-item-text_friend");
      const place = createNewElement("p", textClasses, i + 1);
      const sex = createNewElement("img", imgClasses);
      sex.src = `./images/${el.img.split("/")[1]}`;
      const name = createNewElement(
        "p",
        textClasses,
        `${el.name} ${el.lastName}`
      );
      name.style["text-align"] = "left";
      const scores = createNewElement("p", textClasses, el.points);
      const scoreItem = createNewElement("li", ["modal__content-item"]);
      scoreItem.append(place, sex, name, scores);
      scoresContainer.append(scoreItem);
    });
  }
}

renderCheckPoints();
placeHero();
renderFriends(friendsContentItemsContainer, friends);
