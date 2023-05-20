const autoCompleteConfig = {
  renderOption(movie){
    const imgSrc = movie.Poster === "N/A"? '' : movie.Poster;
    return  `
            <img src ="${imgSrc}" /> ${movie.Title} (${movie.Year})
            `
  },
  inputValue(movie){
    return movie.Title
  },
  async fetchData(inputValue){
    const response = await axios.get('http://www.omdbapi.com/',{
      params: {
    apikey : '19ea7da5',
    s: inputValue
  }
  });

  if(response.data.Error)
  {
    return [];
  }
  return response.data.Search
  }
}
createAutoComplete({
  ...autoCompleteConfig,

  onOptionSelect(movie){
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector(".left-summary"), "left")
  },

  root : document.querySelector(".left-autocomplete")
})
createAutoComplete({
  ...autoCompleteConfig,

  onOptionSelect(movie){
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector(".right-summary"), "right")
  },

  root : document.querySelector(".right-autocomplete")
})

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summarySide, side) =>
{
  const response = await axios.get('http://www.omdbapi.com/',
  {
  params: {
          apikey : '19ea7da5',
          i: movie.imdbID
          }
  });
  console.log(response.data);
  summarySide.innerHTML = movieTemplate(response.data)
  if (side === 'left') {
    leftMovie = response.data
  }else{
    rightMovie = response.data
  }

  if(leftMovie && rightMovie){
    runComparison();
  }
}

function runComparison(){
  let leftSideData = document.querySelectorAll(".left-summary .notification");
  let rightSideData = document.querySelectorAll(".right-summary .notification");

  leftSideData.forEach((left, index) => {
    let right = rightSideData[index];

    const leftSideValue = left.dataset.value;
    const rightSideValue = right.dataset.value;

    if (leftSideValue>rightSideValue) {
      right.classList.remove("is-primary");
      right.classList.add("is-warning");
    }else{
      left.classList.remove("is-primary");
      left.classList.add("is-warning");
    }
    }
  );

}

const movieTemplate = (movieDetail)=>{
  const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,''));
  const rating =  parseFloat(movieDetail.imdbRating);
  const votes =  parseFloat(movieDetail.imdbVotes);
  let count = 0;
  const awardsValues = movieDetail.Awards.split(' ').reduce((prev, item) => {
    const value = parseInt(item);
      if(isNaN(value)){
        return prev;
      }else{
        return prev + value;
      }
    },0);

  return `
  <article class="media">
    <figure class="media-left">
      <p class="image">
        <img src="${movieDetail.Poster}" alt="">
      </p>
    </figure>
    <div class="media-content">
      <div class="content">
        <h1>${movieDetail.Title}</h1>
        <h4>${movieDetail.Genre}</h4>
        <p>${movieDetail.Plot}</p>
      </div>
    </div>
  </article>

  <article  data-value="${awardsValues}" class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
  </article>

  <article data-value="${dollars}" class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
  </article>

  <article data-value="${rating}" class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
  </article>

  <article data-value="${votes}" class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">Votes</p>
  </article>
  `
}
