import { PlanetaryService } from '@Services';

describe('Planetary Service tests', () => {
	test('200 test', async () => {
		const result = await PlanetaryService.getPlanetImage({ params: { hd: true } });
		expect(result.copyright).toEqual('Pankod');
	});

	test('500 test', async () => {
		const result = await PlanetaryService.getPlanetImage({ params: { hd: false } });
		expect(result.copyright).toEqual('');
	});
});
