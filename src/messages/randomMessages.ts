export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const KM_ADDED_MESSAGES: Array<(name: string, km: number) => string> = [
  (name, km) => `${name} วิ่ง ${km} km! 🔥 ไปต่อเลย!`,
  (name, km) => `+${km} km สำหรับ ${name} ✅ ยอดเยี่ยมมาก!`,
  (name, km) => `โอ้โห ${name} วิ่ง ${km} km เนี่ยนะ! เพื่อนๆ รู้ยัง? 👀`,
  (name, km) => `${name} ทำได้! ${km} km เพิ่มเข้ากระปุกแล้ว 🏃`,
  (name, km) => `${km} km?! ${name} คนนี้ไม่ธรรมดาเลยนะ 👟`,
  (name, km) => `บันทึกแล้ว! ${name} +${km} km 📝 Keep it up!`,
  (name, km) => `${name} วิ่ง ${km} km อีกแล้ว... คนอื่นยังนอนอยู่เลย 😅`,
];

export const BID_ADDED_MESSAGES: Array<(name: string, count: number, reason?: string) => string> = [
  (name, count, reason) => reason
    ? `${name} บิดเพราะ "${reason}" 🤦 ครั้งที่ ${count} แล้วนะเนี่ย`
    : `${name} บิดอีกแล้วเหรอ! 😤 เดือนนี้ ${count} ครั้งแล้วนะ`,
  (name, count, reason) => reason
    ? `"${reason}" อ้างอิงไรอ่ะ ${name}... ไม่มีใครเชื่อหรอก 😂 (${count} ครั้งแล้ว)`
    : `${name} เข้าใกล้แชมป์นักบิดแล้ว! 🏆 ${count} ครั้งเดือนนี้`,
  (name, count, reason) => reason
    ? `โอเค ${name} บิดเพราะ "${reason}" ✅ ฟังดูน่าเชื่อถือมาก (ไม่เชื่อเลย) 🙄`
    : `ใครบิดก็ ${name} อีกแล้ว 555+ (${count} ครั้งแล้วเดือนนี้)`,
  (name, count, reason) => reason
    ? `บันทึก "${reason}" ไว้เป็นหลักฐานแล้ว ${name} 📋 ครั้งที่ ${count} เดือนนี้!`
    : `บันทึกแล้ว! ${name} +1 แต้มนักบิด 📋 รวม ${count} ครั้งเดือนนี้`,
  (name, count, reason) => reason
    ? `${name} บิดอย่างมีสไตล์เพราะ "${reason}" 🛵 ครั้งที่ ${count} ปีนี้... เออ เดือนนี้`
    : `${name} บิดอย่างมีสไตล์ 🛵 ${count} ครั้งแล้วนะ`,
  (name, count, reason) => reason
    ? `ไม่แปลกใจเลย ${name} ข้อแก้ตัวครั้งที่ ${count}: "${reason}" 😏`
    : `ไม่แปลกใจเลย... ${name} บิดอีกครั้ง 😏 ${count} ครั้งแล้วเดือนนี้`,
  (name, count, reason) => reason
    ? `${name} มีพรสวรรค์ด้านการบิดจริงๆ 🎓 ครั้งที่ ${count} เหตุผล: "${reason}"`
    : `${name} มีพรสวรรค์ด้านการบิดจริงๆ 🎓 ${count} ครั้งแล้วเดือนนี้`,
];

export const KM_OCR_FAILED_MESSAGES: Array<() => string> = [
  () => `อ่านรูปไม่ออกเลยนะ 🤔 ลองพิมพ์ "<ชื่อ> +<km>" แทนได้เลย!`,
  () => `OCR งง... 😵 ช่วยพิมพ์เป็น "<ชื่อ> +5.2" แทนได้มั้ย?`,
  () => `รูปนี้ยากเกินไปสำหรับฉัน 🤖 พิมพ์ "<ชื่อ> +<km>" แทนนะ`,
];

export const LEADERBOARD_INTRO_MESSAGES: Array<() => string> = [
  () => `นี่คือตารางคะแนนประจำเดือน! 🏆`,
  () => `ดูกันเลย ใครนำโด่งบ้าง! 👀`,
  () => `ผลการแข่งขัน... เปิดเผย! 🎉`,
];

export const BID_LEADERBOARD_INTRO_MESSAGES: Array<() => string> = [
  () => `ฮอลล์ออฟเฟมนักบิดประจำเดือน 🛵`,
  () => `ใครครองบัลลังก์นักบิดเดือนนี้? 👑`,
  () => `ผู้ที่ทุ่มเทกับการบิดที่สุด... 🎖️`,
];
