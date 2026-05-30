#!/usr/bin/env python3
"""QuickBite — Synthetic Data Generator (Pure Python 3, no deps)"""
import csv, json, os, random, hashlib, time
from datetime import datetime, timedelta

random.seed(42)
t0 = time.time()
NUM_USERS = 20_000
OUT = "seed_data"
START = datetime(2023, 5, 30)
END   = datetime(2026, 5, 29, 23, 59, 59)
DAYS  = (END - START).days
os.makedirs(OUT, exist_ok=True)

def fp(n): return os.path.join(OUT, n)
def ts(d): return d.strftime("%Y-%m-%d %H:%M:%S")
def W(n):  return open(fp(n), "w", newline="", encoding="utf-8")

C = {k:0 for k in "addr promo order item stat rev loy sess".split()}
def nxt(k): C[k]+=1; return C[k]

MF="James John Robert Michael William David Richard Joseph Thomas Charles Christopher Daniel Matthew Anthony Mark Steven Paul Andrew Joshua Kenneth Kevin Brian George Timothy Edward Jason Jeffrey Ryan Jacob Gary Nicholas Eric Jonathan Stephen Larry Justin Scott Brandon Benjamin Samuel Gregory Frank Alexander Jack Dennis Tyler Aaron Nathan Henry Zachary Peter Kyle Noah Ethan Jeremy Walter Keith Austin Roger Terry Sean Gerald Carl Harold Dylan Lawrence Jordan Jesse Bryan Billy Bruce Gabriel Logan".split()
FF="Mary Patricia Jennifer Linda Barbara Elizabeth Susan Jessica Sarah Karen Lisa Nancy Betty Margaret Sandra Ashley Dorothy Kimberly Emily Donna Michelle Carol Amanda Melissa Deborah Stephanie Rebecca Sharon Laura Cynthia Kathleen Amy Angela Anna Brenda Pamela Emma Nicole Helen Samantha Katherine Christine Rachel Carolyn Janet Catherine Maria Heather Diane Julie Joyce Victoria Kelly Christina Joan Evelyn Lauren Judith Olivia Frances Martha Cheryl Megan Andrea Hannah Jacqueline Teresa Kathryn Sara Janice Julia Marie Madison Grace Theresa Beverly Denise Marilyn Amber Danielle Brittany".split()
LS="Smith Johnson Williams Brown Jones Garcia Miller Davis Rodriguez Martinez Hernandez Lopez Gonzalez Wilson Anderson Thomas Taylor Moore Jackson Martin Lee Perez Thompson White Harris Sanchez Clark Ramirez Lewis Robinson Walker Young Allen King Wright Scott Torres Nguyen Hill Flores Green Adams Nelson Baker Hall Rivera Campbell Mitchell Carter Roberts Reed Cook Morgan Bell Murphy Bailey Cooper Richardson Cox Howard Peterson Watson Brooks Kelly Sanders Price Bennett Wood Barnes Ross Henderson Coleman Jenkins Perry Powell Long Hughes Washington Butler Simmons Foster Bryant Alexander Russell Griffin Diaz Hayes Myers Ford Hamilton Graham Sullivan Wallace Cole West Jordan Owens Reynolds Fisher Ellis Harrison Gibson Cruz Marshall Ortiz Gomez Murray Freeman Wells Webb Simpson Stevens Tucker Porter Hunter Hicks Crawford Boyd Mason Morales Kennedy Warren Dixon Ramos Reyes Burns Gordon Shaw Holmes Rice Robertson Hunt Black Daniels Palmer Mills Nichols Grant Knight Ferguson Stone Hawkins Dunn Perkins Hudson Spencer Gardner Stephens Payne Berry Matthews Arnold Wagner Willis Ray Watkins Olson Carroll Duncan Hart Bradley Lane Andrews Ruiz Harper Fox Riley Armstrong Weaver Greene Elliott Chavez Peters Franklin Lawson".split()
DOMAINS="gmail.com yahoo.com hotmail.com outlook.com icloud.com live.com protonmail.com aol.com".split()
CITIES=[("New York","NY","100"),("Los Angeles","CA","900"),("Chicago","IL","606"),("Houston","TX","770"),("Phoenix","AZ","850"),("Philadelphia","PA","191"),("San Antonio","TX","782"),("San Diego","CA","921"),("Dallas","TX","752"),("San Jose","CA","951"),("Austin","TX","787"),("Jacksonville","FL","322"),("Charlotte","NC","282"),("Indianapolis","IN","462"),("San Francisco","CA","941"),("Seattle","WA","981"),("Denver","CO","802"),("Nashville","TN","372"),("Las Vegas","NV","891"),("Boston","MA","021"),("Portland","OR","972"),("Memphis","TN","381"),("Louisville","KY","402"),("Baltimore","MD","212"),("Milwaukee","WI","532"),("Atlanta","GA","303"),("Kansas City","MO","641"),("Miami","FL","331"),("Minneapolis","MN","554"),("Tampa","FL","336"),("Raleigh","NC","276"),("Omaha","NE","681"),("Tucson","AZ","857"),("Fresno","CA","937"),("Sacramento","CA","958"),("Mesa","AZ","852"),("El Paso","TX","799"),("Colorado Springs","CO","809")]
STREETS=["Main St","Oak Ave","Maple Dr","Cedar Ln","Pine St","Elm Ave","Washington Blvd","Park Rd","Lake Dr","Hill Rd","River Rd","Valley Dr","Sunset Blvd","Broadway","First Ave","Second St","Third Ave","Walnut St","Birch Rd","Magnolia Ave","Sycamore St","College Blvd","University Dr","Summit Ave","Meadow Dr","Market St","Commerce Blvd","Center Ave","Church St","Harbor Dr"]

