import { NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationService: ClientProxy,
  ) {}

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2024-06-20',
    },
  );

  async createCharge(body: PaymentsCreateChargeDto) {
    try {
      // const { card, amount } = body;
      // console.log(card);
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card,
      // });

      const paymentIntent = await this.stripe.paymentIntents.create({
        // payment_method: paymentMethod.id,
        amount: body.amount * 100,
        confirm: true,
        // payment_method_types: ['card'],
        currency: 'usd',
        payment_method: 'pm_card_visa',
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });
      this.notificationService.emit('notify_email', {
        email: body.email,
        text: `Your payment has succeeded !!!`,
      });

      return paymentIntent;
    } catch (err) {
      this.notificationService.emit('notify_email', {
        email: body.email,
        text: `Your payment has failed !!!!! Sorry !!!!!`,
      });
      return err;
    }
  }
}
