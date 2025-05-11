/* eslint-disable @typescript-eslint/no-empty-function */
import { Component } from './Component';
import { IUser } from '../../types';

export class ContactsModalView extends Component {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorElement: HTMLElement;


  public onContactsChanged: (email: string, phone: string) => void = () => {};
  public onSubmitContactForm: (user: IUser) => void = () => {};

  constructor(container: HTMLElement) {
    super(container);

    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
    this.submitButton = container.querySelector('button[type="submit"], .button') as HTMLButtonElement;
    this.errorElement = container.querySelector('.form__errors') as HTMLElement;

    this.emailInput.addEventListener('input', () => this.triggerChanged());
    this.phoneInput.addEventListener('input', () => this.triggerChanged());

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      const user: IUser = {
        address: '',     
        email: this.emailInput.value.trim(),
        phone: this.phoneInput.value.trim(),
      };
      this.onSubmitContactForm(user);
    });
  }

  renderContactForm(user: IUser): void {
    this.emailInput.value = user.email;
    this.phoneInput.value = user.phone;
    this.triggerChanged();
  }

  render(): HTMLElement {
    this.triggerChanged();
    return this.container;
  }

  showError(message: string): void {
    if (message) {
      this.errorElement.textContent = message;
      this.submitButton.disabled = true;
    } else {
      this.errorElement.textContent = '';
      this.submitButton.disabled = false;
    }
  }

  private triggerChanged() {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();
    this.onContactsChanged(email, phone);
  }
}