CATS=[(1,"Burgers","Handcrafted beef and chicken burgers",1,True),(2,"Chicken","Crispy and grilled chicken specialties",2,True),(3,"Sides","Perfect companions to any meal",3,True),(4,"Drinks","Refreshing beverages and milkshakes",4,True),(5,"Desserts","Sweet treats to finish your meal",5,True),(6,"Breakfast","Morning favorites served all day",6,True),(7,"Combos","Value meal combinations",7,True),(8,"Seasonal","Limited-time seasonal specials",8,True),(9,"Salads","Fresh and healthy options",9,True)]

PRODS=[
(1,1,"Classic Smash Burger",8.99,550,0,0,1,8,"Juicy smash patty with lettuce, tomato, and our secret sauce",'["gluten","dairy","egg"]','["bestseller","classic","beef"]'),
(2,1,"Double Cheese Burger",10.99,750,0,0,1,10,"Two beef patties stacked with double American cheese",'["gluten","dairy"]','["classic","beef","cheesy"]'),
(3,1,"BBQ Bacon Burger",12.99,850,0,0,0,10,"Smoky BBQ sauce, crispy bacon, and caramelized onions",'["gluten","dairy","pork"]','["bbq","bacon","beef"]'),
(4,1,"Spicy Jalapeno Burger",11.49,680,0,1,1,8,"Fresh jalapenos, pepper jack cheese, and chipotle mayo",'["gluten","dairy","egg"]','["spicy","beef","hot"]'),
(5,1,"Mushroom Swiss Burger",11.99,620,0,0,0,10,"Sauteed mushrooms and melted Swiss cheese on a brioche bun",'["gluten","dairy"]','["classic","beef","mushroom"]'),
(6,1,"Crispy Chicken Burger",9.99,590,0,0,1,12,"Buttermilk-marinated crispy chicken breast with pickles",'["gluten","dairy","egg"]','["bestseller","chicken","crispy"]'),
(7,1,"Veggie Garden Burger",9.49,420,1,0,0,10,"House-made black bean and quinoa patty with avocado",'["gluten"]','["vegetarian","vegan","healthy"]'),
(8,1,"The QuickBite Special",14.99,950,0,1,1,12,"Double patty, 3 cheeses, bacon, fried egg, and special sauce",'["gluten","dairy","egg","pork"]','["signature","premium","indulgent"]'),
(9,2,"Crispy Tenders 3pc",7.99,380,0,0,1,10,"Hand-breaded chicken tenders with choice of dipping sauce",'["gluten","egg"]','["bestseller","chicken","crispy"]'),
(10,2,"Crispy Tenders 6pc",13.99,760,0,0,0,12,"Six golden crispy tenders great for sharing",'["gluten","egg"]','["sharing","chicken","crispy"]'),
(11,2,"Grilled Chicken Wrap",8.99,450,0,0,0,8,"Grilled chicken, romaine, tomato, and ranch in a flour tortilla",'["gluten","dairy"]','["healthy","chicken","wrap"]'),
(12,2,"Buffalo Wings 6pc",10.99,520,0,1,1,15,"Slow-cooked wings tossed in our signature buffalo sauce",'["dairy"]','["spicy","wings","buffalo","sharing"]'),
(13,2,"Buffalo Wings 12pc",18.99,1040,0,1,0,18,"Double up on our fan-favorite buffalo wings",'["dairy"]','["spicy","wings","sharing","party"]'),
(14,2,"Nashville Hot Tenders",9.49,440,0,1,0,10,"Tenders tossed in fiery Nashville hot spice blend",'["gluten","egg"]','["spicy","chicken","nashville"]'),
(15,3,"Classic Fries Small",2.99,230,1,0,0,5,"Golden crispy fries lightly salted",'["gluten"]','["vegetarian","vegan","side"]'),
(16,3,"Classic Fries Medium",3.99,340,1,0,1,5,"Golden crispy fries lightly salted",'["gluten"]','["vegetarian","bestseller","side"]'),
(17,3,"Classic Fries Large",4.99,450,1,0,0,5,"Golden crispy fries lightly salted",'["gluten"]','["vegetarian","vegan","side"]'),
(18,3,"Loaded Cheese Fries",5.99,580,1,0,1,7,"Fries topped with nacho cheese, jalapenos, and sour cream",'["gluten","dairy"]','["vegetarian","cheesy","indulgent","side"]'),
(19,3,"Onion Rings",4.49,380,1,0,0,7,"Beer-battered onion rings with smoky dipping sauce",'["gluten"]','["vegetarian","side","crispy"]'),
(20,3,"Coleslaw",2.49,150,1,0,0,2,"Creamy classic coleslaw with apple cider vinegar",'["egg"]','["vegetarian","side","fresh"]'),
(21,3,"Side Salad",3.99,120,1,0,0,3,"Fresh mixed greens with cherry tomatoes and cucumber",'[]','["vegetarian","vegan","healthy","side"]'),
(22,4,"Cola Small",1.99,150,1,0,0,1,"Ice-cold refreshing cola",'[]','["drink","cold","classic"]'),
(23,4,"Cola Medium",2.49,200,1,0,0,1,"Ice-cold refreshing cola",'[]','["drink","cold","classic"]'),
(24,4,"Cola Large",2.99,250,1,0,0,1,"Ice-cold refreshing cola",'[]','["drink","cold","classic"]'),
(25,4,"Fresh Lemonade",2.99,180,1,0,1,2,"Freshly squeezed lemonade with a hint of mint",'[]','["drink","cold","fresh","bestseller"]'),
(26,4,"Orange Juice",3.49,160,1,0,0,1,"Freshly pressed orange juice",'[]','["drink","fresh","breakfast"]'),
(27,4,"Vanilla Milkshake",4.99,520,1,0,1,3,"Thick and creamy vanilla bean milkshake",'["dairy"]','["dessert","drink","milkshake","bestseller"]'),
(28,4,"Chocolate Milkshake",4.99,560,1,0,0,3,"Rich Belgian chocolate milkshake",'["dairy"]','["dessert","drink","milkshake"]'),
(29,4,"Strawberry Milkshake",4.99,490,1,0,0,3,"Fresh strawberry milkshake made with real berries",'["dairy"]','["dessert","drink","milkshake"]'),
(30,4,"Iced Coffee",3.49,120,1,0,0,2,"Cold brew over ice with oat milk",'[]','["drink","coffee","cold"]'),
(31,5,"Classic Sundae",3.99,380,1,0,1,2,"Vanilla soft serve with chocolate fudge and whipped cream",'["dairy","egg"]','["dessert","sweet","bestseller"]'),
(32,5,"Chocolate Brownie",3.49,420,1,0,0,1,"Warm fudgy chocolate brownie with vanilla ice cream",'["gluten","dairy","egg","nuts"]','["dessert","chocolate","sweet"]'),
(33,5,"Apple Pie Slice",2.99,310,1,0,0,1,"Flaky pastry with spiced apple filling",'["gluten","dairy"]','["dessert","classic","sweet"]'),
(34,5,"Churros 4pc",4.49,390,1,0,0,4,"Crispy cinnamon churros with chocolate dipping sauce",'["gluten","egg"]','["dessert","sweet","sharing"]'),
(35,5,"Mini Donuts 6pc",4.99,440,1,0,0,4,"Freshly fried mini donuts with powdered sugar",'["gluten","dairy","egg"]','["dessert","sweet","sharing"]'),
(36,6,"Breakfast Burger",7.99,580,0,0,0,8,"Beef patty, fried egg, cheese, and maple bacon on a toasted bun",'["gluten","dairy","egg","pork"]','["breakfast","beef","egg"]'),
(37,6,"Egg and Cheese Muffin",5.49,380,0,0,0,6,"Fluffy egg and melted cheese on an English muffin",'["gluten","dairy","egg"]','["breakfast","egg","classic"]'),
(38,6,"Pancake Stack 3pc",6.99,520,1,0,1,8,"Fluffy buttermilk pancakes with maple syrup and butter",'["gluten","dairy","egg"]','["breakfast","sweet","vegetarian","bestseller"]'),
(39,6,"Breakfast Burrito",7.49,620,0,0,0,8,"Scrambled eggs, cheese, salsa, and chorizo in a flour tortilla",'["gluten","dairy","egg","pork"]','["breakfast","wrap","hearty"]'),
(40,6,"Hash Browns 2pc",2.49,220,1,0,0,6,"Crispy golden hash brown patties",'["gluten"]','["breakfast","vegetarian","side"]'),
(41,7,"Classic Combo",13.99,980,0,0,1,12,"Classic Smash Burger + Medium Fries + Cola",'["gluten","dairy","egg"]','["combo","value","bestseller","classic"]'),
(42,7,"Family Feast",45.99,3200,0,0,0,20,"4 burgers + 4 medium fries + 4 drinks",'["gluten","dairy","egg"]','["combo","value","sharing","family","party"]'),
(43,7,"Chicken Box",22.99,1600,0,0,1,15,"6pc Crispy Tenders + Large Fries + 2 Colas",'["gluten","egg"]','["combo","value","chicken","sharing"]'),
(44,7,"Kids Meal",7.99,580,0,0,0,8,"Mini burger + small fries + juice box",'["gluten","dairy","egg"]','["combo","kids","family"]'),
(45,7,"Double Trouble",24.99,1700,0,0,0,15,"2 Classic Burgers + 2 Medium Fries + 2 Colas",'["gluten","dairy","egg"]','["combo","value","sharing"]'),
(46,8,"Summer BBQ Special",13.99,880,0,0,1,10,"BBQ pulled pork burger with watermelon slaw - summer only",'["gluten","dairy","pork"]','["seasonal","summer","bbq","limited"]'),
(47,8,"Holiday Turkey Burger",12.99,650,0,0,0,10,"Herb turkey patty with cranberry sauce - winter special",'["gluten","dairy"]','["seasonal","winter","holiday","limited"]'),
(48,8,"Pumpkin Spice Shake",5.49,480,1,0,1,3,"Limited fall seasonal pumpkin spice milkshake",'["dairy"]','["seasonal","fall","milkshake","limited"]'),
(49,8,"Valentine Heart Brownie",5.99,450,1,0,0,4,"Heart-shaped chocolate brownie box for two",'["gluten","dairy","egg","nuts"]','["seasonal","valentine","dessert","limited"]'),
(50,9,"Caesar Salad",8.99,320,1,0,0,5,"Crisp romaine, parmesan, croutons, and house Caesar dressing",'["gluten","dairy","egg","fish"]','["salad","healthy","classic"]'),
(51,9,"Grilled Chicken Salad",11.99,420,0,0,1,8,"Grilled chicken over mixed greens with balsamic vinaigrette",'[]','["salad","healthy","chicken","bestseller"]'),
(52,9,"Southwest Salad",10.49,480,1,0,1,5,"Black beans, corn, avocado, and tortilla strips on romaine",'["gluten"]','["salad","healthy","vegetarian","spicy"]'),
]

