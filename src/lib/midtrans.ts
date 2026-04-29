import midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: false, // Ubah ke true jika sudah siap meluncur
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
});
