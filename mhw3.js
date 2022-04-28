function onJsonMusic(json){
    console.log('JSON Musica Ricevuto');
    console.log(json);
    const view = document.querySelector('#view-music');
    view.innerHTML = '';
  
    for(let i = 0; i< 6; i++){
      const song = json.items[Math.floor(Math.random()*100)];
      const title = song.track.name;
      const artist = song.track.artists[0].name;
      const selected_image = song.track.album.images[0].url;

      const block = document.createElement('div');
      block.classList.add('song');
      const img = document.createElement('img');
      img.classList.add('song_img');
      img.src = selected_image;
      const name = document.createElement('span');
      name.textContent = title;
      const composer = document.createElement('span');
      composer.classList.add('song_artist')
      composer.textContent = artist;

      block.appendChild(img);
      block.appendChild(name);
      block.appendChild(composer);
      view.appendChild(block);
    }
  }

function onImg(json){
    console.log('JSON opera ricevuto');
    const view = document.querySelector('#view-art');

    console.log(json);
    if(!json.primaryImage){
        return;
    }
    
    const image_link = json.primaryImage;
    const img = document.createElement('img');
    img.src = image_link;

    view.appendChild(img);
}

function checkEmpty(){
    const view = document.querySelector('#view-art');
    if(view.innerHTML === ''){
        const p = document.createElement('p');
        p.textContent = 'Nessuna immagine trovata per questa chiave di ricerca.';
        view.appendChild(p);
    }
}

function onResponse(response) {
    if(!response.ok){
        console.log('Risposta non valida');
        return null;
    }
    return response.json();
}

function onJsonPaintings(json){
    console.log('JSON Ricevuto');
    const view = document.querySelector('#view-art');
    view.innerHTML='';

    let num_results = json.total;
    if (num_results > 10) num_results = 10;
    if (num_results === 0){
        checkEmpty();
        return;
    }

    let prom;
    for(let i = 0; i<num_results; i++){
        const id = json.objectIDs[i];
        const url_obj = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/' + id;
        console.log(url_obj);

        prom = fetch(url_obj).then(onResponse).then(onImg);
    }
    prom.then(checkEmpty);
}

function search(event){
    event.preventDefault();

    const artist_input = document.querySelector('#artist');
    const artist_value = encodeURIComponent(artist_input.value);
    console.log('Eseguo Ricerca: ' + artist_value);

    rest_url = 'https://collectionapi.metmuseum.org/public/collection/v1/search?q=' + artist_value;
    console.log('URL: ' + rest_url);

    fetch(rest_url).then(onResponse).then(onJsonPaintings);
}

function refresh(event){
    fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DWWEJlAGA9gs0/tracks',
    {
        method: 'get',
        headers: 
        {
        'Authorization': 'Bearer ' + token
        }
    }).then(onResponse).then(onJsonMusic);
}

function fetchToken(){
    fetch('https://accounts.spotify.com/api/token',
    {
    method:'post',
    body:'grant_type=client_credentials',
    headers:
    {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    }
    }).then(onResponse).then(onTokenJson);
}

function onTokenJson(json){
    console.log(json);
    token = json.access_token;
}


const client_id = '506093bf691c49ca9c9823dfcc609118';
const client_secret = 'c875bdaac6dc417bab24d0e33ec9961e';
let token = '';

const form = document.querySelector('form');
form.addEventListener('submit', search);

const button = document.querySelector('#suggerimenti');
button.addEventListener('click', refresh);

fetchToken();