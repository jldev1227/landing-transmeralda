// src/lib/stores/device.ts
import { writable } from 'svelte/store';

function createDeviceStore() {
	const { subscribe, set } = writable(false);

	// ✅ CRÍTICO: Solo ejecutar en el cliente
	if (typeof window !== 'undefined') {
		function checkIsMobile(): boolean {
			try {
				const userAgent = navigator.userAgent.toLowerCase();
				const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
				const hasTouch = navigator.maxTouchPoints > 0;
				const isSmallScreen = window.innerWidth < 1024;
				
				return isMobileUA || (hasTouch && isSmallScreen);
			} catch {
				return false;
			}
		}

		function updateDevice() {
			set(checkIsMobile());
		}

		// Inicializar
		updateDevice();
		
		// Escuchar cambios de tamaño
		let resizeTimeout: ReturnType<typeof setTimeout>;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(updateDevice, 150);
		});
	}

	return {
		subscribe,
		update: () => {
			if (typeof window !== 'undefined') {
				const isMobile = window.innerWidth < 1024;
				set(isMobile);
			}
		}
	};
}

export const isMobile = createDeviceStore();