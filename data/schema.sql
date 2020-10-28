DROP TABLE IF EXISTS restaurant;

CREATE TABLE restaurant (
id SERIAL PRIMARY KEY,
name VARCHAR (255),
address VARCHAR (255),
rating_text TEXT,
photos_url VARCHAR (255),
price_range VARCHAR (255),
cuisine VARCHAR (255),
average_cost_for_two VARCHAR (255)
);