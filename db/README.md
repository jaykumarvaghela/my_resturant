# QuickBite — Database Seed Data

## What's included

| File | Rows | Description |
|------|------|-------------|
| `categories.csv` | 9 | 9 menu categories |
| `products.csv` | 52 | Full menu with allergens, tags, calories |
| `promotions.csv` | 63 | Recurring, seasonal & flash promos |
| `users.csv` | 20,001 | 20k customers + 1 admin |
| `user_addresses.csv` | 26,992 | Delivery addresses |
| `orders.csv` | 378,510 | 3 years of orders |
| `order_items.csv` | 920,075 | Line items per order |
| `order_status_history.csv` | 1,715,149 | Full status audit trail |
| `reviews.csv` | 121,144 | Ratings with sentiment field |
| `loyalty_points.csv` | 327,071 | Points earned & redeemed |
| `user_sessions.csv` | 79,691 | Web/app sessions |

**Total: ~3.6 million rows across 11 tables**

---

## How to ingest

### 1. Create the schema
```bash
psql -U postgres -d quickbite -f schema.sql
```

### 2. Load all CSV data
```bash
# Run from the folder that CONTAINS the seed_data/ directory
psql -U postgres -d quickbite -f ingest.sql
```

> **Windows (Docker):** Copy the `seed_data/` folder into your container first:
> ```bash
> docker cp seed_data/ <container_id>:/seed_data/
> docker exec -it <container_id> psql -U postgres -d quickbite -f /ingest.sql
> ```

---

## Data design highlights

### User segments (for analytics & targeting)
| Segment | % of users | Avg orders/month | Loyalty tier |
|---------|-----------|-----------------|--------------|
| `vip` | 5% | 4–8 | Gold / Platinum |
| `regular` | 30% | 1–3 | Silver / Gold |
| `occasional` | 40% | 0.2–0.8 | Bronze / Silver |
| `churned` | 25% | 0.05–0.2 | None / Bronze |

### Order status distribution
- ✅ `delivered` — 80%
- ❌ `cancelled` — ~11%
- 💳 `failed` (payment) — ~5%
- 🔄 `cancelled` mid-prep — ~4%

### Seasonal demand patterns built in
- **Summer (Jun–Aug):** +28% orders, seasonal BBQ items available
- **Holiday (Nov–Dec):** +32–42% orders, turkey burger available
- **Fall (Sep–Nov):** Pumpkin Spice Shake available
- **February:** Valentine's Heart Brownie

### Forward-thinking columns
| Column | Table | Enables feature |
|--------|-------|----------------|
| `dietary_preferences` | users | Menu filtering / allergen alerts |
| `notification_preferences` | users | Push / email / SMS settings |
| `referral_code` + `referred_by_user_id` | users | Referral rewards program |
| `segment` | users | Targeted promotions, churn prediction |
| `loyalty_tier` | users | Tiered rewards (Bronze→Platinum) |
| `sentiment` | reviews | NLP / ML sentiment pipeline |
| `tags` + `allergens` | products | Smart search, dietary filtering |
| `device_type` + `app_version` | orders | Mobile funnel analytics |
| `session_id` | orders | Conversion rate tracking |
| `customizations` | order_items | Upsell analytics |

### Future-ready empty tables (schema only)
- `notifications` — push/email/SMS log
- `user_favourites` — "Reorder" feature
- `waitlist` — dine-in queue management
- `ab_experiments` — A/B testing framework
- `product_inventory` — daily stock snapshots
- `staff` — employee scheduling
- `reservations` — table booking (matches your ReservationPage)

---

## Useful queries to get started

```sql
-- Revenue by month
SELECT DATE_TRUNC('month', created_at) AS month,
       COUNT(*) AS orders, ROUND(SUM(total_amount)::numeric, 2) AS revenue
FROM orders WHERE status = 'delivered'
GROUP BY 1 ORDER BY 1;

-- Top 10 products by revenue
SELECT p.name, COUNT(oi.id) AS times_ordered, SUM(oi.total_price) AS revenue
FROM order_items oi JOIN products p ON p.id = oi.product_id
GROUP BY p.name ORDER BY revenue DESC LIMIT 10;

-- User retention by segment
SELECT segment, COUNT(*) AS users,
       ROUND(AVG(EXTRACT(EPOCH FROM (last_login_at - created_at))/86400)) AS avg_active_days
FROM users GROUP BY segment;

-- Average rating per product
SELECT p.name, ROUND(AVG(r.rating)::numeric,2) AS avg_rating, COUNT(*) AS review_count
FROM reviews r JOIN products p ON p.id = r.product_id
GROUP BY p.name ORDER BY avg_rating DESC;
```

---

## Admin credentials
- **Email:** admin@quickbite.com
- **Password:** admin123
- **User ID:** 1

## Regenerating data
```bash
pip install faker   # optional, not required
python generate_data.py
```
