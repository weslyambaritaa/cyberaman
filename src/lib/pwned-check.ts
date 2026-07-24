// Checks a password against the HaveIBeenPwned "Pwned Passwords" API using
// k-anonymity: only the first 5 hex characters of the SHA-1 hash ever leave
// the browser, so the real password (and even its full hash) is never sent
// anywhere. Free, no API key required. https://haveibeenpwned.com/API/v3#PwnedPasswords
export async function checkPwnedPassword(password: string): Promise<number> {
  const digest = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(password));
  const hashHex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
  if (!res.ok) {
    throw new Error("Layanan cek kebocoran sedang tidak bisa diakses.");
  }

  const body = await res.text();
  const match = body.split("\n").find((line) => line.startsWith(suffix));
  return match ? Number(match.split(":")[1]) : 0;
}
