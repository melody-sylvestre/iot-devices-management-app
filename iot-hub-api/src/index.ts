import express from "express"
import { healthCheck } from "./handlers/health.ts"

const app = express()
app.get('/health', healthCheck)

app.listen(3000)