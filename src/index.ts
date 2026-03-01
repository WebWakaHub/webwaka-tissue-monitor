/**
 * Monitor — Tissue Layer
 * Composes cells per BIOLOGICAL_GOVERNANCE_CONSTITUTION §4.1
 * Layer: tissue → depends on → cell
 */

import { MonitorComposition } from "@webwaka/cell-monitor";
import { TelemetryComposition } from "@webwaka/cell-telemetry";

export { MonitorComposition } from '@webwaka/cell-monitor';
export { TelemetryComposition } from '@webwaka/cell-telemetry';

/**
 * Monitor Composition
 * Assembles cell-layer components into a cohesive tissue-layer capability.
 */
export class MonitorComposition {
  private monitorComposition: MonitorComposition;
  private telemetryComposition: TelemetryComposition;

  constructor() {
    this.monitorComposition = new MonitorComposition();
    this.telemetryComposition = new TelemetryComposition();
  }
}

export * from "./types";
