# 🚀 BrandHive Advanced Database Seeding System

This document explains the automated database seeding system for BrandHive. It enables developers to generate a connected, realistic development database with existing real users preserved, 19 development users (including multi-role accounts), 75 advertisement spaces distributed across all sellers, and 25 active/pending bookings.

---

## ⚙️ Seeding Configuration (`SEED_CONFIG`)

At the top of [Backend/scripts/seed.js](file:///C:/All%20Projects/APP/BrandHive%20Add%20App/Backend/scripts/seed.js), you can configure amounts without modifying the underlying seeding engine:

```javascript
const SEED_CONFIG = {
  additionalUsers: 10,       // Generates user01@brandhive.test ... user10@brandhive.test
  multiRoleUsers: 3,         // Generates multi01@brandhive.test ... multi03@brandhive.test
  advertisementSpaces: 75,  // Configurable: 50 - 100 ad spaces (default 75)
  bookings: 25,              // Configurable: 20 - 30 bookings (default 25)
};
```

To change the number of generated advertisement spaces from `75` to `100` or `50`, simply update `advertisementSpaces: 100` in `SEED_CONFIG` and re-run `npm run seed`.

---

## 🛠️ How to Run Seeding

Execute the following command in the `Backend` directory:

```bash
npm run seed
```

### What Happens Automatically:
1. **Preserves Existing Real Users**: Scans MongoDB for real non-seed accounts (e.g. `prashantyadav77842@gmail.com`, `Harshal Sharma`, `Henry Clen`) and preserves their accounts and bcrypt passwords 100% untouched.
2. **Idempotent Safe Reset**: Identifies previous seed accounts (`@brandhive.test`) and safely cleans up old seed documents without duplicating data or touching real users.
3. **Creates 19 Development Accounts**:
   - 3 Base Sellers (`seller1@brandhive.test`, `seller2@brandhive.test`, `seller3@brandhive.test`)
   - 2 Base Buyers (`buyer1@brandhive.test`, `buyer2@brandhive.test`)
   - 1 Base Dual User (`dualuser@brandhive.test`)
   - 10 Extra Seed Users (`user01@brandhive.test` ... `user10@brandhive.test`)
   - 3 Dual Multi-Role Accounts (`multi01@brandhive.test` ... `multi03@brandhive.test`)
4. **Bcrypt Password Hashing**: Hashing performed using `bcrypt.hash(password, 10)` for all new seed accounts.
5. **Generates 75 Advertisement Spaces**: Distributed across all 18 available sellers using real MongoDB `sellerID` ObjectIds.
6. **Generates 25 Bookings**: Distributed across buyers and linked via real `buyerID`, `sellerID`, and `adspaceID` ObjectIds.
7. **Runs Relationship & Bcrypt Verifications**: Confirms ownership, password hashes, and dual-role credentials before completing.

---

## 🔑 Test Accounts for Login & Role Switching

All test users can log in via standard `/auth/login` on Mobile and Web.

### 1. Dual Multi-Role Accounts (Test Role-Switching)
Use these accounts to test switching between **Buyer Mode** and **Seller Mode** without creating a new account:

| Name | Email | Password | Active Role | Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Vikram Malhotra** | `dualuser@brandhive.test` | `DualUser@123` | `seller` | `roles: ["buyer", "seller"]` |
| **Sameer Verma** | `multi01@brandhive.test` | `Multi@123` | `seller` | `roles: ["buyer", "seller"]` |
| **Riya Sen** | `multi02@brandhive.test` | `Multi@123` | `buyer` | `roles: ["buyer", "seller"]` |
| **Tushar Kadam** | `multi03@brandhive.test` | `Multi@123` | `seller` | `roles: ["buyer", "seller"]` |

### 2. Base Seller Accounts
| Name | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `seller1@brandhive.test` | `Seller@123` | Mumbai Unipole & LED Screen Media Owner |
| **Amit Patil** | `seller2@brandhive.test` | `Seller@123` | Pune Transit & Mobility Media Owner |
| **Neha Kulkarni** | `seller3@brandhive.test` | `Seller@123` | Navi Mumbai Airport & Retail Screen Owner |

### 3. Base Buyer Accounts
| Name | Email | Password | Details |
| :--- | :--- | :--- | :--- |
| **Aditya Mehta** | `buyer1@brandhive.test` | `Buyer@123` | E-Commerce Advertiser |
| **Sneha Shah** | `buyer2@brandhive.test` | `Buyer@123` | Retail Growth Brand Manager |

### 4. Additional Seed Accounts (`user01` to `user10`)
| Name Pattern | Email Pattern | Password | Roles |
| :--- | :--- | :--- | :--- |
| **User 01 - User 10** | `user01@brandhive.test` ... `user10@brandhive.test` | `User@123` | Alternating `seller` / `buyer` |

---

## 🏗️ Relationship Architecture

```
[ User (Seller: Rahul) ] <=== sellerID === [ AdSpace (Western Express Billboard) ]
                                                        ||
                                                     adspaceID
                                                        ||
[ User (Buyer: Aditya) ] <=== buyerID ===== [ Booking (Active Festive Campaign) ]
```

- **Seller Dashboard Filtering**: When logged in as `seller1@brandhive.test`, the backend queries `AdSpace.find({ sellerID: req.user._id })`, returning only Rahul's ad spaces.
- **Buyer Bookings Filtering**: When logged in as `buyer1@brandhive.test`, the backend queries `Booking.find({ buyerID: req.user._id })`, returning only Aditya's bookings.
- **Seller Bookings Filtering**: When logged in as `seller1@brandhive.test`, the backend queries `Booking.find({ sellerID: req.user._id })`, returning bookings for Rahul's ad spaces.
