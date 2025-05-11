export class MainPageView {
	private galleryElement: HTMLElement;
	private basketCounterElement: HTMLElement;

	constructor(galleryElement: HTMLElement) {
		this.galleryElement = galleryElement;
		this.basketCounterElement = document.querySelector(
			'.header__basket-counter'
		) as HTMLElement;
	}

	set counter(value: number) {
		this.basketCounterElement.textContent = value.toString();
	}

	set itemsViews(views: HTMLElement[]) {
		this.galleryElement.innerHTML = '';
		views.forEach((view) => {
			this.galleryElement.appendChild(view);
		});
	}

	showError(message: string): void {
		this.galleryElement.innerHTML = `<div class="error">${message}</div>`;
	}
}
