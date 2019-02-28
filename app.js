"use strict";

const App = (function() {

  let app = {};
  app.init = function () {
    console.log('App Initialized');
    getPosts();
  }

  function Card(post, isSingular) {
    this.title    = post.title.rendered;
    this.content  = post.content.rendered;
    this.id       = post.id;
    this.isSingular = isSingular;
  }

  Card.prototype.buildCard = function() {
      let cardWrapper = document.createElement('div'),
          cardHeader  = document.createElement('div'),
          cardTitle   = document.createElement('div'),
          cardContent = document.createElement('div'),
          cardColumn  = document.createElement('div'),
          cardButton  = document.createElement('button'),
          cardButtonMore = document.createElement('button');

          cardTitle.innerHTML   = this.title;
          cardContent.innerHTML = this.content;
          cardButton.innerHTML  = 'Read Post';
          cardButton.type       = 'button';
          cardButtonMore.innerHTML = 'See All Posts';
          cardButtonMore.type      = 'button';
          cardButton.dataset.id = this.id;

          cardWrapper.classList.add('card');
          cardHeader.classList.add('card-header');
          cardTitle.classList.add('card-header-title');
          cardContent.classList.add('card-content');
          cardColumn.classList.add('column');
          if (!this.isSingular === false) {
            cardColumn.classList.add('is-one-half');
          }
          cardButton.classList.add('more-button', 'button', 'is-primary');
          cardButtonMore.classList.add('all-button', 'button', 'is-primary');


          cardHeader.appendChild(cardTitle);
          cardWrapper.appendChild(cardHeader);
          cardWrapper.appendChild(cardContent);
          if (this.isSingular === false) {
            cardWrapper.appendChild(cardButton);
          } else {
            cardWrapper.appendChild(cardButtonMore);

          }
          // cardWrapper.appendChild(cardButton);
          cardColumn.appendChild(cardWrapper);

          document.getElementById('app').appendChild(cardColumn);
          cardButton.addEventListener('click', getPost.bind(this));
          cardButtonMore.addEventListener('click', getPosts.bind(this));
  };


  function getPosts() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/wordpress/wp-json/wp/v2/posts');
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {       // 4 means done.
        if (xhr.status == 200) {        // 200 means everything is OK - processed successfully
          killAllCards();
          let response = JSON.parse(xhr.responseText);
          response.forEach(function (post) {
            let card = new Card(post, false);
            card.buildCard();
          });
        } else {
            console.log('Error: ' + xhr.status);
        }
      }
    }
  }


  function getPost() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/wordpress/wp-json/wp/v2/posts/' + this.id);
    xhr.send(null);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {       // 4 means done.
        if (xhr.status == 200) {        // 200 means everything is OK - processed successfully
          killAllCards();
          let post = JSON.parse(xhr.responseText);
          let card = new Card(post, true);
          card.buildCard();

        } else {
            console.log('Error: ' + xhr.status);
        }
      }
    }
  }


  function killAllCards() {
    let cardsContainer = document.getElementById('app');
    while (cardsContainer.hasChildNodes()) {
      cardsContainer.removeChild(cardsContainer.lastChild);
    }
  }

  return app;

}());

document.addEventListener("DOMContentLoaded", function() {
  App.init();
});
