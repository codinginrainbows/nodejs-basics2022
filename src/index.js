const express = require("express")

const app = express()

app.get("/courses", (request, response) => {
    const query = request.query
    console.log(query)

    return response.json([
        "Course Node",
        "Course React",
        "Course React Native",
    ])
})

app.post("/courses", (request, response) => {
    return response.json([
        "Course Node",
        "Course React",
        "Course React Native",
        "Course PHP",
    ])
})

app.put("/courses/:id", (request, response) => {
    return response.json([
        "Course Node",
        "Course React",
        "Course React Native",
        "Course Laravel",
    ])
})

app.patch("/courses/:id", (request, response) => {
    return response.json([
        "Course Node",
        "Course React.js",
        "Course React Native",
        "Course Laravel",
    ])
})

app.delete("/courses/:id", (resquest, response) => {
    return response.json([
        "Course Node",
        "Course React.js",
        "Course React Native",
    ])
})

app.listen(3333)