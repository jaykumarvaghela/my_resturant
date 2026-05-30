-- ============================================================
--  QuickBite — Optimized Bulk Ingestion Script
--  Strategy: COPY >> indexes >> constraints >> sequences
--  Run after schema.sql
-- ============================================================

-- ── Step 1: Drop indexes before bulk load (rebuild after = 5-10x faster) ──
SET client_min_messages = WARNING;

-- ── Step 2: Disable triggers / FK checks during load ──
SET session_replication_role = replica;

-- ── Step 3: COPY all tables ──────────────────────────────────────────────────
--  Edit the path below to wherever you placed the seed_data/ folder.
--  Windows example : 'C:/Users/Romeo07/Desktop/food/my_resturant/database/seed_data/categories.csv'
--  Linux/Mac       : '/home/user/my_resturant/database/seed_data/categories.csv'

\set data_dir 'seed_data'   -- relative path, or use absolute

\echo '>>> Loading categories...'
COPY categories (id,name,description,display_order,is_active,created_at)
FROM PROGRAM 'cat seed_data/categories.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading products...'
COPY products (id,category_id,name,price,calories,is_vegetarian,is_spicy,is_featured,is_available,preparation_time_minutes,description,allergens,tags,image_url,created_at,updated_at)
FROM PROGRAM 'cat seed_data/products.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading promotions...'
COPY promotions (id,code,name,description,discount_type,discount_value,min_order_amount,max_discount_amount,usage_limit,usage_count,is_active,starts_at,expires_at,created_at)
FROM PROGRAM 'cat seed_data/promotions.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading users (20k)...'
COPY users (id,email,password_hash,first_name,last_name,phone,date_of_birth,gender,role,segment,is_active,is_email_verified,loyalty_tier,dietary_preferences,notification_preferences,referral_code,referred_by_user_id,last_login_at,created_at,updated_at)
FROM PROGRAM 'cat seed_data/users.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading user_addresses...'
COPY user_addresses (id,user_id,label,address_line1,city,state,postal_code,is_default,created_at)
FROM PROGRAM 'cat seed_data/user_addresses.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading orders (378k)...'
COPY orders (id,order_number,user_id,status,order_type,subtotal,tax_amount,delivery_fee,discount_amount,total_amount,payment_method,payment_status,promotion_id,delivery_address_id,special_instructions,estimated_delivery_minutes,actual_delivery_at,cancelled_reason,failure_reason,device_type,app_version,session_id,created_at,updated_at)
FROM PROGRAM 'cat seed_data/orders.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading order_items (920k)...'
COPY order_items (id,order_id,product_id,quantity,unit_price,total_price,customizations,created_at)
FROM PROGRAM 'cat seed_data/order_items.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading order_status_history (1.7M)...'
COPY order_status_history (id,order_id,status,notes,created_at)
FROM PROGRAM 'cat seed_data/order_status_history.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading reviews (121k)...'
COPY reviews (id,user_id,order_id,product_id,rating,title,comment,is_verified,sentiment,helpful_count,created_at)
FROM PROGRAM 'cat seed_data/reviews.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading loyalty_points (327k)...'
COPY loyalty_points (id,user_id,order_id,points,transaction_type,balance_after,description,created_at)
FROM PROGRAM 'cat seed_data/loyalty_points.csv'
WITH (FORMAT csv, HEADER true, NULL '');

\echo '>>> Loading user_sessions (79k)...'
COPY user_sessions (id,user_id,device_type,browser,platform,pages_visited,session_duration_seconds,bounce,created_at)
FROM PROGRAM 'cat seed_data/user_sessions.csv'
WITH (FORMAT csv, HEADER true, NULL '');

-- ── Step 4: Re-enable FK checks ──────────────────────────────────────────────
SET session_replication_role = DEFAULT;