PM={p[0]:p for p in PRODS}
SEASONAL_P={46:{6,7,8},47:{11,12,1},48:{9,10,11},49:{2}}
REG_IDS=[p[0] for p in PRODS if p[0] not in SEASONAL_P]
PW={41:15,1:13,16:12,6:11,43:10,9:9,2:9,23:9,12:8,25:8,27:7,38:7,4:6,8:6,17:6,28:6,3:5,29:5,31:5,18:5,44:5,45:4,40:4,15:4,37:4,51:4,19:3,26:3,30:3,32:3,11:3,14:3,36:3,10:3,46:5,47:5,48:6,49:4,50:2,52:2,42:2,13:2,7:2,20:2,21:2,22:2,24:2,33:2,34:2,35:2,39:2}
for p in PRODS:
    if p[0] not in PW: PW[p[0]]=2

MM={1:.82,2:.88,3:.95,4:1.0,5:1.05,6:1.15,7:1.28,8:1.22,9:1.0,10:1.08,11:1.32,12:1.42}
HW=[0,0,0,0,0,0,1,3,5,4,2,9,13,15,11,7,5,9,13,15,11,7,4,2]

def rand_dt(base, mo_off=0):
    d=base+timedelta(days=mo_off*30)
    if d>END: d=END-timedelta(days=random.randint(1,30))
    h=random.choices(range(24),weights=HW)[0]
    return datetime(d.year,d.month,d.day,h,random.randint(0,59),random.randint(0,59))

