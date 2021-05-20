import { MenuItem, Select, FormControl, Card, CardContent } from "@material-ui/core"
import './App.css';
import InfoBox from './InfoBox.js';
import { useState, useEffect } from "react";
import Table from './Table.js';
import { sortData } from './util.js';
import Graph from './Graph.js';
import Map from './Map.js';
import 'leaflet/dist/leaflet.css';

function App() {

  const [countries, setCountries] = useState([]);
  const [c, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34, lng: -40 });
  const [mapZoom, setMapZoom] = useState(1.5);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      })
  }, [])

  useEffect(() => {
    // This code runs only when the component loads and countries state changes
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map(country => {
            return {
              name: country.country,
              value: country.countryInfo.iso2
            }
          })
          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountries();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' :
      `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setCountryInfo(data);
        setCountry(countryCode);
        countryCode === 'worldwide' ? setMapCenter([34, -40]) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        countryCode === 'worldwide' ? setMapZoom(1.5) : setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
          <h1>COVID-19 tracker</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={c}>
              <MenuItem value="worldwide" name="Worldwide">Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className="app_stats">
          <InfoBox active={casesType === "cases"} onClick={() => setCasesType("cases")} title="Covid-19 Cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox active={casesType === "recovered"} onClick={() => setCasesType("recovered")} title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox active={casesType === "deaths"} onClick={() => setCasesType("deaths")} title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        <Map center={mapCenter} zoom={mapZoom} countries={mapCountries} casesType={casesType} />
      </div>
      <Card className="app_right">
        <CardContent>
          <h2>Live cases by country</h2>
          <Table countries={tableData} />
          <h2>Worlwide new cases</h2>
          <Graph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;