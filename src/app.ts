import express, { Request, Response } from "express";
import dotenv from "dotenv";
import "reflect-metadata"
import { AppDataSource } from "./config/data-source";
import telegramBot from "node-telegram-bot-api";
import { DataSource } from "typeorm";
import { Teacher } from "./entity/teacher.entity";
import { Student } from "./entity/student.entity";
import { Class } from "./entity/class.entity";




// Load environment variables
dotenv.config();
const token = process.env.TELEGRAM_TOKEN || "";
const app = express();


// Middleware
app.use(express.json());



// Default Route
app.get("/", (req: Request, res: Response) => {
  res.send(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
const bot = new telegramBot(token, { polling: true });



const commands = [
    { command: "/start", description: "Start the bot and get command list" },
    { command: "/help", description: "Get help and usage instructions" },
    { command: "/student", description: "Get get student information" },
    { command: "/teacher", description: "See current teacher" },
    { command: "/class", description: "send list of all class infos order by class room name " }
   
  ];
  
  // Set bot commands in Telegram
  bot
    .setMyCommands(commands)
    .then(() => console.log("Commands set successfully"));
  
  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    let response = "Hello from HeangRedHulkGym, how can I help you?";
    commands.forEach((cmd) => {
      response += `${cmd.command} - ${cmd.description}\n`;
    });
    bot.sendMessage(chatId, response);
  });
  
  // Handle other commands
  bot.onText(/\/teacher/,  async (msg) => {
    const userRepo = AppDataSource.getRepository(Teacher);
    try {
      const teacherList = await userRepo.find({
        order: { first_name: "DESC" }
      })
      if (teacherList.length === 0) {
        return bot.sendMessage(msg.chat.id, "No branch found.");
      }
      const teachers = teacherList.map(
        (teacher, index) =>
          `🔥 Teacher ${index + 1} 🔥\n` +
          `💬 ${teacher.last_name}` +
          ` ${teacher.first_name}\n`+
          `📚 ${teacher.email}\n`+
          `📞 ${teacher.phone}\n`
          
      ).join('\n\n\n');
      bot.sendMessage(msg.chat.id, `All teacher ${teachers}`)
    } catch (err) {
      console.error("Error fetching teacher", err)
      bot.sendMessage(msg.chat.id, "Failed to fetch teacher. Please try again later.")
    }
  
  });

  
  bot.onText(/\/student/,  async (msg) => {
    const userRepo = AppDataSource.getRepository(Student);
    try {
      const studentList = await userRepo.find({
        order: { first_name: "DESC" }
      })
      if (studentList.length === 0) {
        return bot.sendMessage(msg.chat.id, "No student found.");
      }
      const students = studentList.map(
        (student, index) =>
          `🔥 student ${index + 1} 🔥\n` +
          `💬 ${student.last_name}` +
          ` ${student.first_name}\n`+
          `📚 ${student.email}\n`+
          `📚${student.birth_date}\n`+
          `📚 ${student.phone}\n`+
          `📚 ${student.address}\n`
          
      ).join('\n\n\n');
      bot.sendMessage(msg.chat.id, `All students ${students}`)
    } catch (err) {
      console.error("Error fetching student", err)
      bot.sendMessage(msg.chat.id, "Failed to fetch students. Please try again later.")
    }
  
  });


  bot.onText(/\/class/, async (msg) => {
    const userRepo = AppDataSource.getRepository(Class);
    try {
      const classes = await userRepo.find({
        relations: {
          teacher_id: true
        },
        order: { class_id: "DESC" },
      });
  
      if (classes.length === 0) {
        return bot.sendMessage(msg.chat.id, "No class found.");
      }
  
      // Create inline buttons for each workout plan
      const display = classes.map(
        (classess, index) =>
        `🔥Class: ${index + 1} 🔥\n` +
        `Class name: ${classess.class_name}\n`+
        `Subject: ${classess.subject}\n`+
        `Teacher name: ${classess.teacher_id.last_name}${classess.teacher_id.first_name}\n`+
        `Phone: ${classess.teacher_id.phone}`, 
      ).join('\n\n\n');

  
      bot.sendMessage(msg.chat.id, `${display}`);
    } catch (err) {
      console.error("Error fetching class", err);
      bot.sendMessage(msg.chat.id, "Failed to fetch classes. Please try again later.");
    }
  });
// Start Server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });


const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

export default app;
