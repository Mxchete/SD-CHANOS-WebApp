-- provides gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- USERS
-- TODO: Total refactor of users
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(320) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    given_name VARCHAR(255),
    family_name VARCHAR(255),
    picture_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- PLANTS
CREATE TABLE public.plants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    parent_id UUID,
    name TEXT NOT NULL,
    -- image_url TEXT, -- not supported yet
    watering_timer_useconds BIGINT,
    sampling_period INT,
    maximum_moisture_level DOUBLE PRECISION,
    minimum_moisture_level DOUBLE PRECISION,
    smv_percentage DOUBLE PRECISION,
    maximum_sunlight DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- POTs
CREATE TABLE public.pots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Unnamed Plant',
    user_id UUID,
    plant_id UUID,
    image_url TEXT,
    battery_level DOUBLE PRECISION,
    water_level_is_low BOOLEAN,
    current_moisture_level DOUBLE PRECISION,
    lux_value DOUBLE PRECISION,
    total_sunlight INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NOTIFICATIONs
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    pot_id UUID,
    header TEXT,
    message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Connect plants to users and parents if applicable
ALTER TABLE public.plants
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE public.plants
    ADD FOREIGN KEY (parent_id)
    REFERENCES public.plants (id)
    ON DELETE SET NULL
    NOT VALID;

-- Connect pots to users and plants if applicable
ALTER TABLE public.pots
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE public.pots
    ADD FOREIGN KEY (plant_id)
    REFERENCES public.plants (id)
    ON DELETE SET NULL
    NOT VALID;

-- Connect notifications to users
ALTER TABLE public.notifications
    ADD FOREIGN KEY (user_id)
    REFERENCES public.users (id)
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE public.notifications
    ADD FOREIGN KEY (pot_id)
    REFERENCES public.pots (id)
    ON DELETE CASCADE
    NOT VALID;

ALTER TABLE public.notifications
    ADD CONSTRAINT notifications_user_header_unique UNIQUE (user_id, header, pot_id);

-- Indexes for lookups
CREATE INDEX ON plants (user_id);
CREATE INDEX ON pots (user_id);
CREATE INDEX ON pots (id);
CREATE INDEX ON notifications (user_id);

-- Can define our global plants here, without a user UUID
INSERT INTO public.plants (name, watering_timer_useconds, sampling_period, maximum_moisture_level, minimum_moisture_level, smv_percentage, maximum_sunlight) VALUES ('Prickly Pear Cactus', 604800000000, 600000000, 0, 100, 90, 1000);
