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

// Self-reported bid — skeptical tone
export const BID_SELF_MESSAGES: Array<
  (name: string, count: number, reason?: string) => string
> = [
  (name, count, reason) =>
    reason
      ? `อ้าว ${name} บิดเองแล้วยังรายงานเองด้วย... เหตุผล: "${reason}" 🙄 (ครั้งที่ ${count})`
      : `${name} รายงานตัวเองเหรอ... โอเค บันทึกให้ละกัน 🙄 ครั้งที่ ${count} แล้วนะ`,
  (name, count, reason) =>
    reason
      ? `"${reason}" อ้างอิงไรอ่ะ ${name}... ใช่หรอ 🌝 ครั้งที่ ${count} แล้ว`
      : `${name} สารภาพเองเลยนะ 😏 รวม ${count} ครั้งเดือนนี้`,
  (name, count, reason) =>
    reason
      ? `โอเค ${name} บิดเพราะ "${reason}" ฟังดูน่าเชื่อถือมาก 🤗 ครั้งที่ ${count}`
      : `${name} บอกเองว่าบิด... ความซื่อสัตย์ก็ดีนะ แต่ก็ยังบิดอยู่ดี 😶 ครั้งที่ ${count}`,
  (name, count, reason) =>
    reason
      ? `บันทึก "${reason}" ไว้เป็นหลักฐานแล้ว ${name} 📋 ครั้งที่ ${count}!`
      : `${name} รายงานตัวเอง +1 แต้มนักบิด 📋 รวม ${count} ครั้งเดือนนี้`,
  (name, count, reason) =>
    reason
      ? `${name} บิดเพราะ "${reason}" แล้วมาบอกเองด้วย... ครั้งที่ ${count} ปีนี้ เออ เดือนนี้ 🛵`
      : `${name} รายงานตัวเองว่าบิด ความกล้าน่าชื่นชม แต่ก็ยังได้แต้มนะ 🛵 ครั้งที่ ${count}`,
];

// Reported by others — disappointed/encouraging tone
export const BID_REPORTED_MESSAGES: Array<
  (name: string, count: number, reason?: string) => string
> = [
  (name, count, reason) =>
    reason
      ? `${name} บิดเพราะ "${reason}" 😔 หวังว่าครั้งหน้าจะไหวนะ (ครั้งที่ ${count})`
      : `${name} บิดอีกแล้ว... 😔 เดือนนี้ ${count} ครั้งแล้วนะ ไปวิ่งได้แล้ว`,
  (name, count, reason) =>
    reason
      ? `"${reason}" เข้าใจนะ ${name} แต่ครั้งหน้าสู้ๆ นะ 💪 (ครั้งที่ ${count})`
      : `${name} พลาดไปอีกครั้ง... ไม่เป็นไร ครั้งหน้าทำได้แน่นอน 💪 ครั้งที่ ${count}`,
  (name, count, reason) =>
    reason
      ? `โอ้ ${name}... "${reason}" เหรอ 😞 ยังไงก็เป็นกำลังใจให้นะ ครั้งที่ ${count}`
      : `${name} บิดอีกครั้ง 😞 ${count} ครั้งแล้วเดือนนี้ แต่ยังมีเวลาเหลือนะ!`,
  (name, count, reason) =>
    reason
      ? `บันทึกแล้ว ${name} เหตุผล: "${reason}" 📋 ครั้งหน้าสู้ใหม่นะ! ครั้งที่ ${count}`
      : `บันทึกแล้ว ${name} +1 แต้มนักบิด 📋 ${count} ครั้งเดือนนี้ ไปวิ่งเลยนะ!`,
  (name, count, reason) =>
    reason
      ? `${name} บิดเพราะ "${reason}" 🥺 ไม่เป็นไร ครั้งหน้าอย่าลืมนะ ครั้งที่ ${count}`
      : `${name}... 🥺 ${count} ครั้งแล้วเดือนนี้ เพื่อนๆ รอนะ!`,
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