def get_seg(idx):
    r=idx/NUM_USERS
    if r<.05: return "vip"
    if r<.35: return "regular"
    if r<.75: return "occasional"
    return "churned"

SEG_OPM={"vip":5.5,"regular":1.8,"occasional":0.4,"churned":0.12}
SEG_TIERS={"vip":["gold","gold","platinum"],"regular":["silver","silver","gold","bronze"],"occasional":["bronze","bronze","silver","none"],"churned":["none","none","bronze"]}
DIETARY=[None,None,None,None,'["vegetarian"]','["vegan"]','["gluten_free"]','["halal"]','["nut_allergy"]','["dairy_free"]','["no_spicy"]','["low_calorie"]']
SPEC=[None,None,None,None,None,"No pickles please","Extra sauce","No onions","No ketchup","Extra crispy fries","Well done please","Allergic to nuts","No mayo","Add extra cheese","No ice in drinks","Sauce on the side"]
FAIL_R=["Payment declined","Card expired","Insufficient funds","Payment gateway timeout","Bank declined transaction","3D Secure auth failed"]
CNCL_R=["Changed my mind","Ordered by mistake","Wait time too long","Address issue","Duplicate order","Found a better deal","Out of stock"]
RTL_P=["Amazing food!","Will order again!","Best burger in town","Absolutely delicious","Great value for money","Love this place!","Highly recommend","Perfect order","Always consistent","My go-to spot"]
RTL_N=["Disappointed this time","Not what I expected","Could be better","Was better before","Slow delivery","Wrong order received","Missing items","Food was cold"]
RCM_P=["The food arrived hot and fresh. Fries were perfectly crispy!","Ordered the Classic Combo and it was exactly what I needed.","Great portion sizes and the flavors are always on point.","Fast delivery and the packaging kept everything warm.","The milkshakes are incredible. Best in the city.","Consistent quality every single time. Absolutely love it.","The BBQ Bacon Burger is phenomenal. Must try!","Loaded Cheese Fries are a game changer. Seriously addictive."]
RCM_N=["Order was 20 minutes late and fries were cold.","They got my order wrong - missing the extra sauce.","Portion sizes have gotten smaller recently.","The burger was a bit dry this time.","Packaging could be improved, everything was squashed.","Waited 45 minutes for delivery."]
DEVS=["mobile","mobile","mobile","desktop","tablet"]
BROWSERS=["Chrome","Safari","Firefox","Edge","Chrome Mobile","Safari Mobile","Samsung Internet"]
PLATS=["iOS","Android","Windows","macOS","Linux"]
APPS=["1.0.0","1.1.0","1.2.0","1.3.0","2.0.0","2.1.0","2.2.0"]
CUST_OPTS=["extra_cheese","no_onions","no_pickles","extra_sauce","well_done","no_tomato","add_jalapenos","no_mayo","extra_lettuce"]

