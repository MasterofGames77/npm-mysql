document.addEventListener('DOMContentLoaded', () => {
    const videogamesTable = document.getElementById('videogames-table');
    const searchButton = document.getElementById('search-button');

    const fetchVideoGames = (query = '') => {
        fetch(`http://localhost:3000/videogames${query}`)
            .then(response => response.json())
            .then(data => {
                const tableBody = videogamesTable.querySelector('tbody');
                tableBody.innerHTML = ''; // Clear any previous content

                if (data.length === 0) {
                    const row = document.createElement('tr');
                    const cell = document.createElement('td');
                    cell.colSpan = 5;
                    cell.textContent = 'No games found';
                    row.appendChild(cell);
                    tableBody.appendChild(row);
                } else {
                    data.forEach(game => {
                        const row = document.createElement('tr');
                        const releaseDate = new Date(game.release_date).toISOString().split('T')[0];
                        row.innerHTML = `
                            <td>${game.title}</td>
                            <td>${game.developer}</td>
                            <td>${game.genre}</td>
                            <td>${releaseDate}</td>
                            <td>${game.platform}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                }

                videogamesTable.style.display = 'table'; // Show the table
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    searchButton.addEventListener('click', () => {
        const title = document.getElementById('title-input').value.trim();
        const developer = document.getElementById('developer-input').value.trim();
        const genre = document.getElementById('genre-input').value.trim();
        const platform = document.getElementById('platform-input').value.trim();

        let query = '?';
        if (title) query += `title=${encodeURIComponent(title)}&`;
        if (developer) query += `developer=${encodeURIComponent(developer)}&`;
        if (genre) query += `genre=${encodeURIComponent(genre)}&`;
        if (platform) query += `platform=${encodeURIComponent(platform)}&`;
        query = query.slice(0, -1); // Remove trailing '&' or '?' if no parameters

        if (query !== '?') {
            fetchVideoGames(query);
        } else {
            videogamesTable.style.display = 'none'; // Hide the table if no search criteria
        }
    });
});