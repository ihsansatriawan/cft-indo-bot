import { determineSheetID, initializeGsheet, determineRangeSheets } from './gsheet.js'

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

// Transform array of objects to 2D array
const transformToSheetValues = (data) => {
	const headers = Object.keys(data[0]);
	const values = data.map(obj => headers.map(header => obj[header]));
	return [...values];
};

const storeData = async (msg, responseID) => {
	const userName = msg.chat.username;
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

	//////// GSHEET CALL

	try {
		const sheets = await initializeGsheet()

		// Define your spreadsheet details
		const spreadsheetId = determineSheetID(userName)
		const valuesGsheet = transformToSheetValues(parsedData);
		const rangeGsheet = determineRangeSheets(userName)

		const requestBody = {
			range: rangeGsheet,
			values: valuesGsheet,
		};

		const response = await sheets.spreadsheets.values.append({
			spreadsheetId,
			range: rangeGsheet,
			valueInputOption: 'USER_ENTERED', // Input mode
			resource: requestBody,
		});

		console.log(`${response.data.updates.updatedRows} row updated. responseID: ${responseID}. userName: ${userName}`);
		//TODO: need validate count parsedData === updatedRows
		const responseData = {
			status: "SUCCESS",
			data: parsedData
		}

		// console.log("responseData: ", responseData)

		return responseData
	} catch (error) {
		const errorMessage = `Error appending data to Google Sheets ${error.message} | responseID: ${responseID} | userName: ${userName}`;
		console.error(errorMessage);

		const responseData = {
			status: "FAILED",
			data: parsedData
		}

		return responseData
	}

	//////// GSHEET CALL
}

export {
	storeData
}