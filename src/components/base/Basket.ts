/* eslint-disable @typescript-eslint/no-empty-function */
import { IProduct, IBasket, IUser, PaymentType } from '../../types/index';

export class Basket {
  public items: IProduct[] = [];
  public user: IUser = { address: '', email: '', phone: '' };
  public payment: PaymentType = 'online';
  public total = 0;

  public isValid = false;
  public isFirstStepValid = false;
  public onChange: () => void = () => {};
  public onSave: (data: IBasket) => void = () => {};

  constructor() {}

  

  setUserInfo(user: Partial<IUser>) {
    this.user = { ...this.user, ...user };
    this.validate();
  }

  setPaymentMethod(payment: PaymentType) {
    this.payment = payment;
    this.validate();
  }

  addProduct(product: IProduct): void {
    this.items.push(product);
    this.updateTotal();
    this.onChange();
  }

  removeProduct(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.updateTotal();
    this.onChange();
  }

  clear(): void {
    this.items = [];
    this.updateTotal();
    this.onChange();
  }

  getTotal(): number {
    return this.total;
  }

  updateTotal(): void {
    this.total = this.items.reduce((sum, item) => sum + item.price, 0);
  }

  validate(): void {
    const { address, email, phone } = this.user;
    const isAddressValid = address.trim().length > 0;
    const isEmailValid = email.trim().length > 0;
    const isPhoneValid = phone.trim().length > 0;
    const isPaymentValid = !!this.payment;

    this.isFirstStepValid = isAddressValid && isPaymentValid;
    this.isValid = isAddressValid && isEmailValid && isPhoneValid && isPaymentValid;
  }

  saveOrder(): void {
    if (!this.isValid) {
      console.error('Данные заказа невалидны');
      return;
    }

    const order: IBasket = {
      ...this.user,
      payment: this.payment,
      products: this.items.map(item => item.id),
    };

    this.onSave(order);
  }
}
