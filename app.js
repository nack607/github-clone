const { Octokit } = require("@octokit/rest");
const readline = require("readline");
const fs = require("fs");
const { spawn } = require("child_process");

const CONFIG_PATH = "./config.json";

// ฟังก์ชันสำหรับรับค่าจากคีย์บอร์ด
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// โหลด config หรือให้ผู้ใช้ป้อนใหม่
function loadConfig(callback) {
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    callback(config.username, config.auth);
  } else {
    rl.question("Enter your GitHub username: ", (username) => {
      rl.question("Enter your GitHub personal access token: ", (auth) => {
        const config = { username, auth };
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
        console.log("✅ บันทึกข้อมูลลง config.json แล้ว!");
        rl.close();
        callback(username, auth);
      });
    });
  }
}

// ดึงรายการ Repo และ Clone
function startCloning(username, auth) {
  const octokit = new Octokit({ auth });

  octokit.repos.listForAuthenticatedUser({ visibility: "all", per_page: 100 })
    .then(({ data }) => {
      if (data.length === 0) {
        console.log("❌ ไม่พบ Repository ในบัญชีนี้");
        return;
      }

      console.log(`🔹 พบ ${data.length} repositories กำลังเริ่ม clone...`);

      data.forEach((repo) => {
        const repoPath = `./clone/${repo.name}`;
        fs.mkdirSync(repoPath, { recursive: true });

        // ใช้ Token ใน URL เพื่อดึง Private Repo
        const repoUrl = `https://${username}:${auth}@github.com/${repo.full_name}.git`;

        console.log(`🚀 Cloning ${repo.full_name}...`);
        const clone = spawn("git", ["clone", repoUrl, repoPath]);

        clone.stdout.on("data", (data) => console.log(`stdout: ${data}`));
        clone.stderr.on("data", (data) => console.error(`stderr: ${data}`));
        
        // เมื่อ Clone เสร็จ ให้ลบ Repo ทิ้ง
        clone.on("close", async (code) => {
          console.log(`✅ Clone ${repo.name} เสร็จสิ้น!`);
          if (code == 0) {
            // ลบ Repo ทิ้ง
            const deleteRepo = await octokit.repos.delete({
              owner: repo.owner.login,
              repo: repo.name,
            });

            if (deleteRepo.status == 204) {
              console.log(`🗑 ลบ ${repo.full_name} ออกจาก GitHub สำเร็จ!`);
            } else {
              console.error(`❌ ไม่สามารถลบ ${repo.full_name} ออกจาก GitHub ได้`);
            }
          }
        });
      });
    })
    .catch((err) => {
      console.error("❌ เกิดข้อผิดพลาด:", err.message);
    });
}

// เริ่มกระบวนการ
loadConfig(startCloning);
