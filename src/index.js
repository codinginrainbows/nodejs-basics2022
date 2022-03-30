const {v4: uuidv4} = require('uuid')

const express = require('express')

const app = express()

app.use(express.json())

const customers = []

function verifyIfCustomerCPFexists(request, response, next) {
    const { cpf } = request.headers

    // returns the whole object    
    const customer = customers.find(customer => customer.cpf === cpf)

    if(!customer) {
        return response.json({ error: 'Customer not found' })
    }

    request.customer = customer

    return next()
}

// register customer
app.post('/account', (request, response) => {
    const { cpf, name } = request.body
    const id = uuidv4()

    // prevents duplicated customer - returns true or false
    const cpfAlreadyExists = customers.some(
        customer => customer.cpf === cpf
    )

    if(cpfAlreadyExists) {
        return response.status(400).json({ error: 'Customer already exists' })
    }
    
    customers.push({
        cpf,
        name,
        id,
        statement: [],
    })

    return response.status(201).send()
})

// get customer's statement by cpf
app.get('/statement/', verifyIfCustomerCPFexists, (request, response) => {
    const { customer } = request

    return response.json(customer.statement)
})



app.listen(3333)