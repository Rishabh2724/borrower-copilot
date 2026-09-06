# Borrower Copilot

Borrower Copilot is a browser-based decision-support prototype for Indian borrowers. It helps a borrower consider four questions before approaching a lender: **should I borrow at all; how much may I be eligible for; what rate is fair; and what EMI should I agree to?** It is not a lending, underwriting, or approval system.

## What It Does

The assessment collects a borrowing goal, product, income range, household cash flow, existing EMIs, and selected risk inputs. It then produces a borrowing decision, a lender-style capacity estimate separate from a conservative borrower-safe estimate, an indicative rate/APR range, and a Negotiation Card.

## Features

- Adaptive question flow: product options depend on purpose; security questions appear for LAP and gold; employment-specific follow-ups appear where applicable; known credit scores are only requested when the borrower says they know one.
- Income-range normalization and stability classification.
- Separate lender-style and household-aware, borrower-safe affordability calculations.
- Product-specific base rate bands, credit/income/debt/bounce adjustments, three repayment illustrations, and an income-drop stress test.
- A decision of `BORROW`, `BORROW LESS`, or `DON'T BORROW`, plus plain-language reasons.
- A Negotiation Card with target amount, EMI, rate, APR, and a suggested lender conversation.
- Client-side flow with no login or bureau pull; the UI states that no personal data is stored.

## Quick Start

From this directory:

```bash
npm install
npm run dev
```

Build the application with:

```bash
npm run build
```

There is no test script in `package.json`. The available static check is:

```bash
npm run lint
```

## How It Works

```text
User → Adaptive Questions → Borrower Profile → Rules Engine
     → Assessment Result → Negotiation Card
```

`AssessmentFlow` gathers and conditionally displays questions. `buildBorrowerProfile` normalizes the income range and derives stability. `assessBorrower` composes affordability, safe and lender-style amounts, rate, confidence, tenure illustrations, stress test, product fit, and decision modules. The results screen renders the assessment and the Negotiation Card.

## Core Outputs

- **Borrowing decision:** `BORROW`, `BORROW LESS`, or `DON'T BORROW`.
- **Lender-style amount:** a range inferred from lender-style new-EMI capacity at 36, 48, and 60 months. It is calculated but is not currently displayed in the results UI.
- **Borrower-safe amount:** a conservative maximum, and a requested-or-less minimum, constrained by household affordability and, for LAP/gold, modeled collateral caps.
- **Fair rate and APR:** an indicative annual rate band and a simplified fee-adjusted APR band.
- **Safe new EMI:** the conservative new-EMI ceiling.
- **Tenure illustrations:** 36, 48, and 60 months with EMI and total interest.
- **Stress test:** status and metrics for a 20% household-income decline.
- **Confidence:** low/medium/high with a capped completeness score and reasons.
- **Negotiation Card:** requested and recommended amount, EMI ceiling, rate/APR targets, reasons, and suggested wording.

## Design Decisions

- The app asks for an income range and derives stability automatically; it does not ask the borrower to self-classify stability.
- Average borrower income is reduced by a stability haircut before affordability is calculated.
- Lender-style affordability uses normalized borrower income only. Borrower-safe affordability also includes reported regular household income and household expenses.
- Existing EMIs reduce both capacity estimates. A credit score is optional: unknown is not treated as zero, but it widens pricing explanation and lowers confidence.
- Product base bands, FOIR ceilings, collateral caps, and stress thresholds are prototype assumptions, not universal lender policy or RBI requirements.
- Results include reasons so the calculation is explainable rather than a single opaque number.

## Limitations

This is decision support, not a lender approval engine. It does not verify income, ITR, employment, bureau data, collateral, offers, fees, or lender policy. Several displayed inputs are collected but not used by the current calculation (see [RULES.md](RULES.md)). It models only one income-drop stress scenario and uses simplified APR math.

## Personas

- **Priya:** a Bengaluru salaried software engineer seeking a personal loan for a wedding.
- **Ravi:** a Mysuru self-employed kirana-store owner seeking capital for stock and a delivery vehicle.
- **Anita:** a Hubballi informal worker seeking an electric scooter while carrying app-loan debt and a recent bounce.

The exact supplied facts, question paths, and the fields missing for a reproducible in-app result are in [PERSONA_TESTS.md](PERSONA_TESTS.md).
