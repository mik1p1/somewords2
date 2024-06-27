// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDLBXh7Vc7ikxXeByamlvvR6YoqZ1OpSBQ",
    authDomain: "amoaminovia-ca234.firebaseapp.com",
    projectId: "amoaminovia-ca234",
    storageBucket: "amoaminovia-ca234.appspot.com",
    messagingSenderId: "945736010225",
    appId: "1:945736010225:web:1a4b5ee7e06bd0aa795c50",
    measurementId: "G-Q3ZG99TPDW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('commentForm');
    const commentsDiv = document.getElementById('comments');

    // Load existing comments from Firestore
    async function loadComments() {
        const querySnapshot = await getDocs(collection(db, "comments"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            addComment(data.date, data.title, data.comment, data.imageUrl);
        });
    }

    loadComments();

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const comment = document.getElementById('comment').value;
        const image = document.getElementById('image').files[0];
        const date = new Date();
        const formattedDate = `${date.getDate()} de ${getMonthName(date.getMonth())} de ${date.getFullYear()}`;

        if (image) {
            const reader = new FileReader();
            reader.onload = async function (e) {
                const imageUrl = e.target.result;
                await addDoc(collection(db, "comments"), {
                    date: formattedDate,
                    title: title,
                    comment: comment,
                    imageUrl: imageUrl
                });
                addComment(formattedDate, title, comment, imageUrl);
            }
            reader.readAsDataURL(image);
        }

        commentForm.reset();
    });

    function addComment(date, title, comment, imageUrl) {
        const newComment = document.createElement('div');
        newComment.className = 'contenedor wrap animate pop';

        newComment.innerHTML = `
      <div class="overlay">
        <div class="overlay-content animate slide-left delay-2">
          <h1 class="animate slide-left pop delay-4">${date}</h1>
          <p class="animate slide-left pop delay-5" style="color: white; margin-bottom: 2.5rem;">${title}</p>
        </div>
        <div class="image-content animate slide delay-5"></div>
        <div class="dots animate">
          <div class="dot animate slide-up delay-6"></div>
          <div class="dot animate slide-up delay-7"></div>
          <div class="dot animate slide-up delay-8"></div>
        </div>
      </div>
      <div class="text">
        <p><img class="inset" src="${imageUrl}" alt="" /></p>
        <p>${comment}</p>
      </div>
    `;

        commentsDiv.appendChild(newComment);
    }

    function getMonthName(monthIndex) {
        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        return monthNames[monthIndex];
    }

    function goBack() {
        window.history.back();
    }
});
