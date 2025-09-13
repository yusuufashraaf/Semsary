import { Step } from "src/types";
import styles from "./styles.module.css"

type IStepper = {
  currentStep: number;
  steps: Step[];
}

const Stepper = ({ currentStep, steps }: IStepper) => {
  return (
    <div className={styles["simple-stepper-container"] + " mb-4"}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        let stepClass = styles.step;

        if (stepNumber < currentStep) {
          stepClass += ` ${styles.completed}`; // Green for completed steps
        } else if (stepNumber === currentStep) {
          stepClass += ` ${styles.active}`; // Blue for the current step
        }

        return (
          <div key={stepNumber} className={stepClass}>
            <div className={styles["step-number"]}>{stepNumber}</div>
            <div className={styles["step-label"]}>{step}</div>
          </div>
        );
      })}
    </div>
  );
};
export default Stepper;