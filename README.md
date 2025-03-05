# GitHub Repository Cloner and Deleter

โปรเจกต์นี้เป็นสคริปต์ Node.js ที่ใช้สำหรับโคลนและลบ Repository ทั้งหมดจากบัญชี GitHub ของคุณ โดยใช้ GitHub API และคำสั่ง Git CLI

## ข้อควรระวัง

โปรเจกต์นี้จะลบ Repository ทั้งหมดจากบัญชี GitHub ของคุณหลังจากโคลนเสร็จสิ้น ดังนั้นโปรดใช้ด้วยความระมัดระวัง!

## วิธีการใช้งาน

1. **ติดตั้ง dependencies**:
   ```bash
   npm install @octokit/rest readline fs child_process
   ```
2. **สร้างไฟล์ config.json**:

คุณสามารถสร้างไฟล์ config.json ด้วยตนเอง หรือรันสคริปต์แล้วป้อนข้อมูลเมื่อถูกถาม

ไฟล์ config.json ควรมีรูปแบบดังนี้:
```bash
    {
      "username": "your-github-username",
      "auth": "your-github-personal-access-token"
    }
```
3. **รันสคริปต์**:
```bash
node app.js
```
4. **กระบวนการทำงาน**:

สคริปต์จะโคลน Repository ทั้งหมดจากบัญชี GitHub ของคุณไปยังโฟลเดอร์ ./clone/

หลังจากโคลนเสร็จสิ้น สคริปต์จะลบ Repository นั้นออกจาก GitHub

## ตัวอย่างการทำงาน
```bash
$ node app.js
Enter your GitHub username: your-username
Enter your GitHub personal access token: your-token
✅ บันทึกข้อมูลลง config.json แล้ว!
🔹 พบ 10 repositories กำลังเริ่ม clone...
🚀 Cloning your-username/repo1...
✅ Clone repo1 เสร็จสิ้น!
🗑 ลบ your-username/repo1 ออกจาก GitHub สำเร็จ!
🚀 Cloning your-username/repo2...
✅ Clone repo2 เสร็จสิ้น!
🗑 ลบ your-username/repo2 ออกจาก GitHub สำเร็จ!
```

## ข้อควรระวัง
การลบ Repository เป็นการกระทำที่ถาวร และไม่สามารถกู้คืนได้ โปรดตรวจสอบให้แน่ใจว่าคุณต้องการลบ Repository จริงๆ ก่อนรันสคริปต์

Token ที่ใช้ควรมีสิทธิ์เพียงพอ สำหรับการลบ Repository
