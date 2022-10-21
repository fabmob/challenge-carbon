const {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, PieChart, Pie} = window.Recharts
const TEAM_SIZE = [1, 1]
const YEAR = 2022
const START_WEEK = 39
const END_WEEK = 41
const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step))
const WEEKS = range(START_WEEK, END_WEEK, 1)
const START_DATE = "2022-09-26" //"2022-10-31"
const END_DATE = "2022-10-16"
const MODES_MATCH = {
    3: "🚌 Bus",
    4: "🚆 Train",
    5: "🚗 Voiture",
    6: "✈️ Avion",
    7: "🚇 Métro",
    8: "🚊Tram",
    // 9: "LIGHTRAIL"
}
const MODES = Object.values(MODES_MATCH)
const MODES_COLORS = {
    "🚌 Bus": "hsl(171, 100%, 41%)",
    "🚆 Train": "hsl(217, 71%, 53%)",
    "🚗 Voiture": "hsl(204, 86%, 53%)",
    "✈️ Avion": "hsl(141, 53%, 53%)",
    "🚇 Métro": "hsl(48, 100%, 67%)",
    "🚊Tram": "hsl(348, 100%, 61%)"
}
function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
  
  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }

const initData = () => {
    let data = {
        co2perweek: [], // [{year: "", week:"", team1: {distance: x, co2: x}, team2: {distance:x, co2: x}}]
        co2perday: [], // [{date: "", team1: {distance: x, co2: x}, team2: {distance:x, co2: x}}],
        co2perhour: [], // [{hour: 0, team1: {distance: x, co2: x}, team2: {distance:x, co2: x}}],
        co2permode: [] // [{year: "", week:"", team1: {marche: 0, train: 0 ...}, team2: {marche: 0, train: 0 ...}}]
    }
    for (let week = START_WEEK; week <= END_WEEK; week++) {
        data.co2perweek.push({
            year: YEAR,
            week: week,
            readableWeek: "Semaine n°" + week,
            team1: {distance: 0, co2: 0, gCo2PerPersonPerKm: 0, distanceKm: 0}, 
            team2: {distance:0, co2: 0, gCo2PerPersonPerKm: 0, distanceKm: 0}
        })
        data.co2permode.push({
            year: YEAR,
            week: week,
            readableWeek: "Semaine n°" + week,
            team1: Object.fromEntries(MODES.map(i => [i, {distance: 0, co2: 0}])), 
            team2: Object.fromEntries(MODES.map(i => [i, {distance: 0, co2: 0}]))
        })
    }
    let currentDate = new Date(START_DATE)
    let endDate = new Date(END_DATE)
    while(currentDate < endDate) {
        data.co2perday.push({
            date: formatDate(currentDate),
            team1: {distance: 0, co2: 0}, 
            team2: {distance:0, co2: 0}
        })
        currentDate.setDate(currentDate.getDate() + 1)
    }

    for (let hour = 0; hour < 24; hour++) {
        data.co2perhour.push({
            hour: hour,
            team1: {distance: 0, co2: 0}, 
            team2: {distance: 0, co2: 0}
        })
    }
    return data
}
const App = () => {
    const [data, setData] = React.useState(initData())
    const [selectedWeek, setSelectedWeek] = React.useState(START_WEEK)
    const [teamID, setTeamID] = React.useState(parseInt(new URLSearchParams(window.location.search).get("team") || 1))
    React.useEffect(() => {
        const loadDataForTeam = (teamNumber) => {
            Papa.parse(`data/team${teamNumber}/co2perweek.csv`, {
                download: true,
                header: true,
                skipEmptyLines: 'greedy',
                complete: function(results) {
                    console.log("results", results)
                    setData(prevdata => {
                        let _co2perweek = prevdata.co2perweek.map(a => ({...a}));
                        for (let dataIndex = 0; dataIndex < results.data.length; dataIndex++) {
                            const res = results.data[dataIndex]
                            let index = parseInt(res["_id.week"]) - START_WEEK
                            if (index in _co2perweek)
                                _co2perweek[index][`team${teamNumber}`] = {
                                    distance: res.distance,
                                    distanceKm: Math.round(res.distance / 1000),
                                    co2: res.co2 / 1000,
                                    gCo2PerPersonPerKm: res.co2 / TEAM_SIZE[teamNumber -1] / (res.distance / 1000)
                                }
                        }
                        console.log("_co2perweek",_co2perweek)
                        return {
                            ...prevdata,
                            co2perweek: _co2perweek
                        }
                    })
                }
            })
    
            Papa.parse(`data/team${teamNumber}/co2perday.csv`, {
                download: true,
                header: true,
                skipEmptyLines: 'greedy',
                complete: function(results) {
                    console.log("co2perday", teamNumber, results)
                    setData(prevdata => {
                        let _co2perday = prevdata.co2perday.map(a => ({...a}));
                        for (let dataIndex = 0; dataIndex < results.data.length; dataIndex++) {
                            const res = results.data[dataIndex]
                            const dataDate = res["_id.year"] + "-" + padTo2Digits(res["_id.month"]) + "-" + padTo2Digits(res["_id.day"])
                            const diffInMs = new Date(dataDate) - new Date(START_DATE)
                            const index = diffInMs / (1000 * 60 * 60 * 24)
                            if (index in _co2perday)
                                _co2perday[index][`team${teamNumber}`] = {
                                    distance: res.distance,
                                    co2: res.co2 / 1000
                                }
                        }
                        return {
                            ...prevdata,
                            co2perday: _co2perday
                        }
                    })
                }
            })
    
            Papa.parse(`data/team${teamNumber}/co2perhour.csv`, {
                download: true,
                header: true,
                skipEmptyLines: 'greedy',
                complete: function(results) {
                    setData(prevdata => {
                        let _co2perhour = prevdata.co2perhour.map(a => ({...a}));
                        for (let dataIndex = 0; dataIndex < results.data.length; dataIndex++) {
                            const res = results.data[dataIndex]
                            let index = parseInt(res["_id.hour"])
                            _co2perhour[index][`team${teamNumber}`] = {
                                distance: res.distance,
                                co2: res.co2 / 1000
                            }
                        }
                        return {
                            ...prevdata,
                            co2perhour: _co2perhour
                        }
                    })
                }
            })
    
            Papa.parse(`data/team${teamNumber}/co2permode.csv`, {
                download: true,
                header: true,
                skipEmptyLines: 'greedy',
                complete: function(results) {
                    setData(prevdata => {
                        let _co2permode = prevdata.co2permode.map(a => ({...a}));
                        for (let dataIndex = 0; dataIndex < results.data.length; dataIndex++) {
                            const res = results.data[dataIndex]
                            let index = parseInt(res["_id.week"]) - START_WEEK
                            let mode = MODES_MATCH[parseInt(res["_id.mode"])]
                            if (index in _co2permode)
                                _co2permode[index][`team${teamNumber}`][mode] = {
                                    distance: res.distance,
                                    co2: res.co2 / 1000,
                                }
                        }
                        return {
                            ...prevdata,
                            co2permode: _co2permode
                        }
                    })
                }
            })
        }

        loadDataForTeam(1)
        loadDataForTeam(2)
        
    }, [])

    const updateTeamID = function(e) {
        e.preventDefault()
        setTeamID(prevTeamID => {
            if (prevTeamID === 1) {
                window.history.replaceState(null, null, "?team=2")
                return 2
            } else {
                window.history.replaceState(null, null, "?team=1")
                return 1
            }
        })
    }
    
    console.log(data)
    return (
        <div className="main">
            <section className="hero is-primary">
                <div className="hero-body">
                    <p className="title">
                        Challenge #CarbonDetox, équipe {teamID} 
                    </p>
                    <p className="subtitle">
                        <a className="is-size-7" href="#" onClick={updateTeamID}>Afficher l'autre équipe</a>
                    </p>
                </div>
            </section>
            <section className="section">
                <div className="tile is-ancestor">
                    <div className="tile is-vertical is-8">
                        <div className="tile is-parent">
                            <article className="tile is-child notification is-warning">
                                <p className="title">Emission moyenne par kilomètre</p>
                                <p className="subtitle">gCO2 / km / personne</p>
                                <div className="content">
                                    <ResponsiveContainer width="99%" height={250}>
                                        <BarChart data={data.co2perweek}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="readableWeek" />
                                            <YAxis />
                                            <Tooltip wrapperStyle={{ color: "black"}} formatter={(value) => `${Math.round(value)} gCO2 / km / personne`}/>
                                            <Legend />
                                            <Bar dataKey={teamID === 1 ? "team1.gCo2PerPersonPerKm" : "team2.gCo2PerPersonPerKm"} name="Mon équipe" fill="hsl(171, 100%, 41%)" />
                                            <Bar dataKey={teamID === 2 ? "team1.gCo2PerPersonPerKm" : "team2.gCo2PerPersonPerKm"} name="Autre équipe" fill="hsl(204, 86%, 53%)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>
                        </div>
                        <div className="tile is-parent">
                            <article className="tile is-child notification">
                                <p className="title">Emissions totales par jour</p>
                                <p className="subtitle">kgCO2 / jour</p>
                                <div className="content">
                                    <ResponsiveContainer width="99%" height={250}>
                                        <BarChart data={data.co2perday}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="date"/>
                                            <YAxis />
                                            <Tooltip formatter={(value) => `${value.toFixed(2)} kg CO2`}/>
                                            <Legend />
                                            <Bar dataKey={teamID === 1 ? "team1.co2" : "team2.co2"} name="Mon équipe" fill="hsl(171, 100%, 41%)" />
                                            <Bar dataKey={teamID === 2 ? "team1.co2" : "team2.co2"} name="Autre équipe" fill="hsl(204, 86%, 53%)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>
                        </div>
                        <div className="tile is-parent">
                            <article className="tile is-child notification">
                                <p className="title">Emissions totales par heure de la journée</p>
                                <p className="subtitle">kgCO2 / heure</p>
                                <div className="content">
                                    <ResponsiveContainer width="99%" height={250}>
                                        <BarChart data={data.co2perhour}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="hour"/>
                                            <YAxis />
                                            <Tooltip  formatter={(value) => `${value.toFixed(2)} kg CO2`}/>
                                            <Legend />
                                            <Bar dataKey={teamID === 1 ? "team1.co2" : "team2.co2"} name="Mon équipe" fill="hsl(171, 100%, 41%)" />
                                            <Bar dataKey={teamID === 2 ? "team1.co2" : "team2.co2"} name="Autre équipe" fill="hsl(204, 86%, 53%)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>
                        </div>
                        <div className="tile is-parent">
                            <article className="tile is-child notification">
                                <p className="title">(Bonus, hors-scope) Emission totales par semaine</p>
                                <p className="subtitle">kgCO2 / semaine</p>
                                <div className="content">
                                    <ResponsiveContainer width="99%" height={250}>
                                        <BarChart data={data.co2perweek}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="readableWeek" />
                                            <YAxis />
                                            <Tooltip wrapperStyle={{ color: "black"}} formatter={(value) => `${Math.round(value)} kgCO2`}/>
                                            <Legend />
                                            <Bar dataKey={teamID === 1 ? "team1.co2" : "team2.co2"} name="Mon équipe" fill="hsl(171, 100%, 41%)" />
                                            <Bar dataKey={teamID === 2 ? "team1.co2" : "team2.co2"} name="Autre équipe" fill="hsl(204, 86%, 53%)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>
                        </div>
                        <div className="tile is-parent">
                            <article className="tile is-child notification">
                                <p className="title">(Bonus, hors-scope) Distance totales par semaine</p>
                                <p className="subtitle">km / semaine</p>
                                <div className="content">
                                    <ResponsiveContainer width="99%" height={250}>
                                        <BarChart data={data.co2perweek}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="readableWeek" />
                                            <YAxis />
                                            <Tooltip wrapperStyle={{ color: "black"}} formatter={(value) => `${value} km`}/>
                                            <Legend />
                                            <Bar dataKey={teamID === 1 ? "team1.distanceKm" : "team2.distanceKm"} name="Mon équipe" fill="hsl(171, 100%, 41%)" />
                                            <Bar dataKey={teamID === 2 ? "team1.distanceKm" : "team2.distanceKm"} name="Autre équipe" fill="hsl(204, 86%, 53%)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>
                        </div>
                    </div>
                    <div className="tile is-parent is-4">
                        <article className="tile is-child notification">
                        <div className="content">
                            <p className="title">Emissions par mode de transport</p>
                            <p className="subtitle">Cumul équipe {teamID}</p>
                            <div className="content">
                                <div className="select" style={{marginBottom: "20px"}}>
                                    <select value={selectedWeek} onChange={e => setSelectedWeek(parseInt(e.target.value))}>
                                        {WEEKS.map(week => <option value={week} key={week}>Semaine {week}</option>)}
                                    </select>
                                </div>
                                <div>
                                </div>
                                <div style={{fontWeight: "bold"}}>
                                    {data.co2permode.map(weekModeData => {
                                        if (weekModeData.week === selectedWeek) {
                                            const modesData = Object.entries(teamID === 1 ? weekModeData.team1 :  weekModeData.team2)
                                            const pieModesData = modesData.map(([mode, value]) => ({mode: mode, co2: Math.round(value.co2 * 10)/10, fill: MODES_COLORS[mode]}))
                                            return <div key="1">
                                                <ResponsiveContainer width="99%" height={250}>
                                                <PieChart>
                                                    <Pie data={pieModesData} dataKey="co2" nameKey="mode" cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="hsl(171, 100%, 41%)" label={entry => (entry.percent < 0.05) ? null : (entry.mode + " " + entry.co2 + "kg")} labelLine={false} />
                                                </PieChart>
                                                </ResponsiveContainer>
                                                {modesData
                                                    .sort(([mode1, value1],[mode2, value2]) => value2.co2 - value1.co2)
                                                    .map(([mode, value]) => (
                                                    (mode !== "undefined") && <div className="box columns is-mobile" key={mode} style={{backgroundColor: "inherit", marginBottom: "20px"}}>
                                                        <div className="column" style={{color: MODES_COLORS[mode]}}>{mode}</div> 
                                                        <div className="column has-text-right">{value.co2.toFixed(2)}kg co2</div>
                                                    </div>
                                                ))}
                                            </div>
                                        }
                                    })}
                                </div>
                            </div>
                        </div>
                        </article>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <div className="content has-text-centered">
                    <p>
                        Plateforme crée par <a href="http://fabmob.io" target="_blank">La fabrique des mobilités</a> pour <a href="https://jadopteunprojet.com/" target="_blank">J'adopte un projet</a>. 
                        <br/>
                        Code source disponible sur <a href="#">Github</a>.
                    </p>
                </div>
            </footer>
        </div>
    )
}

const domContainer = document.getElementById('root');
ReactDOM.render(<App />, domContainer);
