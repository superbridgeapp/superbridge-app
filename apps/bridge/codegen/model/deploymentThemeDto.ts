/**
 * Generated by orval v6.29.1 🍺
 * Do not edit manually.
 * API
 * API docs
 * OpenAPI spec version: 1.0
 */
import type { LinkDto } from './linkDto';
import type { ThemeDto } from './themeDto';

export interface DeploymentThemeDto {
  createdAt: string;
  id: string;
  links: LinkDto[];
  theme: ThemeDto;
  updatedAt: string;
}
