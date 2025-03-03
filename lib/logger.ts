import fs from "fs";
import path from "path";

export function logLogin(username: string, role: string) {
  try {
    const jakartaTime = new Date().toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      dateStyle: "full",
      timeStyle: "medium",
    });
    const logMessage = `${jakartaTime} - User: ${username}, Role: ${role}\n`;
    const logPath = path.resolve(process.cwd(), "logs", "login.log");

    // Ensure the logs directory exists
    const logsDir = path.dirname(logPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Write the log message to the file
    fs.appendFileSync(logPath, logMessage);
    console.log("Login logged successfully:", logMessage.trim());
  } catch (error) {
    console.error("Error in logLogin function:", error);
  }
}
