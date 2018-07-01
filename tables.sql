CREATE TABLE IF NOT EXISTS pokemon (
    id SERIAL PRIMARY KEY,
    num VARCHAR(3),
    name TEXT,
    img TEXT,
    height VARCHAR(15),
    weight VARCHAR(15),
    candy VARCHAR(15), 
    candy_count VARCHAR(100),
    egg VARCHAR(100),
    avg_spawns VARCHAR(15),
    spawn_time VARCHAR(15)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255)
);
