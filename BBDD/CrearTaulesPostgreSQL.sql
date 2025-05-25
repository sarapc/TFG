-- Usuari
CREATE TABLE usuari (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  cognoms TEXT NOT NULL,
  correu TEXT UNIQUE NOT NULL
);

-- Fites
CREATE TABLE fites (
  id SERIAL PRIMARY KEY,
  ncomentaris INTEGER DEFAULT 0,
  nrutes INTEGER DEFAULT 0,
  nvaloracions INTEGER DEFAULT 0,
  idusuari INTEGER REFERENCES usuari(id) ON DELETE CASCADE
);

-- Ciutat
CREATE TABLE ciutat (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  enllacimatge TEXT
);

-- Lloc
CREATE TABLE lloc (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  descripcio TEXT,
  enllacimatge TEXT,
  horari TEXT,
  boolmenjar BOOLEAN DEFAULT FALSE,
  boolentrada BOOLEAN DEFAULT FALSE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  duradamitjana INTEGER,
  enllacentrades TEXT,
  idciutat INTEGER REFERENCES ciutat(id) ON DELETE CASCADE
);

-- Puntuació
CREATE TABLE puntuacio (
  id SERIAL PRIMARY KEY,
  valor INTEGER CHECK (valor >= 1 AND valor <= 5),
  idruta INTEGER REFERENCES ruta(id) ON DELETE CASCADE
);

-- Comentari
CREATE TABLE comentari (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  idruta INTEGER REFERENCES ruta(id) ON DELETE CASCADE
);

-- Ruta
CREATE TABLE ruta (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  data DATE NOT NULL
);

-- RutaUsuari
CREATE TABLE ruta_usuari (
  id SERIAL PRIMARY KEY,
  idruta INTEGER REFERENCES ruta(id) ON DELETE CASCADE,
  idusuari INTEGER REFERENCES usuari(id) ON DELETE CASCADE
);

-- RutaLloc
CREATE TABLE rutalloc (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idruta INTEGER REFERENCES ruta(id) ON DELETE CASCADE,
  idlloc INTEGER REFERENCES lloc(id) ON DELETE CASCADE,
  ordre INTEGER
);