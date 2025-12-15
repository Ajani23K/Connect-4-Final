This project is a webapp where you face an AI opponent in connect four. Wins and losses are recorded and sent to the backend which is then saved and sent back to the frontend as a global win loss record of every person that played connect 4 against the AI. 
When starting a game, click an empty space where you want to place a chip, the AI will follow your turn until there are no more remaining spaces or until either of you have achieved connect 4. To restart a match click reset, you can also press undo to go back one turn. 

Frontend: React, Vite
Uploaded to Vercel

Backend: Postgres, Express
Uploaded to Render 

Database Table: 
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  human_wins INT DEFAULT 0,
  ai_wins INT DEFAULT 0,
  ties INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

Frontend: connect-4-final-git-main-ajanis-projects-0e1d2182.vercel.app

Backend: https://connect-4-final.onrender.com/api/stats

