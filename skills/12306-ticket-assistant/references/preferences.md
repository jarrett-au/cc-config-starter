# User Travel Preferences

Customize these settings to match your travel profile.

## Personal Information

```yaml
user_profile:
  name: "Weekend Traveler"
  home_station: "深圳北"
  home_station_encoded: "%E6%B7%B1%E5%9C%B3%E5%8C%97"
  home_code: "IOQ"
```

## Travel Preferences

```yaml
travel_preferences:
  # Train types to prioritize
  train_types:
    - GC  # 高铁/城际
    - D   # 动车

  # Seat preference
  seat_class: "二等座"

  # Budget constraints
  max_budget_one_way: 500
  max_budget_round_trip: 1000

  # Travel time preferences
  max_travel_time: "3:30"  # Maximum 3.5 hours for weekend trip
  min_travel_time: "1:00"  # Minimum 1 hour
  ideal_travel_time: "1:30-2:30"  # Sweet spot
```

## Weekend Trip Pattern

```yaml
weekend_pattern:
  # Departure preferences
  departure:
    friday_evening: true
    friday_time_range: "18:00-24:00"
    saturday_morning: true
    saturday_time_range: "06:00-12:00"

  # Return preferences
  return:
    sunday_evening: true
    sunday_time_range: "18:00-24:00"
    monday_morning: false  # Set to true if taking Monday off
    monday_time_range: "06:00-12:00"
```

## Preferred Destinations

Categorized by travel time and suitability for weekend trips.

### Short Trips (1-2 hours) - Perfect for 2-day weekend

```yaml
tier_1_short_getaways:
  - destination: "赣州西"
    code: "GZQ"
    encoded: "%E8%B5%A3%E5%B7%9E%E8%A5%BF"
    travel_time: "1:23"
    price_range: "¥180-250"
    rating: 5
    highlights:
      - "江宋古城"
      - "客家文化"
      - "美食丰富"
      - "离深圳近"

  - destination: "郴州西"
    code: "ICQ"
    encoded: "%E9%83%B4%E5%B7%9E%E8%A5%BF"
    travel_time: "1:30"
    price_range: "¥170-230"
    rating: 4
    highlights:
      - "雾漫小东江"
      - "莽山国家森林公园"
      - "东江湖"

  - destination: "广州南"
    code: "IOQ"
    encoded: "%E5%B9%BF%E5%B7%9E%E5%8D%97"
    travel_time: "0:30"
    price_range: "¥70-120"
    rating: 4
    highlights:
      - "美食天堂"
      - "早茶文化"
      - "购物"
      - "珠江夜游"

  - destination: "潮汕"
    code: "EAQ"
    encoded: "%E6%BD%AE%E6%B1%95"
    travel_time: "2:00-2:30"
    price_range: "¥150-200"
    rating: 5
    highlights:
      - "潮汕美食"
      - "牛肉火锅"
      - "古城游览"
      - "功夫茶文化"
```

### Medium Trips (2-3.5 hours) - Extended weekend

```yaml
tier_2_extended_weekend:
  - destination: "厦门北"
    code: "IOS"
    encoded: "%E5%8E%A6%E9%97%A8%E5%8C%97"
    travel_time: "3:00-3:30"
    price_range: "¥250-350"
    rating: 5
    highlights:
      - "鼓浪屿"
      - "曾厝垵"
      - "海滨风光"
      - "闽南美食"

  - destination: "长沙南"
    code: "IYQ"
    encoded: "%E9%95%BF%E6%B2%99%E5%8D%97"
    travel_time: "3:20-3:40"
    price_range: "¥300-400"
    rating: 5
    highlights:
      - "橘子洲"
      - "岳麓山"
      - "湘菜"
      - "夜生活丰富"
      - "橘子洲烟花"

  - destination: "衡阳东"
    code: "HYQ"
    encoded: "%E8%A1%A1%E9%98%B3%E4%B8%9C"
    travel_time: "2:40-3:00"
    price_range: "¥240-320"
    rating: 4
    highlights:
      - "南岳衡山"
      - "石鼓书院"
      - "湘南风情"
```

### Long Trips (3.5-5 hours) - Long weekend or holiday

```yaml
tier_3_long_weekend:
  - destination: "武汉"
    code: "HKN"
    encoded: "%E6%AD%A6%E6%B1%89"
    travel_time: "4:30-5:00"
    price_range: "¥400-550"
    rating: 4
    highlights:
      - "黄鹤楼"
      - "武汉大学"
      - "热干面"
      - "长江大桥"

  - destination: "桂林北"
    code: "KWK"
    encoded: "%E6%A1%82%E6%9E%97%E5%8C%97"
    travel_time: "3:30-4:00"
    price_range: "¥200-300"
    rating: 5
    highlights:
      - "漓江风光"
      - "阳朔西街"
      - "象鼻山"
      - "桂林米粉"

  - destination: "南昌西"
    code: "NXG"
    encoded: "%E5%8D%97%E6%98%8C%E8%A5%BF"
    travel_time: "4:00-4:30"
    price_range: "¥350-450"
    rating: 4
    highlights:
      - "滕王阁"
      - "鄱阳湖"
      - "南昌起义纪念馆"
```

## Transfer Routes (Destinations requiring transfer)

```yaml
transfer_routes:
  - destination: "漳州"
    via: "厦门北"
    transfer_time: "0:30"
    total_time: "3:30-4:00"
    highlights:
      - "漳州古城"
      - "火山岛"
      - "福建土楼"
      - "海滨风光"

  - destination: "泉州"
    via: "厦门北"
    transfer_time: "0:40"
    total_time: "4:00-4:30"
    highlights:
      - "开元寺"
      - "西街"
      - "闽南文化"
```

## Query Priority Order

When making recommendations, prioritize destinations in this order:

1. **Travel time** (40% weight) - Shorter is better
2. **Ticket availability** (30% weight) - More options = higher score
3. **Price** (20% weight) - Within budget preferred
4. **User rating** (10% weight) - Previously visited well-rated destinations

## Excluded Destinations

```yaml
exclude:
  destinations: []
  # Example:
  # - "广州南"  # Too frequent, maybe exclude sometimes
  # - "桂林北"  # Visited recently

  dates: []
  # Example:
  # - "2026-02-27"  # Chinese New Year, too crowded
```

## Custom Notes

```yaml
notes:
  # Special considerations
  - "Prefer destinations with good food options"
  - "Avoid destinations with extreme weather conditions"
  - "Check if any festivals or events at destination"

  # Companions
  default_group_size: 2  # Solo, couple, family, friends

  # Activity preferences
  activities:
    - "food"
    - "culture"
    - "nature"
    - "history"
```

## How to Customize

1. **Change home station**: Update `home_station` and `home_code`
2. **Adjust budget**: Modify `max_budget_one_way` and `max_budget_round_trip`
3. **Set travel time limits**: Update `max_travel_time` and `min_travel_time`
4. **Add preferred destinations**: Add entries to `tier_1_short_getaways`, etc.
5. **Exclude destinations**: Add to `exclude.destinations` list
6. **Set weekend pattern**: Toggle `friday_evening`, `saturday_morning`, etc.

## Saving Your Preferences

After customizing, these preferences will be automatically applied when:
- Asking "这周末推荐去哪玩"
- Querying specific destinations without specifying details
- Comparing multiple destinations

The skill will use these defaults for:
- Seat class (二等座)
- Train types (高铁/动车)
- Departure time preferences (周五晚/周六早)
- Budget filtering
- Travel time filtering
