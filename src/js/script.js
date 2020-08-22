function initSliderRange() {
	const sliderContainers = document.querySelectorAll('.filter-range');

	sliderContainers.forEach(container => {
		const slider = container.querySelector('.filter-specific__slider-range');
		const rangeMin = parseInt(slider.dataset.min);
		const rangeMax = parseInt(slider.dataset.max);
		const step = parseInt(slider.dataset.step);
		const filterInputs = container.querySelectorAll('input');

		noUiSlider.create(slider, {
			start: [rangeMin, rangeMax],
			connect: true,
			step: step,
			range: {
				'min': rangeMin,
				'max': rangeMax
			},
			format: {
			to: value => Math.round(value),
			from: value => Math.round(value)
			}
		});

		slider.noUiSlider.on('update', (values, handle) => { 
			filterInputs[handle].value = values[handle]; 
		});
	
		filterInputs.forEach((input, indexInput) => { 
			input.addEventListener('change', () => {
				slider.noUiSlider.setHandle(indexInput, input.value);
			});
		});
	})
}

initSliderRange();