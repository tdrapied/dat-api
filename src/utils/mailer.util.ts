import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../modules/users/entities/user.entity';

@Injectable()
export class MailerUtil {
  constructor(private readonly mailerService: MailerService) {}

  private async sendMail(
    receiver: string,
    subject: string,
    template: string,
    context: object,
  ): Promise<void> {
    // Skip sending emails in the test environment
    if (process.env.APP_ENV === 'testing') return;

    await this.mailerService.sendMail({
      to: receiver,
      subject,
      template,
      context,
    });
  }

  async sendActivationEmail(user: User, code: string): Promise<void> {
    await this.sendMail(
      user.email,
      'Activation de votre accès à Grappy',
      'user-activation',
      {
        user,
        link: `${process.env.WEB_ACTIVATE_ACCOUNT_URL}?code=${code}`,
      },
    );
  }
}
