# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения
Проект реализует паттерн MVP

## Типизация и модели данных
Все типы данных собраны в одной файле `src/types/index.ts` для обеспечения централизованного управлениями типами и моделями данных

## Основные типы
Уникальный идентификатор товара
```ts
export type ProductId = string
```
Тип способа оплаты
```ts
export type PaymentType = 'online' | 'upon receipt'
```

## Модели данных
Товар (Product)
Основная бизнес-сущность приложения.

```ts
export interface IProduct {
    id: ProductId
    description: string
    image: string
    title: string
    category: string
    price: number
}
```

Пользователь (User)
Используется для сбора контактной информации при оформлении заказа.
```ts
export interface IUser {
    address: string
    email: string
    phone: string
}
```

Корзина (Basket)
Наследует данные пользователя и добавляет информацию о заказанных товарах и способе оплаты.
```ts
export interface IBasket extends IUser {
    payment: PaymentType
    products: ProductId[]
}
```

## Модели отображения
Все интерфейсы отображения реализуют логику отрисовки и реакции на действия пользователя. Каждый компонент отвечает за определённый UI-блок.

Список товаров
```ts
export interface IIProductListView {
    renderProducts(products: IProduct[]): void
    showError(message: string): void
}
```

Карточка товара
```ts
export interface IProductCardView {
    renderProduct(product: IProduct): void
    AddToBasket(product: IProduct): void
}
```

Модальное окно товара
```ts
export interface IProductModalView {
    render(product: IProduct): void
    AddToBasket(product: IProduct): void
    closeModal(): void
}
```

Модальное окно корзины
```ts
export interface IBasketModalView {
    renderBasket(basket: IBasket): void
    RemoveProduct(product: IProduct): void
    closeModal(): void
}
```

Модальное окно оплаты
```ts
export interface IPaymentModalView {
    renderPaymentForm(basket: IBasket): void
    onPaymentSubmit(paymentDetails: { payment: PaymentType, address: string }): void
    showError(message: string): void
}
```

Модальное окно контактов
```ts
export interface IContactsModalView {
    renderContactForm(user: IUser): void
    onSubmitContactForm(user: IUser): void
}
```

Модальное окно успешного заказа
```ts
export interface ISuccessOrderModalView {
    renderSuccessMessage(): void
}
```

## Слой событий 
Реализация брокера событий (EventEmitter) позволяет подписываться на события, отписываться, передавать данные между слоями модели и представления.

**Интерфейс событийной системы**
```ts
export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```
on: подписка на события
emit: генерация события
trigger: возвращает коллбек, который вызывает событие (удобно при передаче функций в UI)


** Брокер событий, классическая реализация
В расширенных вариантах есть возможность подписаться на все события
или слушать события по шаблону например
**
```ts
export class EventEmitter implements IEvents {
    _events: Map<EventName, Set<Subscriber>>;

    constructor() {
        this._events = new Map<EventName, Set<Subscriber>>();
    }

    /**
     * Установить обработчик на событие
     */
    on<T extends object>(eventName: EventName, callback: (event: T) => void) {
        if (!this._events.has(eventName)) {
            this._events.set(eventName, new Set<Subscriber>());
        }
        this._events.get(eventName)?.add(callback);
    }

    /**
     * Снять обработчик с события
     */
    off(eventName: EventName, callback: Subscriber) {
        if (this._events.has(eventName)) {
            this._events.get(eventName)!.delete(callback);
            if (this._events.get(eventName)?.size === 0) {
                this._events.delete(eventName);
            }
        }
    }

    /**
     * Инициировать событие с данными
     */
    emit<T extends object>(eventName: string, data?: T) {
        this._events.forEach((subscribers, name) => {
            if (name === '*') subscribers.forEach(callback => callback({
                eventName,
                data
            }));
            if (name instanceof RegExp && name.test(eventName) || name === eventName) {
                subscribers.forEach(callback => callback(data));
            }
        });
    }

    /**
     * Слушать все события
     */
    onAll(callback: (event: EmitterEvent) => void) {
        this.on("*", callback);
    }

    /**
     * Сбросить все обработчики
     */пп
    offAll() {
        this._events = new Map<string, Set<Subscriber>>();
    }

    /**
     * Сделать коллбек триггер, генерирующий событие при вызове
     */
    trigger<T extends object>(eventName: string, context?: Partial<T>) {
        return (event: object = {}) => {
            this.emit(eventName, {
                ...(event || {}),
                ...(context || {})
            });
        };
    }
}
```