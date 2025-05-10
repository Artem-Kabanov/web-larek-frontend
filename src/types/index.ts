// Модели данных

// ID товара
export type ProductId = string

// Интерфейс товара
export interface IProduct {
    id: ProductId
    description: string
    image: string
    title: string
    category: string
    price: number
}

// Интерфейс пользователя
export interface IUser {
    address: string
    email: string
    phone: string
}

// Интерфейс корзины
export interface IBasket extends IUser {
    payment: PaymentType
    products: ProductId[]
}

// Способ оплаты
export type PaymentType = 'online' | 'upon receipt';


// Интерфейсы отображений

// Список товаров
export interface IIProductListView {
    renderProducts(products: IProduct[]): void
    showError(message: string): void
}

// Карточка товара
export interface IProductCardView {
    renderProduct(product: IProduct): void
    AddToBasket(product: IProduct): void
}

// Модальное окно информации о товаре
export interface IProductModalView {
    render(product: IProduct): void
    AddToBasket(product: IProduct): void
    closeModal(): void;   
}
// Модальное окно корзины
export interface IBasketModalView {
    renderBasket(basket: IBasket): void
    RemoveProduct(product: IProduct): void
    closeModal(): void
}

// Модальное окно оплаты заказа
export interface IPaymentModalView {
    renderPaymentForm(basket: IBasket): void
    onPaymentSubmit(paymentDetails: { payment: PaymentType, address: string }): void
    showError(message: string): void
}

// Модальное окно ввода контактных данных
export interface IContactsModalView {
    renderContactForm(user: IUser): void
    onSubmitContactForm(user: IUser): void
}

// Модальное окно успешного завершения заказа
export interface ISuccessOrderModalView {
    renderSuccessMessage(): void
}