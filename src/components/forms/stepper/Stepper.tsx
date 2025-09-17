import { Step } from "src/types";

import styles from "./styles.module.css";

type StepStatus = 'pending' | 'completed' | 'skipped';

type IStepper = {
  currentStep: number;
  steps: Step[];
  statuses: Record<number, StepStatus>; 
}

const Stepper = ({ currentStep, steps, statuses }: IStepper) => {
  return (
    <div className={styles["simple-stepper-container"] + " mb-4"}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const status = statuses[stepNumber]; // Get the specific status for this step

        // --- REVISED LOGIC ---
        // Start with the base class
        let stepClass = styles.step;

        // Apply classes based on the status from the parent component
        if (status === 'completed') {
          stepClass += ` ${styles.completed}`; // Green for completed
        } else if (status === 'skipped') {
          stepClass += ` ${styles.skipped}`; // Yellow for skipped
        }

        // The 'active' class is for the step the user is currently viewing
        if (stepNumber === currentStep) {
          stepClass += ` ${styles.active}`; // Blue for the current step
        }

        return (
          <div key={stepNumber} className={stepClass}>
            {/* --- NEW: Add a checkmark for completed steps --- */}
            <div className={styles["step-number"]}>
              {status === 'completed' ? '✔' : stepNumber}
            </div>
            <div className={styles["step-label"]}>{step}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;