import '../../../utils/environment'
import amqp from 'amqplib'

export default class EmailQueue {
  static async sendQueue(message: string) {
    try {
      const connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST,
        username: process.env.RABBITMQ_DEFAULT_USER,
        password: process.env.RABBITMQ_DEFAULT_PASS,
        vhost: process.env.RABBITMQ_DEFAULT_VHOST,
        protocol: process.env.RABBITMQ_PROTOCOL,
        port: parseInt(process.env.RABBITMQ_PORT as string)
      })
      const channel = await connection.createChannel()
      await channel.assertQueue('email', {
        durable: false
      })

      channel.sendToQueue('email', Buffer.from(message))
      return channel.close()
    } catch (error) {
      throw error
    }
  }
}