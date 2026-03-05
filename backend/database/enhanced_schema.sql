-- Enhanced Database Schema with ENUMs and Constraints

-- Create ENUM types for better data integrity
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('participant', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('open', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE join_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Users table with ENUM
ALTER TABLE users 
  ALTER COLUMN role TYPE user_role USING role::user_role;

-- Registrations table with ENUM
ALTER TABLE registrations 
  ALTER COLUMN status TYPE registration_status USING status::registration_status;

-- Team member requests with ENUM
ALTER TABLE team_member_requests 
  ALTER COLUMN status TYPE request_status USING status::request_status;

-- Join requests with ENUM
ALTER TABLE join_requests 
  ALTER COLUMN status TYPE join_status USING status::join_status;

-- Add CHECK constraints
ALTER TABLE events 
  ADD CONSTRAINT check_team_size CHECK (min_team_size > 0 AND max_team_size >= min_team_size),
  ADD CONSTRAINT check_fee CHECK (fee >= 0),
  ADD CONSTRAINT check_deadline CHECK (registration_deadline < date);

ALTER TABLE teams
  ADD CONSTRAINT check_invite_code_length CHECK (length(invite_code) = 6);

-- Add NOT NULL constraints where needed
ALTER TABLE events 
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN date SET NOT NULL,
  ALTER COLUMN registration_deadline SET NOT NULL;

ALTER TABLE users
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN password SET NOT NULL,
  ALTER COLUMN name SET NOT NULL;
