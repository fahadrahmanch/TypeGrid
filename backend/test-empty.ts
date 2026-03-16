import mongoose from "mongoose";
import { Competition } from "./src/infrastructure/db/models/user/competition.schema";
import { connectDB } from "./src/config/db";
import { LeaveQuickPlayUseCase } from "./src/application/use-cases/user/quick-play/leave-quick-play.use-case";
import { CompetitionRepository } from "./src/infrastructure/db/repositories/user/competition.repository";
import { UserRepository } from "./src/infrastructure/db/repositories/user/user.repository";
import { User } from "./src/infrastructure/db/models/user/user.schema";

(async () => {
  const db = new connectDB();
  await db.connectDatabase();

  const competitionRepository = new CompetitionRepository(Competition);
  const userRepository = new UserRepository(User);
  const useCase = new LeaveQuickPlayUseCase(competitionRepository, userRepository);

  const testGame = await Competition.findOne();
  if(!testGame) process.exit(0);

  const parts = [...testGame.participants];
  for(const p of parts) {
      console.log("Removing", p);
      await useCase.execute(testGame._id.toString(), p.toString());
  }

  const afterGame = await Competition.findById(testGame._id);
  console.log("Game after leave execution:", afterGame ? "EXISTS" : "GONE");
  if (afterGame) {
     console.log("Status:", afterGame.status);
     console.log("Participants:", afterGame.participants);
  }
  
  process.exit();
})();
