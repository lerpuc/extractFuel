import app from './app'

app.listen(process.env.PORT);
console.log("Porta: ", process.env.PORT);
console.log("Ambiente: ", process.env.NODE_ENV);
