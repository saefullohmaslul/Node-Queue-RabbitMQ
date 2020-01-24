import { Request, Response } from 'express'
import response from '../../../utils/response'
import EmailProducer from '../helpers/EmailProducer'
import EmailConsumer from '../helpers/EmailConsumer'

export default class EmailController {
  async sendEmail(req: Request, res: Response) {
    try {
      const {
        to,
        from,
        subject,
        text,
        html
      } = req.body

      const data = {
        to,
        from,
        subject,
        text,
        html
      }

      EmailProducer.sendQueue(JSON.stringify(data))
      EmailConsumer.receiveQueue()

      return response.success('Success send email', res, true)
    } catch (error) {
      return response.error('Error email not send', res, 'EMAIL_NOT_SENDING')
    }
  }
}