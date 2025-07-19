import express from "express"
import { healthCheck } from "./handlers/health.ts"
import { getDevices } from "./handlers/getDevices.ts"

//TODO: do a clever thing with dotenv? 

const app = express()
app.get('/health', healthCheck)
app.get('/devices', getDevices)

console.log("iot hub api is ready")
app.listen(3000)