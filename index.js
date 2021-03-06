/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
var sha256 = require('js-sha256');
const cookieParser = require('cookie-parser');


// Initialise postgres client
const config = {
  user: 'sabrinachow',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

if (config.user === 'ck') {
	throw new Error("====== UPDATE YOUR DATABASE CONFIGURATION =======");
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'home', {pokemon: result.rows} );
    }
  });
}

const getNew = (request, response) => {
  response.render('new');
}

const getPokemon = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon', {pokemon: result.rows[0]} );
    }
  });
}

const postPokemon = (request, response) => {
  console.log('cookie: '+ request.cookie);
  // console.log(request);
  let params = request.body;
  
  console.log('cookies: ' + request.cookies)
  
  if (request.cookies['users_id'] == null) {
    const queryString = 'INSERT INTO pokemon(name, height) VALUES($1, $2);';
    const values = [params.name, params.height];
  } else {
    const queryString = 'INSERT INTO pokemon(name, height, users_id) VALUES($1, $2, $3);';
    const values = [params.name, params.height, request.cookies['users_id']];
  }
  

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params['id'];
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'edit', {pokemon: result.rows[0]} );
    }
  });
}

const updatePokemon = (request, response) => {
  let id = request.params['id'];
  let pokemon = request.body;
  const queryString = 'UPDATE "pokemon" SET "num"=($1), "name"=($2), "img"=($3), "height"=($4), "weight"=($5) WHERE "id"=($6)';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, id];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

const deletePokemonForm = (request, response) => {
  response.send("COMPLETE ME");
}

const deletePokemon = (request, response) => {
  response.send("COMPLETE ME");
}

const userCreationForm = (request, response) => {
  response.render('userCreationForm');
}

const userCreation = (request, response) => {
  console.log(request.body);
  const queryString = 'INSERT INTO users(username, email, password_hash) VALUES($1, $2, $3);';
  const values = [request.body.username, request.body.email, sha256(request.body.password)];
  
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to login page
      response.redirect('/login');
    }
  });
}

const login = (request, response) => {
  response.render('login');
}

const loginCheck = (request, response) => {
  console.log(request.cookies);
  let check = sha256(request.body.password);
  let username = request.body.username;

  const queryString = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      if (result.rows[0] == null) {
        response.send("wrong password/ username");
      } else if(result.rows[0].password_hash == check) {
        response.cookie('loginStatus', 'true');
        response.cookie('users_id', result.rows[0].id);
        response.send("you are logged in!");
      } else {
        response.send("wrong password/ username");
      };
    }
  });
}

const logout = (request, response) => {
  console.log('loginStatus: ' + request.cookies['loginStatus']);
    if (request.cookies != null) {
      console.log('got through');
      if (request.cookies['loginStatus'] == 'true') {
        console.log('got through2');
        response.cookie('loginStatus', false);
        console.log('log out');
        response.send('you r logged out!');
      }
    }
}
/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);

app.post('/pokemons', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users
app.use(cookieParser());
app.get('/userCreationForm', userCreationForm);
app.post('/userCreation', userCreation);
app.get('/login', login);
app.post('/loginCheck', loginCheck);
app.get('/logout', logout);


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


