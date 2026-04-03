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

export const BID_ADDED_MESSAGES: Array<(name: string) => string> = [
  (name) => `${name} บิดอีกแล้วเหรอ! 😤 แต้มนักบิดเพิ่มแล้วนะ`,
  (name) => `${name} เข้าใกล้แชมป์นักบิดแล้ว! 🏆 อีกนิดเดียว`,
  (name) => `ใครบิดก็ ${name} อีกแล้ว 555+`,
  (name) => `บันทึกแล้ว! ${name} +1 แต้มนักบิด 📋`,
  (name) => `${name} บิดอย่างมีสไตล์ 🛵`,
  (name) => `ไม่แปลกใจเลย... ${name} บิดอีกครั้ง 😏`,
  (name) => `${name} มีพรสวรรค์ด้านการบิดจริงๆ 🎓`,
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