_ACACHE={}
def avail(month):
    if month not in _ACACHE:
        ids,wts=list(REG_IDS),[PW[p] for p in REG_IDS]
        for pid,months in SEASONAL_P.items():
            if month in months: ids.append(pid);wts.append(PW.get(pid,4)*1.6)
        _ACACHE[month]=(ids,wts)
    return _ACACHE[month]

def write_cats():
    with W("categories.csv") as f:
        w=csv.writer(f); w.writerow(["id","name","description","display_order","is_active","created_at"])
        t=ts(START-timedelta(days=30))
        for c in CATS: w.writerow([c[0],c[1],c[2],c[3],c[4],t])
    print(f"  categories.csv               :      {len(CATS)} rows")

def write_prods():
    with W("products.csv") as f:
        w=csv.writer(f)
        w.writerow(["id","category_id","name","price","calories","is_vegetarian","is_spicy","is_featured","is_available","preparation_time_minutes","description","allergens","tags","image_url","created_at","updated_at"])
        t=ts(START-timedelta(days=30)); tu=ts(START-timedelta(days=15))
        for p in PRODS:
            slug=p[2].lower().replace(" ","_").replace(".","").replace("&","and").replace("'","").replace("/","")
            w.writerow([p[0],p[1],p[2],p[3],p[4],bool(p[5]),bool(p[6]),bool(p[7]),True,p[8],p[9],p[10],p[11],f"/images/products/{slug}.jpg",t,tu])
    print(f"  products.csv                 :     {len(PRODS)} rows")

