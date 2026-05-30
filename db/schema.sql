-- ============================================================
--  QuickBite Restaurant — PostgreSQL Schema
--  Compatible: PostgreSQL 13+
--  Run BEFORE ingest.sql
-- ============================================================

-- Useful extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fuzzy text search on products/names

-- ─────────────────────────────────────────────────────────────
--  CORE TABLES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(50)   NOT NULL UNIQUE,
    description   TEXT,
    display_order INTEGER       DEFAULT 0,
    is_active     BOOLEAN       DEFAULT TRUE,
    created_at    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id                       SERIAL PRIMARY KEY,
    category_id              INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name                     VARCHAR(100) NOT NULL,
    price                    NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    calories                 INTEGER,
    is_vegetarian            BOOLEAN       DEFAULT FALSE,
    is_spicy                 BOOLEAN       DEFAULT FALSE,
    is_featured              BOOLEAN       DEFAULT FALSE,
    is_available             BOOLEAN       DEFAULT TRUE,
    preparation_time_minutes INTEGER,
    description              TEXT,
    allergens                JSONB         DEFAULT '[]',  -- ["gluten","dairy","nuts",...]
    tags                     JSONB         DEFAULT '[]',  -- ["bestseller","spicy","vegan",...]
    image_url                VARCHAR(255),
    created_at               TIMESTAMPTZ   DEFAULT NOW(),
    updated_at               TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id                       SERIAL PRIMARY KEY,
    email                    VARCHAR(255) NOT NULL UNIQUE,
    password_hash            VARCHAR(255),
    first_name               VARCHAR(100),
    last_name                VARCHAR(100),
    phone                    VARCHAR(25),
    date_of_birth            DATE,
    gender                   CHAR(1),
    role                     VARCHAR(20)  DEFAULT 'customer',
    -- customer | admin | staff
    segment                  VARCHAR(20)  DEFAULT 'occasional',
    -- vip | regular | occasional | churned | staff
    is_active                BOOLEAN      DEFAULT TRUE,
    is_email_verified        BOOLEAN      DEFAULT FALSE,
    loyalty_tier             VARCHAR(20)  DEFAULT 'none',
    -- none | bronze | silver | gold | platinum
    dietary_preferences      JSONB,
    -- ["vegetarian","gluten_free","halal",...]  ← used for menu filtering
    notification_preferences JSONB        DEFAULT '{}',
    -- {"email":true,"push":true,"sms":false}
    referral_code            VARCHAR(20)  UNIQUE,
    referred_by_user_id      INTEGER      REFERENCES users(id) ON DELETE SET NULL,
    last_login_at            TIMESTAMPTZ,
    created_at               TIMESTAMPTZ  DEFAULT NOW(),
    updated_at               TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_addresses (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
    label         VARCHAR(50)  DEFAULT 'home',   -- home | work | other
    address_line1 VARCHAR(255),
    city          VARCHAR(100),
    state         VARCHAR(100),
    postal_code   VARCHAR(20),
    is_default    BOOLEAN      DEFAULT FALSE,
    created_at    TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS promotions (
    id                  SERIAL PRIMARY KEY,
    code                VARCHAR(50)   UNIQUE NOT NULL,
    name                VARCHAR(100),
    description         TEXT,
    discount_type       VARCHAR(20)   CHECK (discount_type IN ('percentage','fixed')),
    discount_value      NUMERIC(10,2),
    min_order_amount    NUMERIC(10,2) DEFAULT 0,
    max_discount_amount NUMERIC(10,2),
    usage_limit         INTEGER,      -- NULL = unlimited
    usage_count         INTEGER       DEFAULT 0,
    is_active           BOOLEAN       DEFAULT TRUE,
    starts_at           TIMESTAMPTZ,
    expires_at          TIMESTAMPTZ,
    created_at          TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id                         SERIAL PRIMARY KEY,
    order_number               VARCHAR(30)   UNIQUE NOT NULL,
    user_id                    INTEGER       REFERENCES users(id) ON DELETE SET NULL,
    status                     VARCHAR(30)   NOT NULL DEFAULT 'pending',
    -- pending | confirmed | preparing | ready | delivered | cancelled | failed
    order_type                 VARCHAR(20)   DEFAULT 'delivery',
    -- delivery | takeaway | dine_in
    subtotal                   NUMERIC(10,2),
    tax_amount                 NUMERIC(10,2),
    delivery_fee               NUMERIC(10,2) DEFAULT 0,
    discount_amount            NUMERIC(10,2) DEFAULT 0,
    total_amount               NUMERIC(10,2),
    payment_method             VARCHAR(30),
    -- card | cash | online | wallet
    payment_status             VARCHAR(20)   DEFAULT 'pending',
    -- pending | paid | failed | refunded
    promotion_id               INTEGER       REFERENCES promotions(id) ON DELETE SET NULL,
    delivery_address_id        INTEGER       REFERENCES user_addresses(id) ON DELETE SET NULL,
    special_instructions       TEXT,
    estimated_delivery_minutes INTEGER,
    actual_delivery_at         TIMESTAMPTZ,
    cancelled_reason           TEXT,
    failure_reason             TEXT,
    device_type                VARCHAR(20),  -- mobile | desktop | tablet
    app_version                VARCHAR(20),
    session_id                 VARCHAR(100),
    created_at                 TIMESTAMPTZ   DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id             SERIAL PRIMARY KEY,
    order_id       INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id     INTEGER REFERENCES products(id) ON DELETE SET NULL,
    quantity       INTEGER       NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price     NUMERIC(10,2),
    total_price    NUMERIC(10,2),
    customizations JSONB,         -- {"mods":["extra_cheese","no_onions"]}
    created_at     TIMESTAMPTZ   DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_status_history (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    status     VARCHAR(30),
    notes      TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
--  ENGAGEMENT & LOYALTY TABLES
-- ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS reviews (
    id            SERIAL PRIMARY KEY,
    user_id       INTEGER   REFERENCES users(id) ON DELETE SET NULL,
    order_id      INTEGER   REFERENCES orders(id) ON DELETE SET NULL,
    product_id    INTEGER   REFERENCES products(id) ON DELETE SET NULL,
    rating        SMALLINT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title         VARCHAR(255),
    comment       TEXT,
    is_verified   BOOLEAN   DEFAULT TRUE,
    sentiment     VARCHAR(20),   -- positive | neutral | negative  ← ML-ready
    helpful_count INTEGER   DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_points (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id         INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    points           INTEGER NOT NULL,
    transaction_type VARCHAR(20) CHECK (transaction_type IN ('earned','redeemed','expired','adjusted')),
    balance_after    INTEGER,
    description      TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id                       SERIAL PRIMARY KEY,
    user_id                  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    device_type              VARCHAR(20),
    browser                  VARCHAR(50),
    platform                 VARCHAR(50),
    pages_visited            INTEGER DEFAULT 1,
    session_duration_seconds INTEGER,
    bounce                   BOOLEAN DEFAULT FALSE,  -- single-page session
    created_at               TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
--  FUTURE-READY TABLES  (schema seeded, populate when needed)
-- ─────────────────────────────────────────────────────────────

-- Push / Email / SMS notification log
CREATE TABLE IF NOT EXISTS notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50),    -- order_update | promo | loyalty | system | reminder
    channel    VARCHAR(20),    -- push | email | sms
    title      VARCHAR(255),
    body       TEXT,
    is_read    BOOLEAN         DEFAULT FALSE,
    sent_at    TIMESTAMPTZ,
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ     DEFAULT NOW()
);

-- Saved favourite products per user  (powers a "Reorder" feature)
CREATE TABLE IF NOT EXISTS user_favourites (
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- Waitlist for busy dine-in periods
CREATE TABLE IF NOT EXISTS waitlist (
    id         SERIAL PRIMARY KEY,
    user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
    party_size INTEGER,
    notes      TEXT,
    status     VARCHAR(20) DEFAULT 'waiting',   -- waiting | seated | cancelled | no_show
    joined_at  TIMESTAMPTZ DEFAULT NOW(),
    seated_at  TIMESTAMPTZ
);

-- A/B experiment framework
CREATE TABLE IF NOT EXISTS ab_experiments (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE,
    description TEXT,
    variants    JSONB,          -- {"control":0.5,"variant_a":0.25,"variant_b":0.25}
    metric      VARCHAR(100),   -- conversion_rate | avg_order_value | retention
    is_active   BOOLEAN DEFAULT TRUE,
    started_at  TIMESTAMPTZ,
    ended_at    TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_ab_assignments (
    user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
    experiment_id INTEGER REFERENCES ab_experiments(id) ON DELETE CASCADE,
    variant       VARCHAR(50),
    assigned_at   TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, experiment_id)
);

-- Daily product inventory snapshot
CREATE TABLE IF NOT EXISTS product_inventory (
    id                 SERIAL PRIMARY KEY,
    product_id         INTEGER REFERENCES products(id) ON DELETE CASCADE,
    snapshot_date      DATE NOT NULL,
    quantity_available INTEGER DEFAULT 0,
    quantity_sold      INTEGER DEFAULT 0,
    quantity_wasted    INTEGER DEFAULT 0,
    reorder_threshold  INTEGER DEFAULT 20,
    UNIQUE (product_id, snapshot_date)
);

-- Staff profiles  (linked to users with role='staff')
CREATE TABLE IF NOT EXISTS staff (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id),
    employee_id VARCHAR(20) UNIQUE,
    position    VARCHAR(50),    -- manager | cashier | kitchen | delivery | host
    department  VARCHAR(50),
    shift       VARCHAR(20),    -- morning | afternoon | evening | night
    hire_date   DATE,
    is_active   BOOLEAN DEFAULT TRUE,
    hourly_rate NUMERIC(6,2),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Table reservations  (matches your existing ReservationPage)
CREATE TABLE IF NOT EXISTS reservations (
    id             SERIAL PRIMARY KEY,
    user_id        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    guest_name     VARCHAR(255),
    guest_email    VARCHAR(255),
    guest_phone    VARCHAR(25),
    party_size     INTEGER NOT NULL,
    reservation_dt TIMESTAMPTZ NOT NULL,
    table_number   INTEGER,
    status         VARCHAR(20) DEFAULT 'pending',
    -- pending | confirmed | seated | completed | cancelled | no_show
    special_requests TEXT,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────
--  SEQUENCES — advance past CSV data
--  (called from ingest.sql after COPY)
-- ─────────────────────────────────────────────────────────────
-- See ingest.sql for SELECT setval(...) statements
