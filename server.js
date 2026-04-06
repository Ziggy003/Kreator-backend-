import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// 🔐 GOOGLE LOGIN
app.get("/auth/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&response_type=code&scope=openid email profile`;

  res.redirect(url);
});

// 🔁 CALLBACK
app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code"
    });

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    const user = userRes.data;

    // 👉 Aqui você pode salvar no banco depois
    res.redirect(`https://kreator-ao.vercel.app/dashboard?user=${encodeURIComponent(JSON.stringify(user))}`);

  } catch (err) {
    res.send("Erro no login");
  }
});

app.listen(PORT, () => console.log("Servidor rodando"));