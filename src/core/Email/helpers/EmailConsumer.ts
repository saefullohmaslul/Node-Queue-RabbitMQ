import '../../../utils/environment'
import amqp, { ConsumeMessage } from 'amqplib'
import EmailService from '../service/EmailService'

export default class EmailConsumer {
  static async receiveQueue() {
    try {
      const connection = await amqp.connect({
        hostname: process.env.RABBITMQ_HOST,
        username: process.env.RABBITMQ_DEFAULT_USER,
        password: process.env.RABBITMQ_DEFAULT_PASS,
        vhost: process.env.RABBITMQ_DEFAULT_VHOST,
        protocol: process.env.RABBITMQ_PROTOCOL,
        port: parseInt(process.env.RABBITMQ_PORT as string)
      })
      const chanel = await connection.createChannel()
      await chanel.assertQueue('email', {
        durable: false
      })

      return chanel.consume(
        'email',
        async (message: ConsumeMessage | null) => {
          const msg = message?.content.toString()
          if (msg) {
            const data = JSON.parse(msg as string)

            const {
              to,
              from,
              subject,
              text,
              html
            } = data

            await EmailService.sendEmail({
              to,
              from,
              subject,
              text,
              html
            })
          }
        },
        {
          noAck: true
        })
    } catch (error) {
      throw error
    }
  }
}