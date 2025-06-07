import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import type { SkillsResponse } from "../../../types/skillsResponse";

export const fetchCharacterStats = createAsyncThunk(
	'character/fetchCharacterStats',
	async (username: string) => {
		if (!username.trim()) {
			throw new Error('Please enter a username');
		}

		const corsProxy = 'https://corsproxy.io/';
		const apiUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${encodeURIComponent(username)}`;
		const response = await axios.get<SkillsResponse>(`${corsProxy}?url=${apiUrl}`, {
			headers: {
				'Origin': 'http://localhost:5173' // Replace with your actual origin in production
			}
		});

		const status = response.status;

		if (status < 200 || status >= 300) {
			throw new Error(response.status === 404
				? 'Player not found'
				: 'Failed to fetch data from OSRS HiScores');
		}

		const skills = response.data;

		return skills;
	}
);