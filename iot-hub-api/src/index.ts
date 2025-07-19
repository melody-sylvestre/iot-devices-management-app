import express from "express"
import { healthCheck } from "./handlers/health.ts"

const app = express()
app.get('/health', healthCheck)

console.log("iot hub api is ready")
app.listen(3000)