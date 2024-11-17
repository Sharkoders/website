import { createHmac } from "crypto";

function base32decode(byteString: string) {
  const finalArray = new Uint8Array(byteString.length * 5 / 8);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let padding = 0;

  for (let i = 0 ; i < byteString.length ; i++) {
    const bits = byteString[i] == "=" ? 0 : alphabet.indexOf(byteString[i]);
    
    const beginIndex = Math.floor(padding / 8);
    const endIndex = Math.floor((padding + 4) / 8);

    const beginShift = 3 - padding + 8 * beginIndex;
    const endShift = 3 - padding + 8 * endIndex;

    finalArray[beginIndex] |= 0xff & (beginShift > 0 ? bits << beginShift : bits >> Math.abs(beginShift));
    finalArray[endIndex] |= 0xff & (endShift > 0 ? bits << endShift : bits >> Math.abs(endShift));

    padding += 5;
  }

  return finalArray;
}

export function totp(seed: string, timeOffset: number) {
  const secret = base32decode(seed);
  const time = BigInt(Math.floor(Date.now() / 30000) + timeOffset);

  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(time);

  const hmac = createHmac("sha1", secret).update(buffer).digest();
  const offset = (hmac.at(-1) ?? 0) & 0xf;
  
  return (hmac.readInt32BE(offset) & 0x7fffffff) % 1000000;
}
