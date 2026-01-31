import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Check if Gupics is already running
    const { stdout: checkProcess } = await execAsync(
      'ssh root@5.249.160.54 "pm2 describe gupics 2>/dev/null || echo \\"not_found\\""'
    )

    if (!checkProcess.includes('not_found')) {
      // Already running, just restart it
      await execAsync(
        'ssh root@5.249.160.54 "cd /srv/gupics.com && pm2 restart gupics"'
      )
    } else {
      // Start for the first time
      await execAsync(
        'ssh root@5.249.160.54 "cd /srv/gupics.com && pm2 start app.py --name gupics --interpreter python3 -- --host=0.0.0.0 --port=5000"'
      )
      await execAsync(
        'ssh root@5.249.160.54 "pm2 save --force"'
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Gupics project started successfully',
      url: 'http://5.249.160.54:5000'
    })
  } catch (error) {
    console.error('Failed to start Gupics:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to start project',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check if Gupics is running
    const { stdout } = await execAsync(
      'ssh root@5.249.160.54 "pm2 describe gupics 2>/dev/null || echo \\"not_found\\""'
    )

    const isRunning = !stdout.includes('not_found') && stdout.includes('online')

    return NextResponse.json({ 
      isRunning,
      url: isRunning ? 'http://5.249.160.54:5000' : null
    })
  } catch (error) {
    console.error('Failed to check Gupics status:', error)
    return NextResponse.json(
      { 
        isRunning: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
