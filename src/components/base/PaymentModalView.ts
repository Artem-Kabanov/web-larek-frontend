/* eslint-disable @typescript-eslint/no-empty-function */
import { PaymentType } from '../../types';
import { Component } from './Component';

export class PaymentModalView extends Component {
  private addressInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private paymentButtons: HTMLButtonElement[];
  private errorContainer: HTMLElement;

  public onPaymentChanged: (details: { address: string; payment: PaymentType }) => void = () => {};
  public onPaymentSubmit: (details: { address: string; payment: PaymentType }) => void = () => {};

  private currentPayment: PaymentType | null = null;

  constructor(container: HTMLElement) {
    super(container);

    this.paymentButtons = Array.from(
      this.container.querySelectorAll('.order__buttons button')
    ) as HTMLButtonElement[];
    this.addressInput = this.container.querySelector(
      'input[name="address"]'
    ) as HTMLInputElement;
    this.submitButton = this.container.querySelector(
      'button.order__button'
    ) as HTMLButtonElement;
    this.errorContainer = this.container.querySelector(
      '.form__errors'
    ) as HTMLElement;

    this.paymentButtons.forEach((btn) =>
      btn.addEventListener('click', () => this.handlePaymentSelect(btn))
    );
    this.addressInput.addEventListener('input', () => this.emitChange());
    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.emitSubmit();
    });

    this.updateSubmitState();
  }

  render(): HTMLElement {
    return this.container;
  }

  set error(message: string) {
    if (message) {
      this.errorContainer.textContent = message;
      this.submitButton.disabled = true;
    } else {
      this.errorContainer.textContent = '';
      this.updateSubmitState();
    }
  }

  private handlePaymentSelect(btn: HTMLButtonElement) {
    this.paymentButtons.forEach((b) => b.classList.remove('button_alt-active'));
    btn.classList.add('button_alt-active');
    this.currentPayment = btn.getAttribute('name') as PaymentType;
    this.emitChange();
  }

  private emitChange() {
    const address = this.addressInput.value.trim();
    const payment = this.currentPayment;
    this.updateSubmitState();
    if (payment) {
      this.onPaymentChanged({ address, payment });
    }
  }

  private emitSubmit() {
    const address = this.addressInput.value.trim();
    const payment = this.currentPayment;
    if (payment) {
      this.onPaymentSubmit({ address, payment });
    }
  }
  
  private updateSubmitState() {
    const address = this.addressInput.value.trim();
    const valid = !!(address && this.currentPayment);
    this.submitButton.disabled = !valid;
  }
}
