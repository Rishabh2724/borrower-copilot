import type { Question } from "./questions";
import type {
  AnswerValue,
  IncomeRangeAnswer,
  ExistingLoanAnswer,
} from "./buildProfile";

interface QuestionCardProps {
  question: Question;
  value: AnswerValue;
  options?: {
    label: string;
    value: string;
  }[];

  onChange: (value: Exclude<AnswerValue, undefined>) => void;
}

function formatIndianNumber(
  value: string | number
): string {
  if (value === "") {
    return "";
  }

  const numericValue = Number(
    String(value).replace(/,/g, "")
  );

  if (Number.isNaN(numericValue)) {
    return String(value);
  }

  return numericValue.toLocaleString("en-IN");
}

export function QuestionCard({
  question,
  value,
  options,
  onChange,
}: QuestionCardProps) {
  const selectOptions =
    options ??
    question.options ??
    [];


  /*
   * ---------------------------------------------------------
   * INCOME RANGE
   * ---------------------------------------------------------
   *
   * The borrower enters both the lowest and highest
   * typical monthly income on the same screen.
   *
   * The two values are stored as:
   *
   * monthlyIncome: { min, max }
   *
   * The engine later derives income stability from
   * the range.
   */
  if (question.type === "income_range") {
    const minIncome =
      typeof value === "object" &&
      value !== null
        ? value.min ?? ""
        : "";

    const maxIncome =
      typeof value === "object" &&
      value !== null
        ? value.max ?? ""
        : "";

    const handleIncomeChange = (
      field: "min" | "max",
      rawValue: string
    ) => {
      const parsedValue =
        rawValue === ""
          ? undefined
          : Number(rawValue);

      const currentMin =
        typeof minIncome === "number"
          ? minIncome
          : undefined;

      const currentMax =
        typeof maxIncome === "number"
          ? maxIncome
          : undefined;

      const nextRange: IncomeRangeAnswer = {
        min:
          field === "min"
            ? parsedValue
            : currentMin,

        max:
          field === "max"
            ? parsedValue
            : currentMax,
      };

      onChange(nextRange);
    };

    return (
      <div className="question-card-content">
        <div className="income-range-inputs">
          <div className="income-range-field">
            <label>
              Lowest monthly income
            </label>

            <div className="number-input-wrapper">
              <span className="currency-symbol">
                ₹
              </span>

              <input
                className="large-number-input"
                type="number"
                inputMode="numeric"
                min={question.min}
                max={question.max}
                step={question.step ?? 1}
                value={
                  minIncome === ""
                    ? ""
                    : String(minIncome)
                }
                placeholder="40,000"
                onChange={(event) =>
                  handleIncomeChange(
                    "min",
                    event.target.value
                  )
                }
              />
            </div>

            {minIncome !== "" && (
              <p className="formatted-number">
                ₹
                {formatIndianNumber(
                  minIncome
                )}
              </p>
            )}
          </div>

          <div className="income-range-field">
            <label>
              Highest monthly income
            </label>

            <div className="number-input-wrapper">
              <span className="currency-symbol">
                ₹
              </span>

              <input
                className="large-number-input"
                type="number"
                inputMode="numeric"
                min={question.min}
                max={question.max}
                step={question.step ?? 1}
                value={
                  maxIncome === ""
                    ? ""
                    : String(maxIncome)
                }
                placeholder="80,000"
                onChange={(event) =>
                  handleIncomeChange(
                    "max",
                    event.target.value
                  )
                }
              />
            </div>

            {maxIncome !== "" && (
              <p className="formatted-number">
                ₹
                {formatIndianNumber(
                  maxIncome
                )}
              </p>
            )}
          </div>
        </div>

        <p className="input-hint">
          Enter a normal low month and a
          normal high month. Don't use an
          exceptional one-off month.
        </p>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * SELECT
   * ---------------------------------------------------------
   */

  if (question.type === "select") {
    if (selectOptions.length === 0) {
      return (
        <div className="question-card-content">
          <div className="validation-error">
            <strong>
              No suitable loan products found
            </strong>

            <span>
              We could not find a suitable
              loan product for the purpose
              selected. Please go back and
              choose another purpose.
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className="question-card-content">
        <div className="question-options">
          {selectOptions.map((option) => {
            const selected =
              value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`question-option ${
                  selected
                    ? "selected"
                    : ""
                }`}
                aria-pressed={selected}
                onClick={() =>
                  onChange(option.value)
                }
              >
                <span className="question-option-label">
                  {option.label}
                </span>

                {selected && (
                  <span className="question-option-check">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * BOOLEAN
   * ---------------------------------------------------------
   */

  if (question.type === "boolean") {
    return (
      <div className="question-card-content">
        <div className="boolean-options">

          <button
            type="button"
            className={`boolean-option ${
              value === true
                ? "selected"
                : ""
            }`}
            aria-pressed={
              value === true
            }
            onClick={() =>
              onChange(true)
            }
          >
            <span className="boolean-option-title">
              Yes
            </span>

            <span className="boolean-option-description">
              Yes, this applies to me
            </span>
          </button>

          <button
            type="button"
            className={`boolean-option ${
              value === false
                ? "selected"
                : ""
            }`}
            aria-pressed={
              value === false
            }
            onClick={() =>
              onChange(false)
            }
          >
            <span className="boolean-option-title">
              No
            </span>

            <span className="boolean-option-description">
              No, this does not apply to me
            </span>
          </button>

        </div>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * LOAN LIST
   * ---------------------------------------------------------
   *
   * Lets the borrower add one or more existing loans, each
   * capturing:
   *   Required: loan type, outstanding amount, monthly EMI
   *   Optional: interest rate, remaining tenure
   */

  if (question.type === "loan_list") {
    const LOAN_TYPE_OPTIONS: { label: string; value: string }[] = [
      { label: "Personal loan", value: "personal" },
      { label: "Home loan", value: "home" },
      { label: "Loan against property", value: "lap" },
      { label: "Gold loan", value: "gold" },
      { label: "Two-wheeler / vehicle loan", value: "two_wheeler" },
      { label: "Business loan", value: "business" },
      { label: "App / digital loan", value: "personal" },
    ];

    const loans: ExistingLoanAnswer[] =
      Array.isArray(value) ? (value as ExistingLoanAnswer[]) : [];

    const EMPTY_LOAN: ExistingLoanAnswer = {
      type: "personal",
      outstanding: 0,
      emi: 0,
      interestRate: undefined,
      remainingMonths: undefined,
    };

    const handleLoanChange = (
      index: number,
      field: keyof ExistingLoanAnswer,
      rawValue: string | number | undefined
    ) => {
      const updated = loans.map((loan, i) => {
        if (i !== index) return loan;

        if (field === "type") {
          return { ...loan, type: String(rawValue ?? "personal") };
        }

        if (rawValue === "" || rawValue === undefined) {
          const next = { ...loan };
          delete next[field];
          return next;
        }

        const numericValue = Number(rawValue);
        if (Number.isNaN(numericValue)) return loan;
        return { ...loan, [field]: numericValue };
      });

      onChange(updated);
    };

    const handleAddLoan = () => {
      onChange([...loans, { ...EMPTY_LOAN }]);
    };

    const handleRemoveLoan = (index: number) => {
      const updated = loans.filter((_, i) => i !== index);
      onChange(updated.length > 0 ? updated : []);
    };

    // Initialise with one blank row when first rendered.
    if (loans.length === 0) {
      return (
        <div className="question-card-content">
          <div className="loan-list-empty">
            <p className="loan-list-hint">
              Add each active loan separately.
              Monthly EMI and outstanding balance
              are different — enter both.
            </p>
            <button
              type="button"
              className="add-loan-button"
              onClick={() => onChange([{ ...EMPTY_LOAN }])}
            >
              + Add existing loan
            </button>
          </div>
        </div>
      );
    }

    const totalEmi = loans.reduce(
      (sum, l) => sum + Math.max(0, Number(l.emi ?? 0)),
      0
    );

    const totalOutstanding = loans.reduce(
      (sum, l) => sum + Math.max(0, Number(l.outstanding ?? 0)),
      0
    );

    return (
      <div className="question-card-content">
        <div className="loan-list">
          {loans.map((loan, index) => (
            <div
              key={index}
              className="loan-entry"
            >
              {/* ---- Loan header ---- */}
              <div className="loan-entry-header">
                <span className="loan-entry-label">
                  Loan {index + 1}
                </span>

                {loans.length > 1 && (
                  <button
                    type="button"
                    className="remove-loan-button"
                    aria-label={`Remove loan ${index + 1}`}
                    onClick={() => handleRemoveLoan(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* ---- Loan type ---- */}
              <div className="loan-field">
                <label
                  htmlFor={`loan-type-${index}`}
                  className="loan-field-label"
                >
                  Loan type
                </label>

                <select
                  id={`loan-type-${index}`}
                  className="loan-type-select"
                  value={loan.type ?? "personal"}
                  onChange={(e) =>
                    handleLoanChange(index, "type", e.target.value)
                  }
                >
                  {LOAN_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.label} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ---- Outstanding amount ---- */}
              <div className="loan-field">
                <label
                  htmlFor={`loan-outstanding-${index}`}
                  className="loan-field-label"
                >
                  Outstanding amount
                  <span className="loan-field-required">*</span>
                </label>

                <p className="loan-field-hint">
                  Total principal still remaining on this loan.
                </p>

                <div className="number-input-wrapper">
                  <span className="currency-symbol">₹</span>

                  <input
                    id={`loan-outstanding-${index}`}
                    className="large-number-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={1000}
                    value={
                      loan.outstanding !== undefined &&
                      loan.outstanding !== null &&
                      String(loan.outstanding) !== ""
                        ? loan.outstanding
                        : ""
                    }
                    placeholder="0"
                    aria-label={`Outstanding amount for loan ${index + 1}`}
                    onChange={(e) =>
                      handleLoanChange(index, "outstanding", e.target.value)
                    }
                  />
                </div>

                {loan.outstanding !== undefined &&
                  loan.outstanding !== null &&
                  String(loan.outstanding) !== "" && (
                    <p className="formatted-number">
                      ₹{formatIndianNumber(loan.outstanding)}
                    </p>
                  )}
              </div>

              {/* ---- Monthly EMI ---- */}
              <div className="loan-field">
                <label
                  htmlFor={`loan-emi-${index}`}
                  className="loan-field-label"
                >
                  Monthly EMI
                  <span className="loan-field-required">*</span>
                </label>

                <p className="loan-field-hint">
                  Fixed amount you pay each month for this loan.
                  This is what reduces your monthly repayment capacity.
                </p>

                <div className="number-input-wrapper">
                  <span className="currency-symbol">₹</span>

                  <input
                    id={`loan-emi-${index}`}
                    className="large-number-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    step={500}
                    value={
                      loan.emi !== undefined &&
                      loan.emi !== null &&
                      String(loan.emi) !== ""
                        ? loan.emi
                        : ""
                    }
                    placeholder="0"
                    aria-label={`Monthly EMI for loan ${index + 1}`}
                    onChange={(e) =>
                      handleLoanChange(index, "emi", e.target.value)
                    }
                  />
                </div>

                {loan.emi !== undefined &&
                  loan.emi !== null &&
                  String(loan.emi) !== "" && (
                    <p className="formatted-number">
                      ₹{formatIndianNumber(loan.emi)}
                    </p>
                  )}
              </div>

              {/* ---- Optional fields ---- */}
              <details className="loan-optional-section">
                <summary className="loan-optional-toggle">
                  Optional details
                </summary>

                <div className="loan-optional-fields">
                  {/* Interest rate */}
                  <div className="loan-field">
                    <label
                      htmlFor={`loan-rate-${index}`}
                      className="loan-field-label"
                    >
                      Interest rate (% per year)
                    </label>

                    <input
                      id={`loan-rate-${index}`}
                      className="large-number-input loan-rate-input"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={100}
                      step={0.1}
                      value={
                        loan.interestRate !== undefined &&
                        loan.interestRate !== null
                          ? loan.interestRate
                          : ""
                      }
                      placeholder="e.g. 14.5"
                      aria-label={`Interest rate for loan ${index + 1}`}
                      onChange={(e) =>
                        handleLoanChange(index, "interestRate", e.target.value)
                      }
                    />
                  </div>

                  {/* Remaining tenure */}
                  <div className="loan-field">
                    <label
                      htmlFor={`loan-tenure-${index}`}
                      className="loan-field-label"
                    >
                      Remaining tenure (months)
                    </label>

                    <input
                      id={`loan-tenure-${index}`}
                      className="large-number-input loan-tenure-input"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={
                        loan.remainingMonths !== undefined &&
                        loan.remainingMonths !== null
                          ? loan.remainingMonths
                          : ""
                      }
                      placeholder="e.g. 24"
                      aria-label={`Remaining tenure for loan ${index + 1}`}
                      onChange={(e) =>
                        handleLoanChange(index, "remainingMonths", e.target.value)
                      }
                    />
                  </div>
                </div>
              </details>
            </div>
          ))}

          {/* ---- Add another loan ---- */}
          <button
            type="button"
            className="add-loan-button"
            onClick={handleAddLoan}
          >
            + Add another loan
          </button>

          {/* ---- Totals summary ---- */}
          {loans.length > 1 && (
            <div className="loan-totals">
              <div className="loan-totals-row">
                <span>Total outstanding across all loans</span>
                <strong>₹{formatIndianNumber(totalOutstanding)}</strong>
              </div>

              <div className="loan-totals-row">
                <span>Total monthly EMI (used in affordability)</span>
                <strong>₹{formatIndianNumber(totalEmi)}</strong>
              </div>
            </div>
          )}
        </div>

        <p className="input-hint">
          Outstanding amount and monthly EMI are different.
          Outstanding is the debt remaining; EMI is your fixed
          monthly payment commitment.
        </p>
      </div>
    );
  }

  /*
   * ---------------------------------------------------------
   * NUMBER / CURRENCY
   * ---------------------------------------------------------
   */

  const numericValue =
    typeof value === "number" ||
    typeof value === "string"
      ? value
      : "";

  return (
    <div className="question-card-content">
      <div className="number-input-wrapper">

        {question.type ===
          "currency" && (
          <span className="currency-symbol">
            ₹
          </span>
        )}

        <input
          className="large-number-input"
          type="number"
          inputMode="numeric"
          min={question.min}
          max={question.max}
          step={
            question.step ?? 1
          }
          value={
            numericValue === ""
              ? ""
              : String(
                  numericValue
                )
          }
          placeholder={
            question.type ===
            "currency"
              ? "0"
              : "Enter a value"
          }
          aria-label={
            typeof question.text === "function"
              ? "Answer"
              : question.text
          }
          onChange={(event) => {
            const rawValue =
              event.target.value;

            if (rawValue === "") {
              onChange("");
              return;
            }

            const parsedValue =
              Number(rawValue);

            if (
              Number.isNaN(
                parsedValue
              )
            ) {
              return;
            }

            onChange(parsedValue);
          }}
        />
      </div>

      {numericValue !== "" && (
        <p className="formatted-number">
          {question.type ===
          "currency"
            ? `₹${formatIndianNumber(
                numericValue
              )}`
            : formatIndianNumber(
                numericValue
              )}
        </p>
      )}

      {(
        question.min !==
          undefined ||
        question.max !==
          undefined
      ) ? (
        <p className="input-hint">
          {question.min !==
            undefined &&
          question.max !==
            undefined
            ? `Enter a value between ${formatIndianNumber(
                question.min
              )} and ${formatIndianNumber(
                question.max
              )}.`
            : question.min !==
                undefined
              ? `Minimum: ${formatIndianNumber(
                  question.min
                )}`
              : `Maximum: ${formatIndianNumber(
                  question.max!
                )}`}
        </p>
      ) : null}
    </div>
  );
}
