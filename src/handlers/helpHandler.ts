import { MessageEvent } from '@line/bot-sdk';
import { lineClient } from '../services/lineClient';

const HELP_TEXT = `🤖 LINE Runner Bot — คำสั่งทั้งหมด

🏃 บันทึก KM
  +<km>          เช่น  +5.2  (ใช้ชื่อตัวเองอัตโนมัติ)
  <ชื่อ> +<km>   เช่น  บิว +5.2  (ระบุชื่อเอง)
  ส่งรูปจากแอพวิ่ง  (อ่านค่า km อัตโนมัติ)
  รองรับทศนิยมทั้ง  5.2  และ  5,2

🛵 บิด
  @mention บิด   หรือ  @mention บิดคับ
  เพิ่มแต้มนักบิดให้คนที่โดน mention
  ผมบิดคับ  (รายงานตัวเอง)

↩️ unบิด
  @mention unบิด
  ลบแต้มนักบิดล่าสุดของเดือนนี้ออก 1 แต้ม
  unบิดผมคับ  (ลบแต้มตัวเอง)

📊 ดูตาราง
  /km  หรือ  วิ่ง         → ตาราง KM เดือนนี้
  /บิด  หรือ  นักบิด       → ตารางนักบิดเดือนนี้
  นักบิดตัวยง              → ฮอลล์ออฟเฟมนักบิดตลอดกาล 🏛️

ช่วยด้วย  → แสดงข้อความนี้`;

export async function helpHandler(event: MessageEvent): Promise<void> {
  await lineClient.replyMessage({
    replyToken: event.replyToken,
    messages: [{ type: 'text', text: HELP_TEXT }],
  });
}
