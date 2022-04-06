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

function getBalance(statement){
    const balance = statement.reduce((acc,operation) => {
        if(operation.type === 'credit'){
            return acc + operation.amount
        }
        
        if(operation.type === 'debit'){
            return acc - operation.amount
        }

    }, 0)
    
    return balance
}

// register a customer
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

// make a deposit on customer account
app.post('/deposit/', verifyIfCustomerCPFexists, (request, response) => {
    const { description, amount } = request.body

    const { customer } = request

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: 'credit'
    }

    customer.statement.push(statementOperation)
    
    return response.status(201).send()
})

// make a withdraw on customer account
app.post('/withdraw/', verifyIfCustomerCPFexists, (request, response) => {
    const { amount } = request.body
    const { customer } = request

    const balance = getBalance(customer.statement)

    if (balance < amount) {
        return response.status(400).json({ error: 'Insufficient founds.' })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: 'debit'
    }

    customer.statement.push(statementOperation)
    
    return response.status(201).send()
})

app.get('/statement/date', verifyIfCustomerCPFexists, (request, response) => {
    const { customer } = request
    const { date } = request.query

    const dateFormat = new Date(date + " 00:00") 

    const statement = customer.statement.filter(statement => statement.created_at.toDateString() === new Date(dateFormat).toDateString()
    )

    return response.json(statement)
})

app.put('/account', verifyIfCustomerCPFexists, (request, response) => {
    const { name } = request.body
    const { customer } = request
    
    customer.name = name

    return response.status(201).send()
})

app.get('/account', verifyIfCustomerCPFexists, (request, response) => {
    const { customer } = request
    
    return response.json(customer)
})

app.listen(3333)