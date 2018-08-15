// Hide the items on the page until they are loaded
$("#myDiv").addClass('hide');
$("#profileSection").addClass('hide');


// Add a constant for the movie api
const post = require('./api.js');


// Use api for movie images
const apiLink = "http://www.omdbapi.com/?t=";
const apiKey = "&apikey=46042177";
let movieImage;
let moviePlot;
let movieGenre;


function apiMovieData(title) {
    $.ajax(apiLink + title + apiKey).done((data) => {
        console.log(data);
    movieImage = data.Poster;
    console.log(movieImage);
    return movieImage;
});
}


function description(title) {
    $.ajax(apiLink + title + apiKey).done((data) => {
        moviePlot = data.Plot;
    console.log(moviePlot);
    return moviePlot;
});
}

function genre(title) {
    $.ajax(apiLink + title + apiKey).done((data) => {
        movieGenre = data.Genre;
    console.log(movieGenre);
    return movieGenre;
});
}


// Refresh the movies on the site
function moviesRefresh() {
    // Hide the profile page, movie page and show the loading screen
    $("#profileSection").removeClass('show').addClass('hide');
    $('#myDiv').removeClass('show').addClass('hide');
    $('#loader').removeClass('hide').addClass('show');
    // Create the new movie page
    post.getMovies().then((movies) => {
        $("#movies").html("");
    // console.log('Here are all the movies:');
    // console.log(movies);
    movies.forEach(({title, rating, id, poster, plot, genre}) => {
        $("#movies").append(`
                <div class="card col-3 w-100 bg-primary text-light m-4 box-shadowing">
                    <img class="card-img-top moviePoster" src="${poster}" alt="Movie Image">
                    <div class="card-body">
                        <h2 id="movieTitle" class="card-title">${title}</h2>
                        <h4>${rating}/5</h4>
                           <p id="plotText" class="card-text">${plot}</p>
                           <p id="genreText" class="card-text">${genre}</p>
                           <!--<button id=${id} type="button" class="btn btn-secondary movieModalBtn" data-toggle="modal" data-target="#movieInfoModal">Movie Info</button>-->
                           <button id=${id} type="button" class="btn btn-sm btn-secondary editButton" data-toggle="modal" data-target="#editModal">Edit Movie</button>
                    </div>
                </div>
                `);
    // console.log(`id#${id} - ${title} - rating: ${rating} - poster: ${poster} - plot: ${plot} - genre: ${genre}`);
});
    // Hide the loader and show the movie page
    $('#loader').removeClass('show').addClass('hide');
    $('#myDiv').removeClass('hide').addClass('show');
}).then(() => {
        // Add functionality to the edit button
        $('.editButton').click(function () {
        const id = this.id;
        post.grabMovie(id)
            .then(movie => {
            $('#editMovieID').text(movie.id);
        $('#titleEdit').val(movie.title);
    })
    })
})
    // Catch any errors that happen
.catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
});
}


moviesRefresh();


// Add a movie feature
$('#addAMovie').click(function (e) {
    e.preventDefault();
    let title = $('#title').val();
    let rating = $('input[name=rating]:checked').val();
    apiMovieData(title);
    description(title);
    genre(title);
    console.log(moviePlot);
    post.apiMovieData(title).then(() => {
        post.addAMovie({title: title, rating: rating, poster: movieImage, plot: moviePlot, genre: movieGenre});
    $("#movieInfoBody").append(moviePlot);
    setTimeout(function () {
        moviesRefresh();
    }, 1000)});
    $('input[type="text"], text').val('');
    $('.form-group').find('input:radio').prop('checked', false);
});


// Edit a movie feature
$('#editAMovie').click(function (e) {
    e.preventDefault();
    let id = $('#editMovieID').text();
    let editTitle = $('#titleEdit').val();
    let editRating = $(`input[name=ratingEdit]:checked`).val();
    apiMovieData(editTitle);
    description(editTitle);
    genre(editTitle);
    post.apiMovieData(editTitle).then(() => {
        post.editAMovie({title: editTitle, rating: editRating, poster: movieImage, plot: moviePlot, genre: movieGenre}, id);
    $("#movieInfoBody").append(moviePlot);
    setTimeout(function () {
        moviesRefresh();
    }, 1000)});
    $('input[type="text"], text').val('');
    $('.form-group').find('input:radio').prop('checked', false);
});


// Delete a movie feature
$('#deleteAMovie').click(function () {
    let id = $('#editMovieID').text();
    post.deleteAMovie(id);
    setTimeout(function () {
        moviesRefresh();
    }, 1000);
});

$(".movieModalBtn").click(function (e) {
    e.preventDefault();
    let title = $('#title').val();
    description(title);
    post.apiMovieData(title).then(() => {
        $("#movieInfoBody").append(moviePlot);
    // $("#movieInfoBody").append(`${plot}`);
});
});


// Add feature to the MovieWorld button
$("#companyName").click(function () {
    moviesRefresh();
});


// Add feature to the home button
$("#home").click(function () {
    moviesRefresh();
});


// Add a profile page
$("#profile").click(function () {
    $("#myDiv").removeClass('show').addClass('hide');
    $("#profileSection").removeClass('hide').addClass('show');
});

