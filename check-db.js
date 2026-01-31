const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database...\n')
  
  // Check users
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
      sessions: true
    }
  })
  
  console.log(`Total users: ${users.length}`)
  users.forEach(user => {
    console.log(`\nUser: ${user.email}`)
    console.log(`  ID: ${user.id}`)
    console.log(`  Accounts: ${user.accounts.length}`)
    console.log(`  Sessions: ${user.sessions.length}`)
    if (user.sessions.length > 0) {
      user.sessions.forEach(session => {
        console.log(`    Session expires: ${session.expires}`)
        console.log(`    Session token: ${session.sessionToken.substring(0, 10)}...`)
      })
    }
  })
  
  // Check all sessions
  const allSessions = await prisma.session.findMany({
    include: {
      user: true
    },
    orderBy: {
      expires: 'desc'
    }
  })
  
  console.log(`\n\nTotal sessions: ${allSessions.length}`)
  allSessions.forEach(session => {
    const isExpired = session.expires < new Date()
    console.log(`Session for ${session.user.email}: ${isExpired ? 'EXPIRED' : 'ACTIVE'}`)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
