module.exports = {


    getMovies: () => {
    return fetch('/api/movies')
        .then(response => response.json())
},


grabMovie: (id) => {
    return fetch(`api/movies/${id}`)
        .then(response => response.json());
},


addAMovie: (addMovie) => {
    const allMovies = '/api/movies';
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(addMovie)
    };
    return fetch(allMovies, options)
        .then(response => response.json());
},


editAMovie: (editMovie, id) => {
    const currentMovie = `/api/movies/${id}`;
    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(editMovie)
    };
    return fetch(currentMovie, options)
        .then(response => response.json());
},


deleteAMovie: (id) => {
    return fetch(`/api/movies/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json());
},

apiMovieData: (title) => {
    const apiLink = "http://www.omdbapi.com/?t=";
    const apiKey = "&apikey=46042177";
    return fetch(apiLink + title + apiKey)
        .then(response => response.json());
}

};