import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import { USER_SHEET_IDS, RANGE_SHEET } from './constants.js';


const determineSheetID = (username) => {
	return USER_SHEET_IDS[username]
}

const determineRangeSheets = (username) => {
	return RANGE_SHEET[username]
}


const initializeGsheet = async () => {
	// Load credentials from your service account JSON file
	const credentials = JSON.parse(await readFile('./credentials.json', 'utf8'));

	// Set up Google Auth
	const auth = new google.auth.GoogleAuth({
		credentials,
		scopes: ['https://www.googleapis.com/auth/spreadsheets'],
	});

	// Get the authenticated client
	const client = await auth.getClient();

	// Initialize the Google Sheets API
	const Gsheets = google.sheets({ version: 'v4', auth: client });

	return Gsheets
}

export {
	determineSheetID,
	initializeGsheet,
	determineRangeSheets,
}