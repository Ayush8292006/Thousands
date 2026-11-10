// ---------------------------------------------------------------
// Seller API layer — abhi demo data / dummy responses.
// Backend team: in functions ke andar real fetch() calls daalni hain.
// Suggested endpoints:
//   POST /seller/auth/otp            { phone }
//   POST /seller/auth/verify         { phone, otp }        -> { token, seller }
//   PUT  /seller/kyc                 { business, tax, bank, address, docs }
//   GET  /seller/products            ?status=
//   POST /seller/products            PUT /seller/products/:id
//   GET  /seller/orders              ?status=
//   POST /seller/orders/:id/accept | /pack | /ready | /cancel
//   GET  /seller/payouts             GET /seller/settlements
// ---------------------------------------------------------------
export const API_BASE_URL = 'https://api.thousands.example/v1'; // TODO: backend URL

const delay = () => Promise.resolve(); // no fake waiting

export async function sendOtp(phone) {
  await delay(400);
  return { ok: true, phone };
}

export async function verifyOtp(phone, otp) {
  await delay(400);
  return { ok: otp.length === 6, seller: { phone } };
}
