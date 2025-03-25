CREATE TABLE IF NOT EXISTS Products (
    id SERIAL PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    images TEXT,
    barcode VARCHAR(255),
    itemWeight FLOAT,
    ingredients TEXT,
    productDescription TEXT,
    storageRequirements VARCHAR(50),
    itemsPerPackage INT,
    color VARCHAR(50),
    material VARCHAR(50),
    width FLOAT,
    height FLOAT,
    warranty INT
);