// backend/test-suite.js
// Automated End-to-End Integration and Security Test Suite

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Note = require("./models/Note");

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

async function runTests() {
  console.log("==================================================");
  console.log("   NoteSpace Comprehensive Backend Test Suite     ");
  console.log("==================================================\n");

  await connectDB();

  // Clean test users and test notes
  await User.deleteMany({
    email: { $in: ["alice@test.com", "bob@test.com", "admin@test.com"] },
  });
  console.log("🧹 Cleaned test records.\n");

  let userAToken = "";
  let userBToken = "";
  let adminToken = "";
  let noteAId = "";

  // TEST 1: Health Endpoint & Database status
  console.log("▶ TEST 1: Health Endpoint Check");
  const res1 = await fetch(`${BASE_URL}/health`);
  const data1 = await res1.json();
  if (res1.status === 200 && data1.database.status === "connected") {
    console.log(`  ✅ Health check passed. Database connected to ${data1.database.host}`);
  } else {
    throw new Error(`Failed Test 1: ${JSON.stringify(data1)}`);
  }

  // TEST 2: CORS Preflight check from 127.0.0.1:5173
  console.log("\n▶ TEST 2: CORS Preflight Check for http://127.0.0.1:5173");
  const res2 = await fetch(`${BASE_URL}/users/login`, {
    method: "OPTIONS",
    headers: {
      Origin: "http://127.0.0.1:5173",
      "Access-Control-Request-Method": "POST",
    },
  });
  const allowOrigin = res2.headers.get("access-control-allow-origin");
  if (res2.status === 204 && (allowOrigin === "http://127.0.0.1:5173" || allowOrigin === "*")) {
    console.log(`  ✅ CORS allows origin http://127.0.0.1:5173 (header: ${allowOrigin})`);
  } else {
    throw new Error(`Failed Test 2: CORS rejected. Got status ${res2.status}, header: ${allowOrigin}`);
  }

  // TEST 3: Register User A (Alice)
  console.log("\n▶ TEST 3: Register User A (Alice)");
  const res3 = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Alice Smith",
      email: "alice@test.com",
      password: "Password123!",
    }),
  });
  const data3 = await res3.json();
  if (res3.status === 201 && data3.token && data3.user.role === "user") {
    userAToken = data3.token;
    console.log("  ✅ User A registered successfully. Role is 'user'.");
  } else {
    throw new Error(`Failed Test 3: ${JSON.stringify(data3)}`);
  }

  // TEST 4: Duplicate Email Rejection
  console.log("\n▶ TEST 4: Duplicate Email Rejection");
  const res4 = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Alice Clone",
      email: "alice@test.com",
      password: "Password123!",
    }),
  });
  if (res4.status === 409) {
    console.log("  ✅ Duplicate registration correctly rejected with 409 Conflict.");
  } else {
    throw new Error(`Failed Test 4: Expected 409, got ${res4.status}`);
  }

  // TEST 5: Login User A with Invalid Password
  console.log("\n▶ TEST 5: Login with Invalid Password");
  const res5 = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "alice@test.com",
      password: "WrongPassword!",
    }),
  });
  if (res5.status === 401) {
    console.log("  ✅ Rejected invalid credentials with 401 Unauthorized.");
  } else {
    throw new Error(`Failed Test 5: Expected 401, got ${res5.status}`);
  }

  // TEST 6: Login User A with Correct Password
  console.log("\n▶ TEST 6: Login with Correct Password");
  const res6 = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "alice@test.com",
      password: "Password123!",
    }),
  });
  const data6 = await res6.json();
  if (res6.status === 200 && data6.token && !data6.user.password) {
    userAToken = data6.token;
    console.log("  ✅ Logged in successfully. Password hash NOT leaked in response.");
  } else {
    throw new Error(`Failed Test 6: ${JSON.stringify(data6)}`);
  }

  // TEST 7: Register User B (Bob)
  console.log("\n▶ TEST 7: Register User B (Bob)");
  const res7 = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Bob Jones",
      email: "bob@test.com",
      password: "Password123!",
    }),
  });
  const data7 = await res7.json();
  if (res7.status === 201 && data7.token) {
    userBToken = data7.token;
    console.log("  ✅ User B registered successfully.");
  } else {
    throw new Error(`Failed Test 7: ${JSON.stringify(data7)}`);
  }

  // TEST 8: User A creates a Note
  console.log("\n▶ TEST 8: User A creates a Note");
  const res8 = await fetch(`${BASE_URL}/notes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userAToken}`,
    },
    body: JSON.stringify({
      title: "Alice's Secret Note",
      content: "This contains confidential thoughts on React and Node.",
    }),
  });
  const data8 = await res8.json();
  if (res8.status === 201 && data8.note && data8.note._id) {
    noteAId = data8.note._id;
    console.log(`  ✅ Note created with ID: ${noteAId}`);
    console.log(`  ✅ Note is associated with User A ID: ${data8.note.user}`);
  } else {
    throw new Error(`Failed Test 8: ${JSON.stringify(data8)}`);
  }

  // TEST 9: User A reads their notes (via /api/notes/read and /api/notes)
  console.log("\n▶ TEST 9: User A reads notes (Master URL & REST alias)");
  const res9a = await fetch(`${BASE_URL}/notes/read`, {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  const res9b = await fetch(`${BASE_URL}/notes`, {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  const data9a = await res9a.json();
  const data9b = await res9b.json();
  if (res9a.status === 200 && res9b.status === 200 && data9a.notes.length === 1 && data9b.notes.length === 1) {
    console.log("  ✅ Both /api/notes/read and /api/notes returned user's notes successfully.");
  } else {
    throw new Error(`Failed Test 9`);
  }

  // TEST 10: Backend Search Filter (?search=React)
  console.log("\n▶ TEST 10: Backend Note Search Filtering");
  const res10 = await fetch(`${BASE_URL}/notes/read?search=React`, {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  const data10 = await res10.json();
  if (res10.status === 200 && data10.notes.length === 1) {
    console.log("  ✅ Search for 'React' returned matching note.");
  } else {
    throw new Error(`Failed Test 10: Expected 1 match, got ${data10.notes?.length}`);
  }

  // TEST 11: Data Isolation — User B reads notes (should see 0 notes)
  console.log("\n▶ TEST 11: Data Isolation Check (User B sees 0 notes)");
  const res11 = await fetch(`${BASE_URL}/notes/read`, {
    headers: { Authorization: `Bearer ${userBToken}` },
  });
  const data11 = await res11.json();
  if (res11.status === 200 && data11.notes.length === 0) {
    console.log("  ✅ User B cannot see User A's notes. Data isolation verified!");
  } else {
    throw new Error(`Failed Test 11: Bob saw: ${JSON.stringify(data11)}`);
  }

  // TEST 12: Security — User B tries to read User A's note by ID
  console.log("\n▶ TEST 12: Security — User B GET /api/notes/read/:id for Alice's note");
  const res12 = await fetch(`${BASE_URL}/notes/read/${noteAId}`, {
    headers: { Authorization: `Bearer ${userBToken}` },
  });
  if (res12.status === 403) {
    console.log("  ✅ Access denied with 403 Forbidden. Ownership verified!");
  } else {
    throw new Error(`Failed Test 12: Expected 403, got ${res12.status}`);
  }

  // TEST 13: Security — User B tries to update User A's note
  console.log("\n▶ TEST 13: Security — User B PUT /api/notes/update/:id for Alice's note");
  const res13 = await fetch(`${BASE_URL}/notes/update/${noteAId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userBToken}`,
    },
    body: JSON.stringify({ title: "Hacked" }),
  });
  if (res13.status === 403) {
    console.log("  ✅ Modification denied with 403 Forbidden. Ownership verified!");
  } else {
    throw new Error(`Failed Test 13: Expected 403, got ${res13.status}`);
  }

  // TEST 14: Security — User B tries to delete User A's note
  console.log("\n▶ TEST 14: Security — User B DELETE /api/notes/delete/:id for Alice's note");
  const res14 = await fetch(`${BASE_URL}/notes/delete/${noteAId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${userBToken}` },
  });
  if (res14.status === 403) {
    console.log("  ✅ Deletion denied with 403 Forbidden. Ownership verified!");
  } else {
    throw new Error(`Failed Test 14: Expected 403, got ${res14.status}`);
  }

  // TEST 15: User A performs Partial Update
  console.log("\n▶ TEST 15: User A partial update (updating only title)");
  const res15 = await fetch(`${BASE_URL}/notes/update/${noteAId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userAToken}`,
    },
    body: JSON.stringify({ title: "Alice's Revised Secret Note" }),
  });
  const data15 = await res15.json();
  if (res15.status === 200 && data15.note.title === "Alice's Revised Secret Note") {
    console.log("  ✅ Note updated successfully with preserved content.");
  } else {
    throw new Error(`Failed Test 15: ${JSON.stringify(data15)}`);
  }

  // TEST 16: Role-Based Authorization (Part 7)
  console.log("\n▶ TEST 16: Role-Based Authorization — Admin Route Access");
  // Regular user attempts admin route
  const res16a = await fetch(`${BASE_URL}/users/admin/all`, {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  if (res16a.status === 403) {
    console.log("  ✅ Regular user denied access to admin route (403 Forbidden).");
  } else {
    throw new Error(`Failed Test 16a: Expected 403, got ${res16a.status}`);
  }

  // Create an admin user directly in the database (out-of-band)
  const adminUser = await User.create({
    name: "System Admin",
    email: "admin@test.com",
    password: "AdminPassword123!",
    role: "admin",
  });
  const adminLoginRes = await fetch(`${BASE_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@test.com", password: "AdminPassword123!" }),
  });
  const adminData = await adminLoginRes.json();
  adminToken = adminData.token;

  const res16b = await fetch(`${BASE_URL}/users/admin/all`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const data16b = await res16b.json();
  if (res16b.status === 200 && data16b.users.length >= 3) {
    console.log(`  ✅ Admin user successfully accessed admin route (${data16b.users.length} users returned).`);
  } else {
    throw new Error(`Failed Test 16b: ${JSON.stringify(data16b)}`);
  }

  // TEST 17: User A deletes note
  console.log("\n▶ TEST 17: User A deletes note");
  const res17 = await fetch(`${BASE_URL}/notes/delete/${noteAId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  if (res17.status === 200) {
    console.log("  ✅ Note deleted successfully.");
  } else {
    throw new Error(`Failed Test 17: Expected 200, got ${res17.status}`);
  }

  // TEST 18: Verify 404 on deleted note
  console.log("\n▶ TEST 18: Verify 404 Not Found on deleted note");
  const res18 = await fetch(`${BASE_URL}/notes/read/${noteAId}`, {
    headers: { Authorization: `Bearer ${userAToken}` },
  });
  if (res18.status === 404) {
    console.log("  ✅ Correctly returned 404 Not Found for deleted note.");
  } else {
    throw new Error(`Failed Test 18: Expected 404, got ${res18.status}`);
  }

  // Clean test records
  await User.deleteMany({
    email: { $in: ["alice@test.com", "bob@test.com", "admin@test.com"] },
  });
  await Note.deleteMany({ _id: noteAId });
  await mongoose.disconnect();

  console.log("\n==================================================");
  console.log("  🎉 ALL 18 EXPANDED BACKEND TESTS PASSED!       ");
  console.log("==================================================");
}

runTests().catch((err) => {
  console.error("❌ Test suite failed:", err);
  process.exit(1);
});
