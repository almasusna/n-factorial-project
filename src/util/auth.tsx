export function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

export function signIn(token: string) {
  localStorage.setItem("token", token);
}

export function signOut() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
