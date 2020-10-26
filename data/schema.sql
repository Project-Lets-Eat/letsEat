DROP TABLE IF EXISTS restaurant;

CREATE TABLE restaurant (
id SERIAL PRIMARY KEY,
city_name VARCHAR(255),
city_id VARCHAR(255),
entity_id VARCHAR (255),
latitude DECIMAL,
longitude DECIMAL
);