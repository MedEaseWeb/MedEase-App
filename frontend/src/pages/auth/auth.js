// src/api/auth.js

const BASE_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  // console.log(
  //   `sending login request to: ${BASE_URL}/auth/login with load: ${password}, ${email}`
  // );
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include", // Send cookies
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  console.log("getting response:", res);

  if (!res.ok) throw new Error("Invalid login");

  return res.json();
}

export async function fetchUser() {
  const res = await fetch(`${BASE_URL}/auth/user`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Not logged in");

  return res.json();
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");

  return res.json();
}
