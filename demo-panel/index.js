import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';    

const app = express();
const port = 3009;

app.use(bodyParser.json());
app.use(cors());

let users = [
  { userId: 'user1', balance: 1999 , id:1},
  { userId: 'user2', balance: 1000 , id:2},
  { userId: 'user3', balance: 1000 , id:3},
  { userId: 'user4', balance: 1000 , id:4},
  { userId: 'user5', balance: 1000 , id:5},
];

let transactionHistory = {
  'user1': [
    { type: 'deposit', amount: 1000, timestamp: new Date().toISOString() }
  ]
};

// Route to store user balance


app.post('/user', (req, res) => {
  res.status(200).send({ users });
});

// Route to get user balance
app.get('/balance/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(u => u.userId === userId);
  if (user) {
    res.status(200).send({ userId, balance: user.balance });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

app.post('/balance', (req, res) => {
  const { userId } = req.body;
  console.log("user Id: " + Number(userId));
  const user = users.find(u => u.id === Number(userId));
  if (user) {
    res.status(200).send({ userId, balance: user.balance });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});
// Route to store transaction history
app.post('/transaction', (req, res) => {
  const { userId, transaction } = req.body;
  if (!transactionHistory[userId]) {
    transactionHistory[userId] = [];
  }
  transactionHistory[userId].push(transaction);
  res.status(200).send({ message: 'Transaction recorded successfully' });
});

// Route to get transaction history
app.get('/transaction/:userId', (req, res) => {
  const { userId } = req.params;
  const transactions = transactionHistory[userId];
  if (transactions) {
    res.status(200).send({ userId, transactions });
  } else {
    res.status(404).send({ message: 'User not found' });
  }
});

// Route to credit user balance
app.post('/credit', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  user.balance += amount;
  if (!transactionHistory[userId]) {
    transactionHistory[userId] = [];
  }
  transactionHistory[userId].push({ type: 'credit', amount, timestamp: new Date().toISOString() });
  res.status(200).send({ message: 'Amount credited successfully', balance: user.balance });
});

app.post('/credit-server', (req, res) => {
  const { userId, amount } = req.body;
  console.log(req.body);
  const user = users.find(u => u.id === Number(userId));
  console.log("user", user);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  user.balance += amount;
  if (!transactionHistory[userId]) {
    transactionHistory[userId] = [];
  }
  transactionHistory[userId].push({ type: 'credit', amount, timestamp: new Date().toISOString() });
  res.status(200).send({ message: 'Amount credited successfully', balance: user.balance });
});

app.post('/deduction-server', (req, res) => {
  try {
    const { amount, secretKey, userId } = req.body;
    console.log(req.body);
    const user = users.find(u => u.id === Number(userId));
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    user.balance -= amount;
    if (!transactionHistory[userId]) {
      transactionHistory[userId] = [];
    }
    transactionHistory[userId].push({ type: 'credit', amount, timestamp: new Date().toISOString() });
    res.status(200).send({ message: 'Amount credited successfully', balance: user.balance });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error', error: error});
  }
});

//Route to withdraw user balance
app.post('/withdraw', (req, res) => {
  const { userId, amount } = req.body;
  const user = users.find(u => u.userId === userId);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  if (user.balance < amount) {
    return res.status(400).send({ message: 'Insufficient balance' });
  }
  user.balance -= amount;
  if (!transactionHistory[userId]) {
    transactionHistory[userId] = [];
  }
  transactionHistory[userId].push({ type: 'withdraw', amount, timestamp: new Date().toISOString() });
  res.status(200).send({ message: 'Amount withdrawn successfully', balance: user.balance });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});