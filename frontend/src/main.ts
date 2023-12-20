import { z } from "zod"

console.log("script arrived")

const demo = async () => {
  console.log("demo triggered")
  const value = (document.getElementById("min") as HTMLInputElement).value
  const response = await fetch("http://localhost:4000/api/countries", {
    "method": "POST",
    "headers": { 'Content-Type': "application/json" },
    "body": JSON.stringify({ min: value })
  })

  const data = await response.json()

  const result = z.object({
      name: z.string(),
      population: z.number()
  }).array().safeParse(data)

  if (!result.success) {
    console.log(result.error.issues)
    return alert("Ooops")
  }

  document.getElementById("result")!.innerHTML =
    result.data.map(c => `<p>${c.name} (${c.population})</p>`).join("<hr>")
}

document.getElementById("demo")!.addEventListener("click", demo)