import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDALWHCV7DdA2pjbNEG_u14ZzfXhsgZhEU",

  authDomain: "bookmark-d3637.firebaseapp.com",

  projectId: "bookmark-d3637",

  storageBucket: "bookmark-d3637.appspot.com",

  messagingSenderId: "825838670790",

  appId: "1:825838670790:web:0e0539410e1c8ca75998c7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "bookmarks");

function generateTemplate(response, id) {
  const card = `<div class="card">
                    <p class="title">${response.title}</p>
                    <div class="sub-information">
                        <p>
                        <span class="category ${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                        </p>
                        <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                        <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                        <span>
                        <i class="bi bi-trash delete" data-id="${id}"></i>
                        </span>
                    </div>
                </div>`;
  return card;
}

const cards = document.querySelector(".cards");

function showCard() {
  cards.innerHTML = "";
  getDocs(colRef)
    .then((data) => {
      data.docs.forEach((document) => {
        cards.innerHTML += generateTemplate(document.data(), document.id);
      });
      deleteEvent();
    })
    .catch((error) => {
      console.log(error);
    });
}

showCard();

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", (event) => {
  event.preventDefault();
    if (addForm.link.value.trim() != "" && addForm.title.value.trim() != "") {
      addDoc(colRef, {
        link: addForm.link.value.trim(),
        title: addForm.title.value.trim(),
        category: addForm.category.value,
        createdAt: serverTimestamp(),
      }).then(() => {
        addForm.reset();
        showCard();
      });
    }
});

function deleteEvent() {
  const deleteBtn = document.querySelectorAll("i.delete");
  deleteBtn.forEach((button) => {
    button.addEventListener("click", () => {
      const deleteRef = doc(db, "bookmarks", button.dataset.id);
      deleteDoc(deleteRef).then(() => {
        button.parentElement.parentElement.parentElement.remove();
      });
    });
  });
}

function filteredCards(category) {
  if (category === "All") {
    showCard();
  } else {
    const qRef = query(colRef, where("category", "==", category.toLowerCase()));
    cards.innerHTML = "";
    getDocs(qRef)
      .then((data) => {
        data.docs.forEach((document) => {
          cards.innerHTML += generateTemplate(document.data(), document.id);
        });
        deleteEvent();
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const categoryList = document.querySelector(".category-list");
const categorySpan = document.querySelectorAll(".category-list span");
categoryList.addEventListener("click", (event) => {
  if (event.target.tagName === "SPAN") {
    filteredCards(event.target.innerText);
    categorySpan.forEach((span) => span.classList.remove("active"));
    event.target.classList.add("active");
  }
});
