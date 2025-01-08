
const categories = [
	"Menabung",
	"Cicilan",
	"Rumah Tangga",
	"Transportasi",
	"Keluarga / Anak",
	"Charity",
	"Rutin lainnya",
	"lifestyle",
	"Lain lain tidak rutin"
];

const sources = [
	"CC BCA",
	"CC BRI",
	"CASH"
];

const determineCategory = (notes) => {
	for (const category of categories) {
		if (notes.toLowerCase().includes(category.toLowerCase())) {
			return category;
		}
	}
	return "Lain lain tidak rutin"; 
};

const determineSource = (notes) => {
	for (const source of sources) {
			if (notes.toLowerCase().includes(source.toLowerCase())) {
					return source;
			}
	}
	return "CASH"; // Default source if no match is found
};

const storeData = async (msg) => {

	const rawMessage = msg.text
	const splitMessage = rawMessage.trim().split('\n');
	const date = splitMessage[0]
	const dataCash = splitMessage.slice(1)
	const parsedData = dataCash.map(row => {
		const match = row.match(/(.*?)(\d+[\.,]?\d*)$/);
		if (match) {
			const notes = match[1].trim();
			const price = match[2].trim();
			const category = determineCategory(notes);
			const source = determineSource(notes);
			return {
				date,
				category,
				notes,
				source,
				price
			};
		}
		return null;
	}).filter(item => item !== null);

	const resultStoreData = []

	// Make API call for each index in parsedData
	for (const data of parsedData) {
		const bodyReq = JSON.stringify(data)
		try {
			const response = await fetch(process.env.URL_MAKE, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: bodyReq
			});
			const result = response.statusText;
			const responseData = {
				"status": result,
				"data": bodyReq
			}
			console.log('API call result:', responseData);
			resultStoreData.push(responseData)
		} catch (error) {
			console.error('Error making API call:', error);
			const responseData = {
				"status": error,
				"data": bodyReq
			}
			resultStoreData.push(responseData)
		}
	}

	return resultStoreData
}

export {
	storeData
}