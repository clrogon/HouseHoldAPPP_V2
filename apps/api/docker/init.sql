-- PostgreSQL initialization script for Household Hero
-- This runs once when the container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant full privileges to the household user
GRANT ALL PRIVILEGES ON DATABASE household_db TO household;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Household Hero database initialized successfully';
END $$;
