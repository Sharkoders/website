const qrcodeElement = document.querySelector("#qrcode > div");
const seedInput = document.querySelector("#seed");

async function generateNewSeed() {
  const keyObject = await window.crypto.subtle.generateKey(
    { name: "HMAC", hash: { name: "SHA-1" } },
    true,
    [ "sign", "verify" ]
  );

  const buffer = await window.crypto.subtle.exportKey("raw", keyObject);
  const byteString = String.fromCharCode.apply(null, new Uint8Array(buffer));
  const base32Key = base32encode(byteString);
  
  seedInput.value = base32Key;
  new QRCode(qrcodeElement, {
    text: `otpauth://totp/Account retrieval TOTP?issuer=Sharkoders&secret=${base32Key}`,
    correctLevel: QRCode.CorrectLevel.L
  });
};

function base32encode(byteString) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let base32String = "";
  let shiftBuffer = 0;
  let bitsLeft = 0;

  for (let i = 0; i < byteString.length; i++) {
    const bits = byteString.charCodeAt(i);
    
    shiftBuffer = (shiftBuffer << 8) | bits;
    bitsLeft += 8;

    while (bitsLeft >= 5) {
      base32String += alphabet[(shiftBuffer >> (bitsLeft - 5)) & 0x1f];
      bitsLeft -= 5;
    }
  }

  if (bitsLeft > 0) {
    base32String += alphabet[(shiftBuffer << (5 - bitsLeft)) & 0x1f];
  }

  const paddingLength = 8 - (base32String.length % 8);
  if (paddingLength != 8) {
    base32String += '='.repeat(paddingLength);
  }

  return base32String;
}

generateNewSeed();