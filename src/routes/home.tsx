import { useEffect, useState } from 'react'
import { hc } from 'hono/client'
import type { HomeApp } from '@server/routes/home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/home')({
  component: WebSocketHome,
})

const client = hc<HomeApp>('wss://jaredstanbrook.com')

function WebSocketHome() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([])
  const [sensorData, setSensorData] = useState<any[]>([])

  useEffect(() => {
    // Initialize WebSocket connection
    const ws = client.api.home.ws.$ws()

    ws.onopen = () => {
      console.log('WebSocket connection established')
      setSocket(ws)
    }

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data)
      setMessages((prev) => [...prev, event.data])

      try {
        const parsedData = JSON.parse(event.data)
        if (Array.isArray(parsedData)) {
          setSensorData(parsedData) // Update sensor state
        }
      } catch (err) {
        console.error('Error parsing message:', err)
      }
    }

    ws.onclose = () => {
      console.log('WebSocket connection closed')
      setSocket(null)
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
    }

    // Cleanup on unmount
    return () => {
      ws.close()
    }
  }, [])

  return (
    <div>
      <h1>Motion Sensor WebSocket Client</h1>

      <h2>Sensor Data</h2>
      <ul>
        {sensorData.map((sensor, index) => (
          <li key={index}>
            <strong>{sensor.name}:</strong> {sensor.value}
          </li>
        ))}
      </ul>

      <h2>Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  )
}