def write_promos():
    rows=[]
    def add(code,name,dtype,dv,mo,md,ulimit,ucount,active,sdt,edt):
        pid=nxt("promo"); rows.append((pid,code,name,f"{name} promotion",dtype,dv,mo,md,ulimit,ucount,active,ts(sdt),ts(edt),ts(sdt-timedelta(days=3))))
    add("WELCOME20","New User 20% Off","percentage",20,0,10,None,0,True,START,END+timedelta(days=730))
    add("WEEKEND10","Weekend 10% Off","percentage",10,15,8,None,0,True,START,END+timedelta(days=730))
    add("LUNCH15","Lunch Rush 15% Off","percentage",15,12,6,None,0,True,START,END+timedelta(days=730))
    add("FREEDELIVERY","Free Delivery","fixed",3.99,20,3.99,None,0,True,START,END+timedelta(days=730))
    add("COMBO5OFF","Combo 5 Off","fixed",5,25,5,None,0,True,START,END+timedelta(days=730))
    add("LOYALTY10","Loyalty Member 10% Off","percentage",10,20,12,None,0,True,START,END+timedelta(days=730))
    add("REFER15","Referral 15% Off","percentage",15,0,12,None,0,True,START,END+timedelta(days=730))
    add("APP20","App-Exclusive 20% Off","percentage",20,10,15,None,0,True,START,END+timedelta(days=730))
    for yr in [2023,2024,2025]:
        for tag,nm,ms,me in [("SUMMER","Summer",6,8),("HOLIDAY","Holiday",11,12),("SPRING","Spring",3,5)]:
            st=datetime(yr,ms,1); et=datetime(yr,me,28 if me==2 else 30)
            add(f"{tag}{yr}",f"{nm} Special {yr}","percentage",random.choice([10,15,20]),10,15,1000,random.randint(150,900),et<END,st,et)
    d=START+timedelta(days=7)
    while d<END:
        et=d+timedelta(days=2); add(f"FLASH{d.strftime('%Y%m')}",f"Flash Sale {d.strftime('%b %Y')}","percentage",random.choice([20,25,30]),15,15,500,random.randint(50,480),False,d,et); d+=timedelta(days=random.randint(25,38))
    for i in range(1,13):
        add(f"BDAY{i:02d}","Birthday Special","fixed",4.99,10,4.99,None,random.randint(5,200),True,START,END+timedelta(days=730))
    with W("promotions.csv") as f:
        w=csv.writer(f); w.writerow(["id","code","name","description","discount_type","discount_value","min_order_amount","max_discount_amount","usage_limit","usage_count","is_active","starts_at","expires_at","created_at"])
        for r in rows: w.writerow(r)
    print(f"  promotions.csv               :    {len(rows)} rows")
    return [(r[0],r[4],r[5],r[6],r[7]) for r in rows if r[10]]

