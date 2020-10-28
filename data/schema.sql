DROP TABLE IF EXISTS restaurant;

CREATE TABLE restaurant (
id SERIAL PRIMARY KEY,
<<<<<<< HEAD
city_name VARCHAR(255),
city_id VARCHAR(255),
entity_id VARCHAR (255),
latitude DECIMAL,
longitude DECIMAL,
name VARCHAR (255)
=======
name VARCHAR (255),
address VARCHAR (255),
rating_text TEXT,
featured_image VARCHAR (255),
price_range VARCHAR (255),
cuisine VARCHAR (255),
average_cost_for_two VARCHAR (255)
>>>>>>> d8c8eff5ad7d38a4c9d6d2f415d4e7ea3888a3e5
);