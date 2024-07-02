document.addEventListener('DOMContentLoaded', () => {
    const videogamesTable = document.getElementById('videogames-table');
    const searchButton = document.getElementById('search-button');
    const sortTitleButton = document.getElementById('sort-title');
    const sortDateButton = document.getElementById('sort-date');
    const modal = document.getElementById('myModal');
    const modalImg = document.getElementById('game-artwork');
    const span = document.getElementsByClassName('close')[0];

    let videoGamesData = [];

    const fetchVideoGames = (query = '') => {
        fetch(`http://localhost:3000/videogames${query}`)
            .then(response => response.json())
            .then(data => {
                videoGamesData = data;
                displayVideoGames(data);
                videogamesTable.style.display = 'table'; // Show the table
                document.getElementById('sort-buttons').style.display = 'block'; // Show the sort buttons
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const displayVideoGames = (data) => {
        const tableBody = videogamesTable.querySelector('tbody');
        tableBody.innerHTML = ''; // Clear any previous content

        if (data.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 6;
            cell.textContent = 'No games found';
            row.appendChild(cell);
            tableBody.appendChild(row);
        } else {
            data.forEach(game => {
                const row = document.createElement('tr');
                const releaseDate = new Date(game.release_date).toISOString().split('T')[0];
                row.innerHTML = `
                    <td><a href="#" class="game-title" data-artwork="${game.artwork_url}">${game.title}</a></td>
                    <td>${game.developer}</td>
                    <td>${game.publisher}</td>
                    <td>${game.genre}</td>
                    <td>${releaseDate}</td>
                    <td>${game.platform}</td>
                `;
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.game-title').forEach(title => {
                title.addEventListener('click', (event) => {
                    event.preventDefault();
                    const artworkUrl = event.target.getAttribute('data-artwork');
                    if (artworkUrl) {
                        modalImg.src = artworkUrl;
                        modal.style.display = 'block';
                    }
                });
            });
        }
    };

    searchButton.addEventListener('click', () => {
        const title = document.getElementById('title-input').value.trim();
        const developer = document.getElementById('developer-input').value.trim();
        const publisher = document.getElementById('publisher-input').value.trim();
        const genre = document.getElementById('genre-input').value.trim();
        const platform = document.getElementById('platform-input').value.trim();

        let query = '?';
        if (title) query += `title=${encodeURIComponent(title)}&`;
        if (developer) query += `developer=${encodeURIComponent(developer)}&`;
        if (publisher) query += `publisher=${encodeURIComponent(publisher)}&`;
        if (genre) query += `genre=${encodeURIComponent(genre)}&`;
        if (platform) query += `platform=${encodeURIComponent(platform)}&`;
        query = query.slice(0, -1); // Remove trailing '&' or '?' if no parameters

        if (query !== '?') {
            fetchVideoGames(query);
        } else {
            videogamesTable.style.display = 'none'; // Hide the table if no search criteria
            document.getElementById('sort-buttons').style.display = 'none'; // Hide the sort buttons
        }
    });

    const sortByTitle = () => {
        const sortedData = [...videoGamesData].sort((a, b) => a.title.localeCompare(b.title));
        displayVideoGames(sortedData);
    };

    const sortByDate = () => {
        const sortedData = [...videoGamesData].sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
        displayVideoGames(sortedData);
    };

    sortTitleButton.addEventListener('click', sortByTitle);
    sortDateButton.addEventListener('click', sortByDate);

    span.onclick = function() {
        modal.style.display = 'none';
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
});
