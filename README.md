# Xylaz

# การติดตั้ง

## Download Project

```
git clone https://github.com/sEsA-24/Xylaz.git
```

## Frontend

Developing in Vite.

### Project Setup

cd and npm install in both folder (frontend and admin)

```sh
cd frontend
npm install
and
cd admin
npm install
```

### Compile and Hot-Reload for Development


```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Backend

ในส่วน Backend (xylaz) ติดตั้ง JDK Version 17

1. Database Name = Xylaz
2. Backend Port = 8085
3. For admin, username: admin
password: admin1234

# Features of the Application

## ระบบการนัดหมาย (Appointment System)
**รายละเอียด:**  
ผู้ใช้สามารถสร้าง ดู และจัดการการนัดหมายได้ผ่านหน้าต่าง ๆ ในระบบ ระบบจะบันทึกข้อมูลการนัดหมายลงฐานข้อมูลและให้ผู้ใช้สามารถเรียกดูได้ทุกเวลา

**การทำงาน:**
- แสดงรายการนัดหมายทั้งหมดในระบบ ซึ่งดึงข้อมูลจากฐานข้อมูลและแสดงบนหน้าแสดงผล
- ผู้ใช้สามารถเพิ่มนัดหมายใหม่หรืออัปเดตการนัดหมายเดิมได้

**ตัวอย่าง:**
- **หน้าแสดงผลรายการนัดหมาย (AllAppointment):** แสดงรายการนัดหมายทั้งหมดพร้อมข้อมูลรายละเอียด
- **ฟอร์มสำหรับเพิ่มหรือแก้ไขนัดหมาย (AddAppointment)**

---

## ระบบจัดการผู้ใช้ (User Management System)
**รายละเอียด:**  
ระบบมีฟังก์ชันในการจัดการผู้ใช้ เช่น ผู้ใช้สามารถเข้าสู่ระบบ ออกจากระบบ รวมถึงการยืนยันตัวตนผ่าน token ที่เก็บไว้ใน `AdminContext` และจัดการการเข้าถึงข้อมูลตามสิทธิ์ที่กำหนด

**การทำงาน:**
- เมื่อผู้ใช้เข้าสู่ระบบ ระบบจะจัดการ token ของผู้ใช้และบันทึกลงใน `local storage` เพื่อใช้ในการยืนยันตัวตนในแต่ละครั้งที่ผู้ใช้ทำการเรียก API
- ฟีเจอร์การออกจากระบบจะทำการล้าง token ที่เก็บไว้และพาผู้ใช้กลับไปยังหน้าหลัก

**ตัวอย่าง:**
- **ระบบยืนยันตัวตนผู้ใช้เมื่อเข้าสู่ระบบ (Login)**
- **จัดการ token ที่เก็บอยู่ใน local storage** เพื่อให้ผู้ใช้สามารถเข้าถึงหน้าแสดงผลต่าง ๆ ได้ตามสิทธิ์

---

## การจัดการข้อมูลผู้ให้บริการ (Provider Management)
**รายละเอียด:**  
ผู้ดูแลระบบสามารถจัดการข้อมูลของผู้ให้บริการ เช่น ช่างตัดผม (Barber) ได้ รวมถึงการบันทึกข้อมูลผู้ให้บริการเพื่อการนัดหมายและบริการต่าง ๆ

**การทำงาน:**
- หน้าฟอร์มสำหรับเพิ่มผู้ให้บริการใหม่ที่สามารถระบุข้อมูลของผู้ให้บริการ รวมถึงข้อมูลที่จำเป็นอื่น ๆ
- แสดงรายการผู้ให้บริการทั้งหมดในระบบ และอนุญาตให้แก้ไขหรือลบผู้ให้บริการที่ต้องการได้

**ตัวอย่าง:**
- **หน้า AddBarber:** สำหรับเพิ่มข้อมูลผู้ให้บริการใหม่
- **หน้าแสดงรายชื่อผู้ให้บริการ (AllBarbers):** แสดงรายการทั้งหมดในระบบ

---

## ระบบแจ้งเตือน (Notification System)
**รายละเอียด:**  
ใช้การแจ้งเตือนผ่านการแสดงผลข้อความเพื่อให้ข้อมูลที่เกี่ยวข้องกับการดำเนินการต่าง ๆ เช่น การบันทึกนัดหมายสำเร็จหรือการเกิดข้อผิดพลาดในการทำงาน

**การทำงาน:**
- ใช้ React Toastify เพื่อแสดงการแจ้งเตือนแบบเรียลไทม์เมื่อผู้ใช้ดำเนินการต่าง ๆ เช่น การเพิ่มนัดหมายสำเร็จ การเกิดข้อผิดพลาด หรือการแจ้งเตือนอื่น ๆ

**ตัวอย่าง:**
- เมื่อผู้ใช้เพิ่มนัดหมาย ระบบจะแสดงข้อความยืนยันว่าเพิ่มนัดหมายสำเร็จผ่าน toast notification

---

## การจัดการด้านความปลอดภัย (Security Management)
**รายละเอียด:**  
ระบบมีการจัดการความปลอดภัยเพื่อควบคุมการเข้าถึงข้อมูลโดยใช้ token authentication เพื่อให้มั่นใจว่าผู้ใช้สามารถเข้าถึงเฉพาะข้อมูลที่ได้รับอนุญาตเท่านั้น

**การทำงาน:**
- การยืนยันตัวตนผู้ใช้ด้วย token ที่สร้างขึ้นในขณะเข้าสู่ระบบ และใช้ในการเข้าถึงข้อมูลในระบบ
- ใช้ Spring Security ในฝั่ง backend เพื่อจัดการการเข้าถึง API และข้อมูลสำคัญ

**ตัวอย่าง:**
- เมื่อผู้ใช้เข้าสู่ระบบ ระบบจะสร้างและจัดการ token และอนุญาตให้ผู้ใช้เข้าถึงเฉพาะข้อมูลที่ได้รับสิทธิ์เท่านั้น

---

# ข้อมูลผู้พัฒนา (Developers)

- **นายณฐนนท์ ภูธนกิจ** (6510450313)
- **นายพศวัต คำภีระ** (6510450704)
- **นายธภัทร จิรเมธารัตน์** (6510450453)
