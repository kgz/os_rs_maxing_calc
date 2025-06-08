import type { Methods } from "./method";

type M = Methods[keyof Methods];

export type Plan = {
	label: string;
	methods: {
		[index: number]: {
		from: number;
		method: M;
	}}

}