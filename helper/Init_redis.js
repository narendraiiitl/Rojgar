const redis = require('redis')
const client = redis.createClient({
    port:process.env.REDIS_PORT,
    host:process.env.REDIS_HOST
})
client.auth(process.env.REDIS_PASSWORD);

client.on('connect',()=>{
    console.log("client connected to redis")
})
client.on('ready',()=>{
    console.log("client redis is ready")
})
client.on('err',(err)=>{
    console.log(err.message)
})
client.on('end',()=>{
    console.log("Redis client disconnected")
})
process.on('SIGINT',()=>{
    client.quit()
})

module.exports = client
