require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL Server:', err);
        process.exit(1); // Exit the process with an error code
    }
    console.log('Connected to MySQL Server!');
});

const videoGames = [
    { id: 1, title: 'Xenoblade Chronicles', developer: 'Monolith Soft', genre: 'Action Role-Playing', release_date: '2012-04-06', platform: 'Nintendo Wii' },
    { id: 2, title: 'Super Mario Bros.', developer: 'Nintendo', genre: 'Platformer', release_date: '1985-10-18', platform: 'Nintendo Entertainment System' },
    { id: 3, title: 'Sonic the Hedgehog 2', developer: 'Sega Technical Institute', genre: 'Platformer', release_date: '1992-11-24', platform: 'Sega Genesis' },
    { id: 4, title: 'Final Fantasy VII', developer: 'Square', genre: 'Role-Playing Game', release_date: '1997-09-07', platform: 'PlayStation 1' },
    { id: 5, title: 'The Legend of Zelda: Ocarina of Time', developer: 'Nintendo', genre: 'Action-Adventure', release_date: '1998-11-23', platform: 'Nintendo 64' },
    { id: 6, title: 'Metal Gear Solid 2: Sons of Liberty', developer: 'Konami', genre: 'Action-Adventure Stealth', release_date: '2001-11-13', platform: 'PlayStation 2' },
    { id: 7, title: 'Halo 2', developer: 'Bungie', genre: 'FPS', release_date: '2004-11-09', platform: 'Xbox' },
    { id: 8, title: 'Resident Evil 4', developer: 'Capcom', genre: 'Survival Horror', release_date: '2005-01-11', platform: 'Nintendo GameCube' },
    { id: 9, title: 'Portal', developer: 'Valve', genre: 'Puzzle-Platformer', release_date: '2007-10-10', platform: 'Windows, Xbox 360' },
    { id: 10, title: 'Dark Souls', developer: 'FromSoftware', genre: 'Action Role-Playing', release_date: '2011-10-04', platform: 'PlayStation 3, Xbox 360' },
    { id: 11, title: 'Batman: Arkham City', developer: 'Rocksteady Studios', genre: 'Action-Adventure', release_date: '2011-10-18', platform: 'PlayStation 3, Xbox 360' },
    { id: 12, title: 'Minecraft', developer: 'Mojang Studios', genre: 'Sandbox', release_date: '2011-11-18', platform: 'Windows, macOS, Linux' },
    { id: 13, title: 'BioShock Infinite', developer: 'Irrational Games', genre: 'FPS', release_date: '2013-03-26', platform: 'PlayStation 3, Xbox 360' },
    { id: 14, title: 'The Elder Scrolls V: Skyrim', developer: 'Bethesda Game Studios', genre: 'Action Role-Playing', release_date: '2011-11-11', platform: 'PlayStation 3, Xbox 360' },
    { id: 15, title: 'Grand Theft Auto V', developer: 'Rockstar Games UK Limited', genre: 'Action-Adventure', release_date: '2013-09-17', platform: 'PlayStation 3, Xbox 360' },
    { id: 16, title: 'Shovel Knight', developer: 'Yacht Club Games', genre: 'Platformer', release_date: '2014-06-26', platform: 'Nintendo 3DS, Nintendo Wii U' },
    { id: 17, title: 'Rocket League', developer: 'Psyonix', genre: 'Vehicular Soccer', release_date: '2015-07-15', platform: 'PlayStation 4, Windows' },
    { id: 18, title: 'Overwatch', developer: 'Blizzard Entertainment', genre: 'Multiplayer First-Person Shooter', release_date: '2016-05-24', platform: 'Windows, Xbox One' },
    { id: 19, title: 'Stardew Valley', developer: 'ConcernedApe', genre: 'Farm Life Simulation', release_date: '2016-02-26', platform: 'Windows, macOS, Linux' },
    { id: 20, title: 'Fortnite', developer: 'Epic Games', genre: 'Survival, Battle Royale, Sandbox', release_date: '2017-07-25', platform: 'Windows, PlayStation 4' },
    { id: 21, title: 'God of War', developer: 'Santa Monica Studio', genre: 'Action-Adventure', release_date: '2018-04-20', platform: 'PlayStation 4' },
    { id: 22, title: 'Red Dead Redemption 2', developer: 'Rockstar Games', genre: 'Action-Adventure', release_date: '2018-10-26', platform: 'PlayStation 4, Xbox One' },
    { id: 23, title: 'Hades', developer: 'Supergiant Games', genre: 'Roguelike Action Role-Playing', release_date: '2020-09-17', platform: 'macOS, Nintendo Switch' },
    { id: 24, title: 'Elden Ring', developer: 'FromSoftware', genre: 'Action Role-Playing', release_date: '2022-02-05', platform: 'PlayStation 5, Xbox Series X' },
    { id: 25, title: "Baldur's Gate 3", developer: 'Larian Studios', genre: 'Role-Playing Game', release_date: '2023-08-03', platform: 'Windows, PlayStation 5' },
    { id: 26, title: 'The Last of Us', developer: 'Naughty Dog', genre: 'Action-Adventure', release_date: '2013-06-14', platform: 'PlayStation 3' },
    { id: 27, title: 'Super Mario Galaxy', developer: 'Nintendo', genre: 'Platformer', release_date: '2007-11-12', platform: 'Nintendo Wii' },
    { id: 28, title: 'Freedom Planet', developer: 'GalaxyTrail', genre: 'Platformer', release_date: '2014-07-21', platform: 'Windows, Nintendo Wii U' },
    { id: 29, title: 'League of Legends', developer: 'Riot Games', genre: 'Multiplayer Online Battle Arena', release_date: '2009-10-27', platform: 'Windows' },
    { id: 30, title: 'Bayonetta 2', developer: 'Platinum Games', genre: 'Action-Adventure Hack & Slash', release_date: '2014-10-24', platform: 'Nintendo Wii U' },
    { id: 31, title: 'Doom', developer: 'id Software', genre: 'FPS', release_date: '1993-12-10', platform: 'MS-DOS' },
    { id: 32, title: 'Mega Man 2', developer: 'Capcom', genre: 'Action-Platform', release_date: '1988-12-24', platform: 'Nintendo Entertainment System' },
    { id: 33, title: 'Pokémon Red and Blue', developer: 'Game Freak', genre: 'Role-Playing Game', release_date: '1998-09-28', platform: 'Game Boy' },
    { id: 34, title: 'Castlevania: Symphony of the Night', developer: 'Konami', genre: 'Metroidvania', release_date: '1997-10-03', platform: 'PlayStation 1' },
    { id: 35, title: 'The Sims', developer: 'Maxis', genre: 'Social Simulation', release_date: '2000-02-04', platform: 'Windows' },
    { id: 36, title: 'Metroid Prime', developer: 'Retro Studios', genre: 'First Person Action-Adventure', release_date: '2002-11-18', platform: 'Nintendo GameCube' },
    { id: 37, title: 'Kingdom Hearts', developer: 'Square', genre: 'Action Role-Playing', release_date: '2002-09-17', platform: 'PlayStation 2' },
    { id: 38, title: 'Star Wars: Knights of the Old Republic', developer: 'BioWare', genre: 'Role-Playing Game', release_date: '2003-07-16', platform: 'Xbox' },
    { id: 39, title: 'World of Warcraft', developer: 'Blizzard Entertainment', genre: 'MMORPG', release_date: '2004-11-23', platform: 'Windows, Mac OS X' },
    { id: 40, title: "Devil May Cry 3: Dante's Awakening", developer: 'Capcom', genre: 'Action-Adventure', release_date: '2005-03-01', platform: 'PlayStation 2' },
    { id: 41, title: "Shantae and the Pirate's Curse", developer: 'WayForward Technologies', genre: 'Platformer', release_date: '2014-10-23', platform: 'Nintendo 3DS, Nintendo Wii U' },
    { id: 42, title: 'Braid', developer: 'Jonathan Blow', genre: 'Puzzle-Platformer', release_date: '2008-08-06', platform: 'Xbox 360' },
    { id: 43, title: 'Sonic Unleashed', developer: 'Sonic Team', genre: 'Platformer', release_date: '2008-11-18', platform: 'Xbox 360, Nintendo Wii' },
    { id: 44, title: 'Super Street Fighter II Turbo', developer: 'Capcom', genre: 'Fighting Game', release_date: '1994-02-23', platform: 'Arcade' },
    { id: 45, title: 'Donkey Kong Country', developer: 'Rare', genre: 'Platformer', release_date: '1994-11-21', platform: 'SNES' },
    { id: 46, title: 'Dragon Quest V', developer: 'ArtePiazza', genre: 'Role-Playing Game', release_date: '2009-02-17', platform: 'Nintendo DS, iOS' },
    { id: 47, title: 'Super Smash Bros. Brawl', developer: 'Sora Ltd.', genre: 'Crossover Fighting Game', release_date: '2008-03-09', platform: 'Nintendo Wii' },
    { id: 48, title: 'Persona 5', developer: 'Atlus', genre: 'Role-Playing Game', release_date: '2017-04-04', platform: 'PlayStation 4' },
    { id: 49, title: 'The Legend of Zelda: Breath of the Wild', developer: 'Nintendo', genre: 'Action-Adventure', release_date: '2017-03-03', platform: 'Nintendo Switch' },
    { id: 50, title: "Sid Meier's Civilization VI", developer: 'Firaxis Games', genre: 'Turn-Based Strategy 4X', release_date: '2016-10-21', platform: 'Windows, macOS' },
    { id: 51, title: 'Dota 2', developer: 'Valve', genre: 'Multiplayer Online Battle Arena', release_date: '2013-07-09', platform: 'Windows, Linux' },
    { id: 52, title: 'Mario Kart 8 Deluxe', developer: 'Nintendo', genre: 'Kart Racing', release_date: '2017-04-28', platform: 'Nintendo Switch' },
    { id: 53, title: 'Crash Bandicoot: Warped', developer: 'Naughty Dog', genre: 'Platformer', release_date: '1998-11-03', platform: 'PlayStation 1' },
    { id: 54, title: 'Virtua Fighter 2', developer: 'Sega AM2', genre: 'Fighting Game', release_date: '1995-11-30', platform: 'Sega Saturn, Arcade' },
    { id: 55, title: "Tony Hawk's Pro Skater 3", developer: 'Neversoft', genre: 'Skateboarding', release_date: '2001-10-30', platform: 'PlayStation 2, Xbox' },
    { id: 56, title: 'F-Zero GX', developer: 'Amusement Vision', genre: 'Racing', release_date: '2003-08-25', platform: 'Nintendo GameCube' },
    { id: 57, title: 'Call of Duty 4: Modern Warfare', developer: 'Infinity Ward', genre: 'FPS', release_date: '2007-11-05', platform: 'Xbox 360, Windows' },
    { id: 58, title: 'Rock Band 3', developer: 'Harmonix', genre: 'Rhythm', release_date: '2010-10-26', platform: 'PlayStation 3, Nintendo Wii' },
    { id: 59, title: 'Far Cry 3', developer: 'Ubisoft Montreal', genre: 'FPS', release_date: '2012-12-04', platform: 'Windows, PlayStation 3' },
    { id: 60, title: 'Fire Emblem: Awakening', developer: 'Intelligent Systems', genre: 'Tactical Role-Playing', release_date: '2013-02-04', platform: 'Nintendo 3DS' },
    { id: 61, title: 'Fallout 3', developer: 'Bethesda Game Studios', genre: 'Action Role-Playing', release_date: '2008-10-28', platform: 'Windows, PlayStation 3' },
    { id: 62, title: 'Team Fortress 2', developer: 'Valve', genre: 'Multiplayer FPS', release_date: '2007-10-10', platform: 'Xbox 360, Windows' },
    { id: 63, title: 'Valkyria Chronicles', developer: 'Sega', genre: 'Tactical Role-Playing', release_date: '2008-11-04', platform: 'PlayStation 3' },
    { id: 64, title: 'Plants vs. Zombies', developer: 'PopCap Games', genre: 'Tower Defense', release_date: '2009-05-05', platform: 'Windows, macOS' },
    { id: 65, title: 'Journey', developer: 'Thatgamecompany', genre: 'Indie Adventure', release_date: '2012-03-13', platform: 'PlayStation 3' },
    { id: 66, title: 'Among Us', developer: 'Innersloth', genre: 'Multiplayer Social Deduction', release_date: '2018-11-16', platform: 'Windows, iOS' },
    { id: 67, title: 'Fall Guys', developer: 'Mediatonic', genre: 'Platform Battle Royale', release_date: '2020-08-04', platform: 'PlayStation 4, Windows' },
    { id: 68, title: 'Xenoblade Chronicles 2', developer: 'Monolith Soft', genre: 'Action Role-Playing', release_date: '2017-12-01', platform: 'Nintendo Switch' },
    { id: 69, title: 'Destiny', developer: 'Bungie', genre: 'Online First-Person Shooter', release_date: '2014-09-09', platform: 'PlayStation 3, PlayStation 4' },
    { id: 70, title: 'Hotline Miami', developer: 'Dennaton Games', genre: 'Top-Down Shooter', release_date: '2012-10-23', platform: 'Windows' },
    { id: 71, title: 'The Witcher 3: Wild Hunt', developer: 'CD Projekt Red', genre: 'Action Role-Playing', release_date: '2015-05-19', platform: 'PlayStation 4, Xbox One' },
    { id: 72, title: "Eternal Darkness: Sanity's Requiem", developer: 'Silicon Knights', genre: 'Action-Adventure', release_date: '2002-06-24', platform: 'Nintendo GameCube' },
    { id: 73, title: 'Borderlands 2', developer: 'Gearbox Software', genre: 'Action Role-Playing, FPS', release_date: '2012-09-18', platform: 'PlayStation 3, Windows' },
    { id: 74, title: 'Spider-Man', developer: 'Insomniac Games', genre: 'Action-Adventure', release_date: '2018-09-07', platform: 'PlayStation 4' },
    { id: 75, title: 'Tomb Raider', developer: 'Core Design', genre: 'Action-Adventure', release_date: '1996-11-14', platform: 'PlayStation 1, Sega Saturn' },
    { id: 76, title: 'Chrono Trigger', developer: 'Square', genre: 'Role-Playing Game', release_date: '1995-08-11', platform: 'SNES' },
    { id: 77, title: 'Tempest 2000', developer: 'Llamasoft', genre: 'Tube Shooter', release_date: '1994-04-13', platform: 'Atari Jaguar' },
    { id: 78, title: 'Castlevania: Rondo of Blood', developer: 'Konami', genre: 'Platformer', release_date: '1993-10-29', platform: 'PC Engine' },
    { id: 79, title: 'Death Stranding', developer: 'Kojima Productions', genre: 'Action', release_date: '2019-11-08', platform: 'PlayStation 4' },
    { id: 80, title: 'Golden Sun', developer: 'Camelot Software', genre: 'Role-Playing Game', release_date: '2001-11-12', platform: 'Game Boy Advance' },
    { id: 81, title: 'Pokémon Gold and Silver', developer: 'Game Freak', genre: 'Role-Playing Game', release_date: '2000-10-15', platform: 'Game Boy Color' },
    { id: 82, title: 'Jet Set Radio', developer: 'Smilebit', genre: 'Action', release_date: '2000-10-31', platform: 'Sega Dreamcast' },
    { id: 83, title: 'Shin Megami Tensei: Persona 3', developer: 'Atlus', genre: 'Role-Playing Game', release_date: '2010-07-06', platform: 'PlayStation Portable' },
    { id: 84, title: 'The World Ends with You', developer: 'Square Enix', genre: 'Action Role-Playing', release_date: '2008-04-22', platform: 'Nintendo DS' },
    { id: 85, title: 'Super Smash Bros. Ultimate', developer: 'Bandai Namco Studios', genre: 'Crossover Fighting Game', release_date: '2018-12-07', platform: 'Nintendo Switch' },
    { id: 86, title: 'Super Mario 64', developer: 'Nintendo', genre: 'Platformer', release_date: '1996-09-29', platform: 'Nintendo 64' },
    { id: 87, title: 'Mother 3', developer: 'HAL Laboratory', genre: 'Role-Playing Game', release_date: '2006-04-20', platform: 'Game Boy Advance' },
    { id: 88, title: 'Kirby and the Forgotten Land', developer: 'HAL Laboratory', genre: 'Platformer', release_date: '2022-03-25', platform: 'Nintendo Switch' },
    { id: 89, title: 'Kid Icarus: Uprising', developer: 'Project Sora', genre: 'Third-Person Shooter', release_date: '2012-03-23', platform: 'Nintendo 3DS' },
    { id: 90, title: 'Pac-Man World 2', developer: 'Namco Hometek', genre: 'Platformer', release_date: '2002-02-26', platform: 'PlayStation 2' },
    { id: 91, title: 'Xenoblade Chronicles 3', developer: 'Monolith Soft', genre: 'Action Role-Playing', release_date: '2022-07-29', platform: 'Nintendo Switch' },
    { id: 92, title: 'Pikmin 3', developer: 'Nintendo', genre: 'Real-Time Strategy, Puzzle', release_date: '2013-08-04', platform: 'Nintendo Wii U' },
    { id: 93, title: "Mario & Luigi: Bowser's Inside Story", developer: 'AlphaDream', genre: 'Role-Playing Game', release_date: '2009-09-15', platform: 'Nintendo DS' },
    { id: 94, title: 'Kena: Bridge of Spirits', developer: 'Ember Lab', genre: 'Action-Adventure', release_date: '2021-09-21', platform: 'PlayStation 5' },
    { id: 95, title: 'Horizon Forbidden West', developer: 'Guerrilla Games', genre: 'Action Role-Playing', release_date: '2022-02-18', platform: 'PlayStation 5' },
    { id: 96, title: 'A Plague Tale: Requiem', developer: 'Asobo Studio', genre: 'Action-Adventure, Stealth', release_date: '2022-10-18', platform: 'PlayStation 5' },
    { id: 97, title: 'Forza Horizon 5', developer: 'Playground Games', genre: 'Racing', release_date: '2021-11-09', platform: 'Xbox Series X/S' },
    { id: 98, title: 'Psychonauts', developer: 'Double Fine Productions', genre: 'Platformer', release_date: '2005-04-19', platform: 'Windows, Xbox' },
    { id: 99, title: 'Turnip Boy Commits Tax Evasion', developer: 'Snoozy Kazoo', genre: 'Action-Adventure', release_date: '2021-04-22', platform: 'Nintendo Switch, Windows' },
    { id: 100, title: "Five Nights at Freddy's", developer: 'Scott Cawthon', genre: 'Point-and-Click, Survival-Horror', release_date: '2014-08-08', platform: 'Windows, iOS' },
    { id: 101, title: 'Undertale', developer: 'Toby Fox', genre: 'Role-Playing Game', release_date: '2015-09-15', platform: 'Windows, macOS' },
    { id: 102, title: 'Paper Mario: The Thousand-Year Door', developer: 'Intelligent Systems', genre: 'Role-Playing Game', release_date: '2004-10-11', platform: 'Nintendo GameCube' },
    { id: 103, title: 'Ratchet & Clank: Going Commando', developer: 'Insomniac Games', genre: 'Third-Person Shooter Platform', release_date: '2003-11-11', platform: 'PlayStation 2' },
    { id: 104, title: 'Gravity Rush', developer: 'Team Gravity', genre: 'Action-Adventure', release_date: '2012-06-12', platform: 'PlayStation Vita' },
    { id: 105, title: 'Mega Man X', developer: 'Capcom', genre: 'Action-Platform', release_date: '1993-01-19', platform: 'SNES' }
];

app.get('/videogames', (req, res) => {
    const { title, developer, genre, platform } = req.query;
    let results = videoGames;

    if (title) {
        results = results.filter(game => game.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (developer) {
        results = results.filter(game => game.developer.toLowerCase().includes(developer.toLowerCase()));
    }
    if (genre) {
        results = results.filter(game => game.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    if (platform) {
        results = results.filter(game => game.platform.toLowerCase().includes(platform.toLowerCase()));
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/videogames/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM videogames WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.json({ message: 'Game not found' });
        }
        res.json(results[0]);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});