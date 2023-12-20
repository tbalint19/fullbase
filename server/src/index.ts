import express from "express"
import fs from "fs/promises"
import cors from "cors"
import { z } from "zod"

const sleep = () => new Promise<void>((resolve) => setTimeout(() => resolve(), 100))

const server = express()

server.use(cors({
  "origin": "http://localhost:5173"
}))
server.use(express.json())

server.use(async (req, res, next) => {
  await sleep()
  next()
})

/* server.use(express.static('public'))
server.get("/", async (req, res) => {
  const html = await fs.readFile(`${__dirname}/../public/index.html`, 'utf-8')
  res.send(html)
}) */

server.post("/api/countries", async (req, res) => {
  const result = z.object({ min: z.number() }).safeParse(req.body)
  if (!result.success)
    return res.sendStatus(400)
  const dataSentByUser = result.data

  const rawData = await fs.readFile(`${__dirname}/../database.json`, 'utf-8')
  const data = JSON.parse(rawData)

  const dataToSendBackToClient = data.countries
    .filter((country: any) => country.population > dataSentByUser.min)

  res.json(dataToSendBackToClient)
})

server.listen(4000)
