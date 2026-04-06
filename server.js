const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const oauthConfig = require('./config/oauth');

const app = express();

// Sessão
app.use(session({ secret: 'segredoKreator', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google
passport.use(new GoogleStrategy(oauthConfig.google, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Passport Facebook
passport.use(new FacebookStrategy(oauthConfig.facebook, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Rotas Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.send('Login Google bem-sucedido!'));

// Rotas Facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => res.send('Login Facebook bem-sucedido!'));

// Teste
app.get('/', (req, res) => res.send('Backend Kreator rodando!'));

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));