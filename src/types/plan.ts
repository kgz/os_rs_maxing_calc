import type { Methods } from "./method";
import type { skillsEnum } from "./skillsResponse";

type M = Methods[keyof Methods];

export type PlanMethod = {
  from: number;
  method: M;
};

export type Plan = {
  id: string;
  label: string;
  methods: PlanMethod[];
  type: keyof typeof skillsEnum;
};