def generate(active_promos):
    hot=active_promos[:15]
    def_hash=hashlib.sha256(b"password123").hexdigest()
    adm_hash=hashlib.sha256(b"admin123").hexdigest()
    CHAINS={"delivered":["pending","confirmed","preparing","ready","delivered"],"cancel_early":["pending","cancelled"],"cancel_mid":["pending","confirmed","preparing","cancelled"],"failed":["pending","failed"]}
    STATUS_NOTES={"pending":"Order received","confirmed":"Confirmed by restaurant","preparing":"Chef started preparing","ready":"Ready for pickup or delivery","delivered":"Order delivered successfully","cancelled":"Order cancelled","failed":"Payment failed"}
    used_emails={"admin@quickbite.com"}
    loyalty_bal={}

    with W("users.csv") as uf, W("user_addresses.csv") as af, W("orders.csv") as of_, W("order_items.csv") as itemf, W("order_status_history.csv") as statf, W("reviews.csv") as revf, W("loyalty_points.csv") as loyf, W("user_sessions.csv") as sessf:
        uw=csv.writer(uf); aw=csv.writer(af); ow=csv.writer(of_); iw=csv.writer(itemf); sw=csv.writer(statf); rw=csv.writer(revf); lw=csv.writer(loyf); sesw=csv.writer(sessf)
        uw.writerow(["id","email","password_hash","first_name","last_name","phone","date_of_birth","gender","role","segment","is_active","is_email_verified","loyalty_tier","dietary_preferences","notification_preferences","referral_code","referred_by_user_id","last_login_at","created_at","updated_at"])
        aw.writerow(["id","user_id","label","address_line1","city","state","postal_code","is_default","created_at"])
        ow.writerow(["id","order_number","user_id","status","order_type","subtotal","tax_amount","delivery_fee","discount_amount","total_amount","payment_method","payment_status","promotion_id","delivery_address_id","special_instructions","estimated_delivery_minutes","actual_delivery_at","cancelled_reason","failure_reason","device_type","app_version","session_id","created_at","updated_at"])
        iw.writerow(["id","order_id","product_id","quantity","unit_price","total_price","customizations","created_at"])
        sw.writerow(["id","order_id","status","notes","created_at"])
        rw.writerow(["id","user_id","order_id","product_id","rating","title","comment","is_verified","sentiment","helpful_count","created_at"])
        lw.writerow(["id","user_id","order_id","points","transaction_type","balance_after","description","created_at"])
        sesw.writerow(["id","user_id","device_type","browser","platform","pages_visited","session_duration_seconds","bounce","created_at"])

        uw.writerow([1,"admin@quickbite.com",adm_hash,"Admin","QuickBite","+15551234567","1985-01-01","M","admin","staff",True,True,"platinum",None,'{"email":true,"push":true,"sms":false}',"QB000001",None,ts(END),ts(START-timedelta(days=60)),ts(START-timedelta(days=30))])

        for idx in range(NUM_USERS):
            uid=idx+2
            gender="M" if random.random()<.52 else "F"
            first=random.choice(MF if gender=="M" else FF); last=random.choice(LS)
            segment=get_seg(idx); tier=random.choice(SEG_TIERS[segment])
            active=segment!="churned" or random.random()<.3; verified=random.random()<.75
            days_in=int(random.triangular(0,DAYS,DAYS*.35))
            created=START+timedelta(days=min(days_in,DAYS-30))
            updated=created+timedelta(days=random.randint(1,max(1,(END-created).days//2)))
            last_login=(END-timedelta(days=random.randint(0,30 if segment=="vip" else 90))) if active else (created+timedelta(days=random.randint(5,120)))
            domain=random.choice(DOMAINS); fn,ln=first.lower(),last.lower()
            v=random.random()
            if v<.30: email=f"{fn}.{ln}@{domain}"
            elif v<.50: email=f"{fn}{ln}{random.randint(10,99)}@{domain}"
            elif v<.70: email=f"{fn[0]}{ln}@{domain}"
            elif v<.85: email=f"{fn}{ln[0]}@{domain}"
            else: email=f"user{uid}@{domain}"
            if email in used_emails: email=f"{fn}{uid}@{domain}"
            used_emails.add(email)
            phone=f"+1{random.randint(200,999)}{random.randint(100,999)}{random.randint(1000,9999)}"
            dob=(START.date()-timedelta(days=random.randint(18*365,65*365))).strftime("%Y-%m-%d")
            diet=random.choice(DIETARY); notif=json.dumps({"email":random.random()<.7,"push":random.random()<.6,"sms":random.random()<.3})
            ref_by=None if uid<100 or random.random()<.7 else random.randint(1,uid-1)
            uw.writerow([uid,email,def_hash,first,last,phone,dob,gender,"customer",segment,active,verified,tier,diet,notif,f"QB{uid:06d}",ref_by,ts(last_login),ts(created),ts(updated)])

            n_addr=1 if segment in("churned","occasional") else random.randint(1,3)
            addr_ids=[]
            for i in range(n_addr):
                aid=nxt("addr"); city,st_,zpx=random.choice(CITIES)
                aw.writerow([aid,uid,["home","work","other"][min(i,2)],f"{random.randint(100,9999)} {random.choice(STREETS)}",city,st_,f"{zpx}{random.randint(10,99)}",i==0,ts(created)])
                addr_ids.append(aid)

            active_months=max(1,int((END-created).days/30))
            if segment=="churned": active_months=min(active_months,random.randint(1,8))
            opm=SEG_OPM[segment]*random.uniform(.6,1.4)
            n_ord=max(1,int(opm*active_months*random.uniform(.6,1.4)))
            loyalty_bal[uid]=0

            for _ in range(n_ord):
                mo_off=random.randint(0,max(0,active_months-1))
                odt=rand_dt(created,mo_off); oid=nxt("order")
                onum=f"QB{odt.strftime('%Y%m')}{oid:07d}"
                otyp=random.choices(["delivery","takeaway","dine_in"],weights=[60,25,15])[0]
                pmeth=random.choices(["card","cash","online","wallet"],weights=[45,25,20,10])[0]
                dev=random.choice(DEVS); appv=random.choice(APPS); sess_id=f"s{uid}x{oid}"
                r_out=random.random()
                if r_out<.800: ckey="delivered"
                elif r_out<.890: ckey="cancel_early"
                elif r_out<.935: ckey="failed"
                else: ckey="cancel_mid"
                chain=CHAINS[ckey]; final=chain[-1]
                pstat="paid" if final=="delivered" else "failed" if final=="failed" else "refunded" if r_out<.89 else "pending"

                a_ids,a_wts=avail(odt.month)
                n_items=random.choices([1,2,3,4,5],weights=[20,35,25,15,5])[0]
                chosen={}
                for _ in range(n_items):
                    pid=random.choices(a_ids,weights=a_wts)[0]
                    if pid not in chosen: chosen[pid]=1
                    elif random.random()<.25: chosen[pid]+=1
                if not chosen: chosen[random.choices(a_ids,weights=a_wts)[0]]=1
                subtotal=0.0; item_pids=[]
                for pid,qty in chosen.items():
                    prod=PM[pid]; up=prod[3]; tp=round(up*qty,2); subtotal+=tp; item_pids.append(pid)
                    cust=json.dumps({"mods":random.sample(CUST_OPTS,random.randint(1,2))}) if random.random()<.25 else None
                    iw.writerow([nxt("item"),oid,pid,qty,up,tp,cust,ts(odt)])
                subtotal=round(subtotal,2)

                promo_id=None; disc=0.0
                if final=="delivered" and hot and random.random()<.18:
                    pr=random.choice(hot); pid_p,dtype,dval,min_amt,max_disc=pr
                    if subtotal>=min_amt:
                        promo_id=pid_p; disc=round(min(subtotal*dval/100 if dtype=="percentage" else dval,max_disc),2)

                tax=round(subtotal*.085,2); del_fee=round(random.choice([0,0,0,1.99,2.99,3.99]),2) if otyp=="delivery" else 0.0
                total=round(subtotal+tax+del_fee-disc,2); total=max(total,0.01)
                addr_id=addr_ids[0] if otyp=="delivery" and addr_ids else None
                est_min=random.choice([20,25,30,35,40,45]) if otyp=="delivery" else random.choice([10,12,15,18,20]) if otyp=="takeaway" else None
                act_del=ts(odt+timedelta(minutes=(est_min or 20)+random.choices([0,5,10,20],weights=[60,20,15,5])[0])) if final=="delivered" else None
                cncl=random.choice(CNCL_R) if final=="cancelled" else None
                fail=random.choice(FAIL_R) if final=="failed" else None
                ow.writerow([oid,onum,uid,final,otyp,subtotal,tax,del_fee,disc,total,pmeth,pstat,promo_id,addr_id,random.choice(SPEC),est_min,act_del,cncl,fail,dev,appv,sess_id,ts(odt),ts(odt+timedelta(minutes=5))])

                t_cur=odt
                for s in chain:
                    note=STATUS_NOTES.get(s,s)
                    if s=="cancelled" and cncl: note=f"Cancelled: {cncl}"
                    if s=="failed" and fail: note=f"Failed: {fail}"
                    sw.writerow([nxt("stat"),oid,s,note,ts(t_cur)]); t_cur+=timedelta(minutes=random.randint(3,15))

                if final=="delivered":
                    pts=max(1,int(total*10)); loyalty_bal[uid]+=pts
                    lw.writerow([nxt("loy"),uid,oid,pts,"earned",loyalty_bal[uid],f"Points earned for order QB{oid}",ts(odt+timedelta(minutes=35))])
                    if random.random()<.08 and loyalty_bal[uid]>100:
                        rpts=min(random.choice([50,100,200]),loyalty_bal[uid]); loyalty_bal[uid]-=rpts
                        lw.writerow([nxt("loy"),uid,None,-rpts,"redeemed",loyalty_bal[uid],"Points redeemed for discount",ts(odt+timedelta(days=random.randint(3,30)))])
                    if random.random()<.40:
                        rat=random.choices([1,2,3,4,5],weights=[3,5,12,35,45])[0]; pos=rat>=4
                        sent="positive" if rat>=4 else "negative" if rat<=2 else "neutral"
                        rw.writerow([nxt("rev"),uid,oid,random.choice(item_pids),rat,random.choice(RTL_P if pos else RTL_N),random.choice(RCM_P if pos else RCM_N),True,sent,random.randint(0,12),ts(odt+timedelta(hours=random.randint(1,72)))])

            for _ in range(random.randint(2,6)):
                sdt=START+timedelta(days=random.randint(0,DAYS)); pages=random.randint(1,20); dur=random.randint(30,1800)
                sdt2=datetime(sdt.year,sdt.month,sdt.day,random.choices(range(24),weights=HW)[0],random.randint(0,59),0)
                sesw.writerow([nxt("sess"),uid,random.choice(DEVS),random.choice(BROWSERS),random.choice(PLATS),pages,dur,pages==1,ts(sdt2)])

    print(f"  users.csv                    : {NUM_USERS+1:>6} rows  (incl. admin)")
    print(f"  user_addresses.csv           : {C['addr']:>6} rows")
    print(f"  orders.csv                   : {C['order']:>6} rows")
    print(f"  order_items.csv              : {C['item']:>6} rows")
    print(f"  order_status_history.csv     : {C['stat']:>6} rows")
    print(f"  reviews.csv                  : {C['rev']:>6} rows")
    print(f"  loyalty_points.csv           : {C['loy']:>6} rows")
    print(f"  user_sessions.csv            : {C['sess']:>6} rows")

if __name__=="__main__":
    print("QuickBite — Synthetic Data Generator")
    print("="*42)
    write_cats()
    write_prods()
    active_promos=write_promos()
    generate(active_promos)
    elapsed=time.time()-t0
    total_rows=sum(C.values())+len(CATS)+len(PRODS)+NUM_USERS+1
    print(f"\n  Total rows generated : ~{total_rows:,}")
    print(f"  Time taken           : {elapsed:.1f}s")
    print(f"\n  Output directory     : {os.path.abspath(OUT)}/")
    print("="*42)