-- ── Step 5: Build indexes AFTER data load (much faster than before) ──────────
\echo '>>> Building indexes...'

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_segment        ON users(segment);
CREATE INDEX IF NOT EXISTS idx_users_loyalty_tier   ON users(loyalty_tier);
CREATE INDEX IF NOT EXISTS idx_users_created_at     ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_referral_code  ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_diet_gin       ON users USING gin(dietary_preferences);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category    ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available   ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured    ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_products_name_trgm   ON products USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_tags_gin    ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_products_allergens   ON products USING gin(allergens);

-- Orders  (most query-heavy table)
CREATE INDEX IF NOT EXISTS idx_orders_user          ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status        ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at    ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_type          ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_promotion     ON orders(promotion_id) WHERE promotion_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user_created  ON orders(user_id, created_at DESC);  -- reorder history

-- Order items
CREATE INDEX IF NOT EXISTS idx_order_items_order    ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product  ON order_items(product_id);

-- Status history
CREATE INDEX IF NOT EXISTS idx_status_order         ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_status_created       ON order_status_history(created_at DESC);

-- Reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product      ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user         ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating       ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_sentiment    ON reviews(sentiment);

-- Loyalty
CREATE INDEX IF NOT EXISTS idx_loyalty_user         ON loyalty_points(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_created      ON loyalty_points(created_at DESC);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_sessions_user        ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created     ON user_sessions(created_at DESC);

-- User addresses
CREATE INDEX IF NOT EXISTS idx_addresses_user       ON user_addresses(user_id);

-- ── Step 6: Advance sequences so new INSERTs don't collide ───────────────────
\echo '>>> Syncing sequences...'
SELECT setval('categories_id_seq',        (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq',          (SELECT MAX(id) FROM products));
SELECT setval('promotions_id_seq',        (SELECT MAX(id) FROM promotions));
SELECT setval('users_id_seq',             (SELECT MAX(id) FROM users));
SELECT setval('user_addresses_id_seq',    (SELECT MAX(id) FROM user_addresses));
SELECT setval('orders_id_seq',            (SELECT MAX(id) FROM orders));
SELECT setval('order_items_id_seq',       (SELECT MAX(id) FROM order_items));
SELECT setval('order_status_history_id_seq', (SELECT MAX(id) FROM order_status_history));
SELECT setval('reviews_id_seq',           (SELECT MAX(id) FROM reviews));
SELECT setval('loyalty_points_id_seq',    (SELECT MAX(id) FROM loyalty_points));
SELECT setval('user_sessions_id_seq',     (SELECT MAX(id) FROM user_sessions));

-- ── Step 7: Analyze so query planner has accurate stats ──────────────────────
\echo '>>> Analyzing tables...'
ANALYZE categories;
ANALYZE products;
ANALYZE promotions;
ANALYZE users;
ANALYZE user_addresses;
ANALYZE orders;
ANALYZE order_items;
ANALYZE order_status_history;
ANALYZE reviews;
ANALYZE loyalty_points;
ANALYZE user_sessions;

\echo '>>> DONE. QuickBite seed data loaded successfully!'

-- ── Quick sanity check ────────────────────────────────────────────────────────
SELECT
    'categories'           AS table_name, COUNT(*) AS row_count FROM categories UNION ALL
SELECT 'products',          COUNT(*) FROM products            UNION ALL
SELECT 'promotions',        COUNT(*) FROM promotions          UNION ALL
SELECT 'users',             COUNT(*) FROM users               UNION ALL
SELECT 'user_addresses',    COUNT(*) FROM user_addresses      UNION ALL
SELECT 'orders',            COUNT(*) FROM orders              UNION ALL
SELECT 'order_items',       COUNT(*) FROM order_items         UNION ALL
SELECT 'order_status_history', COUNT(*) FROM order_status_history UNION ALL
SELECT 'reviews',           COUNT(*) FROM reviews             UNION ALL
SELECT 'loyalty_points',    COUNT(*) FROM loyalty_points      UNION ALL
SELECT 'user_sessions',     COUNT(*) FROM user_sessions
ORDER BY 1;
