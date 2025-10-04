## UrbanEco‑Vision

UrbanEco‑Vision is a sustainability‑focused project combining a modern web app with data science notebooks to analyze and forecast key environmental and economic indicators. It supports data‑driven decision‑making across energy, water, and urban landscape domains.

### Live Demo

[urban-eco-vision-u46c.vercel.app](https://urban-eco-vision-u46c.vercel.app/)

### Quick Links

- Live Demo: [urban-eco-vision-u46c.vercel.app](https://urban-eco-vision-u46c.vercel.app/)
- Website app: `Website/`
- Notebooks: `Solar Energy Data and Time Series Model/`, `Water Data and Forecasting/`

### Table of Contents

- Why UrbanEco‑Vision?
- Key Features
- Pages
- Real‑World Impact
- 🤖 Machine Learning & Forecasting
- Screenshots
- Tech Stack
- Project Structure
- Architecture
- Getting Started
- Deployment (Vercel)
- Notebooks & Data
- Roadmap
- Contributing
- FAQ
- Contact
- References

### Why UrbanEco‑Vision?

- Make fast, informed decisions with clear visuals and scenario simulators
- Quantify long‑term ROI for solar adoption under inflation uncertainty
- Anticipate water quality changes early to protect public health
- Track landscape transformation to guide sustainable urban planning

## Key Features

- **Solar Dashboard**

  - Before/after visuals and potential assessment
  - Projected savings and 25‑year ROI context under inflation scenarios
  - Clear storytelling to support early solar adoption

- **Water Quality Dashboard**

  - Predicts a 0–100 water quality score using a trained model
  - Highlights critical features (Turbidity, pH, Dissolved Oxygen, Fecal Coliform)
  - Enables proactive mitigation planning

- **Landscape Dashboard**

  - Compare landscape change over time (before/after and gif animation)
  - Support urban greening strategies and monitoring

- **Forecast Simulator**

  - What‑if analysis with adjustable parameters
  - Explore future scenarios and their trade‑offs

- **Analyze**

  - Explore and interpret built‑in datasets and forecasts within the app (no file uploads)

- **Modern, Accessible UI**
  - Fast, responsive charts and components built with Radix UI + Recharts

## Pages

- Home • Solar Dashboard • Water Quality Dashboard • Landscape Dashboard • Forecast Simulator • Analyze • About

## Who Is It For?

- City planners, utilities, and NGOs seeking data‑backed sustainability actions
- Researchers and students exploring ML for environmental decision‑support
- Homeowners and businesses evaluating long‑term solar economics

## User Journeys

- "I want to know if solar makes sense for me": Open Solar Dashboard → compare visuals → view projected savings and 25‑year ROI under inflation → decide when to invest
- "I need to monitor water health": Open Water Quality Dashboard → review current trends and forecasted score → prioritize interventions where predicted decline is highest
- "I’m planning green spaces": Open Landscape Dashboard → compare before/after imagery or animation → identify areas for greening and restoration

## Real‑World Impact

- City planners and NGOs can prioritize interventions where they matter most
- Homeowners and businesses can time solar investments for maximal savings
- Water authorities can detect pollution trends early to reduce risk

## 🤖 Machine Learning & Forecasting

We applied advanced statistical and machine learning models to forecast critical sustainability indicators, supporting data‑driven decision‑making across energy and environmental domains.

### 📈 Inflation Forecasting

To anticipate Egypt’s inflation trends and highlight the economic advantage of early solar adoption, we employed:

- **ARIMA(1,1,0)**: Captures baseline inflation movements with quick fitting and easy interpretation.
- **SARIMAX**: An enhanced ARIMA model incorporating Interest Rate and Exchange Rate as exogenous factors, delivering more context‑aware and precise forecasts.

**Outcome**: The models demonstrate that inflation will gradually erode purchasing power—emphasizing that early solar investments secure long‑term financial savings over the next 25 years.

### 💧 Water Quality Forecasting

For environmental sustainability, we utilized machine learning to predict water quality scores (0–100 scale) and enable proactive water resource management.

- **Best Model**: Random Forest Regressor
- **Performance**: R² Score > 0.85, RMSE < 2.5
- **Key Features**: Turbidity, pH, Dissolved Oxygen, Fecal Coliform

**Outcome**: The model accurately forecasts water quality, allowing early pollution detection and informed decision‑making for sustainable water management.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite 6, React Router, Tailwind CSS, Radix UI, Recharts
- **State/Form**: React Hook Form, Zod
- **Tooling**: ESLint, TypeScript, PostCSS, Autoprefixer

## Project Structure

```
UrbanEco-Vision/
├─ Website/                # React + Vite web app
│  ├─ src/
│  │  ├─ pages/           # Dashboards & views
│  │  ├─ components/ui/   # UI primitives (Radix + shadcn)
│  │  └─ hooks/, lib/
│  └─ public/Images/      # Static assets
├─ Solar Energy Data and Time Series Model/   # Notebooks & datasets
├─ Water Data and Forecasting/                # Notebooks & datasets
└─ Documents/
```

## Architecture

- Frontend app in `Website/` built with React + TypeScript + Vite
- UI built from composable primitives (Radix UI) and responsive charts (Recharts)
- Styling with Tailwind CSS; utility helpers in `src/lib/`
- Routing with React Router; pages in `src/pages/`
- Data science notebooks and datasets live alongside the web app for transparent methodology

## Getting Started

### Prerequisites

- **Node.js** 18 or newer

### Install dependencies

```bash
cd Website
npm install
```

### Run the dev server

```bash
npm run dev
```

Vite will print a local URL you can open in your browser.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Deployment (Vercel)

This app is hosted on Vercel at the Live Demo link above. To deploy your own version:

1. Push this repository to GitHub/GitLab.
2. In Vercel, import the repository.
3. Set the project Root Directory to `Website` (monorepo setup).
4. Framework Preset: `Vite`. Build command: `npm run build`. Output dir: `dist`.
5. Deploy. Vercel will build from `Website` and host the static output.

## Roadmap

- Enrich geospatial layers and add map‑based analysis
- Expand forecasting inputs and model explainability
- Data upload templates and validation guidance
- Exportable reports and shareable scenario links

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## Notebooks & Data

- **Inflation & Time‑Series**: See `Solar Energy Data and Time Series Model/ARIMA&SARIMAX Inflation rate.ipynb` and associated datasets (`Final_GAS Statione_Data.xlsx`, `Full_Data_of_industries.xlsx`).
- **Water Quality**: See `Water Data and Forecasting/Water_Quality_Forecast.ipynb` and `cairo water quailty.xlsx`.

## FAQ

- **Does it work on mobile?** Yes—layouts and charts are responsive.
- **How accurate are the forecasts?** Models are evaluated with metrics like R² and RMSE and can be retrained as data evolves.
- **Can I use my own data?** Not in the app yet. You can adapt the notebooks for custom datasets.
- **Can I contribute?** Yes—see Contributing below.

## Contact

Have feedback or ideas? Please open an issue or reach out via your preferred channel.

## References

- Satellite landscape animation created using NASA Worldview: https://worldview.earthdata.nasa.gov/
- Before/after solar and landscape imagery sourced from NASA Earth Observatory: https://earthobservatory.nasa.gov/

## Scripts (from `Website/package.json`)

- **dev**: Start Vite dev server
- **build**: Type‑check then build
- **preview**: Preview production build
- **lint**: Run ESLint

## License

This project is licensed under the terms of the license in the `LICENSE` file.
