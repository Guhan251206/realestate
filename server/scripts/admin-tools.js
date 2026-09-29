const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../src/models/User');

const usage = `
Usage:
  node scripts/admin-tools.js reset <email> <newPassword>
  node scripts/admin-tools.js verify <email> <passwordGuess>
  node scripts/admin-tools.js create <name> <email> <password>
`;

async function connect() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI missing in server/.env');
  }
  await mongoose.connect(process.env.MONGO_URI);
}

async function resetPassword(email, newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  console.log(`Password reset successful for ${user.email}`);
}

async function verifyGuess(email, guess) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new Error(`User not found: ${email}`);
  }

  const ok = await bcrypt.compare(guess, user.password);
  console.log(ok ? 'Password guess is CORRECT' : 'Password guess is NOT correct');
}

async function createAdmin(name, email, password) {
  if (!name || name.trim().length < 2) throw new Error('Name must be at least 2 chars');
  if (!password || password.length < 6) throw new Error('Password must be at least 6 chars');

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error(`Email already exists: ${normalizedEmail}`);
  }

  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hash,
    profilePicture: '',
  });

  console.log(`Admin/user account created: ${user.email}`);
}

async function main() {
  const [, , cmd, ...args] = process.argv;

  if (!cmd) {
    console.log(usage);
    process.exit(1);
  }

  await connect();

  if (cmd === 'reset') {
    const [email, newPassword] = args;
    if (!email || !newPassword) throw new Error(usage.trim());
    await resetPassword(email, newPassword);
  } else if (cmd === 'verify') {
    const [email, guess] = args;
    if (!email || !guess) throw new Error(usage.trim());
    await verifyGuess(email, guess);
  } else if (cmd === 'create') {
    const [name, email, password] = args;
    if (!name || !email || !password) throw new Error(usage.trim());
    await createAdmin(name, email, password);
  } else {
    throw new Error(`Unknown command: ${cmd}\n${usage}`);
  }
}

main()
  .catch((err) => {
    console.error('Error:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
