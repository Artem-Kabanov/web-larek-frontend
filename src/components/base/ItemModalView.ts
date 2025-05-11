/* eslint-disable @typescript-eslint/no-empty-function */
import { CDN_URL } from '../../utils/constants';
import { IProduct } from '../../types';
import { Component } from './Component';

export class ItemModalView extends Component {
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private descriptionElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private addButton: HTMLButtonElement;
  private _item: IProduct;

  public onItemAdded: (item: IProduct) => void = () => {};

  constructor(container: HTMLElement, item: IProduct) {
    super(container);

    const title = container.querySelector('.card__title');
    const price = container.querySelector('.card__price');
    const desc = container.querySelector('.card__text');
    const image = container.querySelector('.card__image');
    const category = container.querySelector('.card__category');
    const button = container.querySelector('.card__button');

    if (!(title && price && desc && image && category && button)) {
      throw new Error('One or more required elements not found in the container.');
    }

    this.titleElement = title as HTMLElement;
    this.priceElement = price as HTMLElement;
    this.descriptionElement = desc as HTMLElement;
    this.imageElement = image as HTMLImageElement;
    this.categoryElement = category as HTMLElement;
    this.addButton = button as HTMLButtonElement;

    this.item = item;

    this.addButton.addEventListener('click', () => {
      this.onItemAdded(this._item);
      this.addButton.disabled = true;
    });
  }

  set item(item: IProduct) {
    this._item = item;
    this.titleElement.textContent = item.title;
    this.priceElement.textContent = `${item.price} синапсов`;
    this.descriptionElement.textContent = item.description;
    this.imageElement.src = CDN_URL + item.image;
    this.setCategory(item.category);
  }

  set isInBasket(value: boolean) {
    this.addButton.disabled = value;
  }

  render(): HTMLElement {
    super.render();
    return this.container;
  }

  private setCategory(value: string) {
    this.categoryElement.classList.remove(
      'card__category_soft',
      'card__category_other',
      'card__category_additional',
      'card__category_button',
      'card__category_hard'
    );

    this.categoryElement.textContent = value;


    let cls = 'card__category_other';
    switch (value) {
      case 'софт-скил':
        cls = 'card__category_soft';
        break;
      case 'дополнительное':
        cls = 'card__category_additional';
        break;
      case 'кнопка':
        cls = 'card__category_button';
        break;
      case 'хард-скил':
        cls = 'card__category_hard';
        break;
    }
    this.categoryElement.classList.add(cls);
  }
}
